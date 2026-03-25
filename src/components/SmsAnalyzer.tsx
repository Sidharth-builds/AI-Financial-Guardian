import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, LoaderCircle, MessageSquareWarning, ScanSearch, ShieldAlert } from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';

interface ParsedTransaction {
  amount: number | null;
  upiId: string | null;
}

interface RiskAssessment {
  score: number;
  reasons: string[];
}

interface AnalysisResult {
  amount: number | null;
  upiId: string | null;
  score: number;
  reasons: string[];
  level: RiskLevel;
}

const SAMPLE_SCAM_SMS = '₹2500 debited to unknown@upi. Urgent verify your account now!';
const LOADING_STEPS = ['Reading SMS...', 'Extracting transaction...', 'Analyzing behavior...'];

const parseTransactionFromSms = (message: string): ParsedTransaction => {
  const amountMatch = message.match(/₹\s?(\d+)/i);
  const normalizedAmount = amountMatch ? Number(amountMatch[1]) : null;
  const upiMatch = message.match(/[a-zA-Z0-9._-]+@upi/i);

  return {
    amount: Number.isFinite(normalizedAmount) ? normalizedAmount : null,
    upiId: upiMatch?.[0] ?? null,
  };
};

const calculateRisk = (message: string, amount: number | null, upiId: string | null): RiskAssessment => {
  let score = 0;
  const reasons: string[] = [];
  const normalizedMessage = message.toLowerCase();
  const hasAnyKeyword = (keywords: string[]) => keywords.some((keyword) => normalizedMessage.includes(keyword));

  if (normalizedMessage.includes('unknown') || upiId?.toLowerCase().includes('unknown')) {
    score += 40;
    reasons.push('Receiver is unknown (first-time transaction)');
  }

  if ((amount ?? 0) > 2000) {
    score += 30;
    reasons.push(`High transaction amount: ₹${amount}`);
  }

  if (hasAnyKeyword(['urgent', 'verify', 'now', 'immediately'])) {
    score += 30;
    reasons.push('Urgency-based scam signal detected');
  }

  if (hasAnyKeyword(['request', 'approve', 'collect'])) {
    score += 40;
    reasons.push('Suspicious payment request detected');
  }

  if (hasAnyKeyword(['cashback', 'reward', 'offer'])) {
    score += 30;
    reasons.push('Possible reward/cashback scam');
  }

  if (hasAnyKeyword(['kyc', 'account suspension', 'blocked'])) {
    score += 30;
    reasons.push('Bank/KYC phishing attempt');
  }

  if (hasAnyKeyword(['courier', 'parcel', 'delivery'])) {
    score += 25;
    reasons.push('Delivery scam pattern detected');
  }

  return { score: Math.min(score, 100), reasons };
};

const getRiskLevel = (score: number): RiskLevel => {
  if (score > 70) {
    return 'high';
  }

  if (score >= 40) {
    return 'medium';
  }

  return 'low';
};

const SmsAnalyzer = () => {
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const canAnalyze = useMemo(() => message.trim().length > 0 && !isAnalyzing, [isAnalyzing, message]);

  const clearPendingTimeouts = () => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  useEffect(() => clearPendingTimeouts, []);

  const finalizeAnalysis = (input: string) => {
    const parsed = parseTransactionFromSms(input);
    const risk = calculateRisk(input, parsed.amount, parsed.upiId);

    setResult({
      amount: parsed.amount,
      upiId: parsed.upiId,
      score: risk.score,
      reasons: risk.reasons,
      level: getRiskLevel(risk.score),
    });
    setIsAnalyzing(false);
  };

  const startAnalysis = (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return;
    }

    clearPendingTimeouts();
    setResult(null);
    setIsAnalyzing(true);
    setActiveStep(0);

    LOADING_STEPS.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setActiveStep(index);
      }, index * 900);

      timeoutsRef.current.push(timeoutId);
    });

    const finalTimeoutId = window.setTimeout(() => {
      finalizeAnalysis(trimmedInput);
    }, LOADING_STEPS.length * 900);

    timeoutsRef.current.push(finalTimeoutId);
  };

  const handleAnalyze = () => {
    startAnalysis(message);
  };

  const handleUseSample = () => {
    setMessage(SAMPLE_SCAM_SMS);
    startAnalysis(SAMPLE_SCAM_SMS);
  };

  const resultTone =
    result?.level === 'high'
      ? {
          card: 'border-red-500/30 bg-red-500/10',
          badge: 'bg-red-500/15 text-red-600 dark:text-red-400',
          icon: 'text-red-500',
          bar: 'bg-red-500',
        }
      : result?.level === 'medium'
        ? {
            card: 'border-yellow-500/30 bg-yellow-500/10',
            badge: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
            icon: 'text-yellow-500',
            bar: 'bg-yellow-500',
          }
        : {
            card: 'border-[#00C896]/30 bg-[#00C896]/10',
            badge: 'bg-[#00C896]/15 text-[#009E78] dark:text-[#00C896]',
            icon: 'text-[#00C896]',
            bar: 'bg-[#00C896]',
          };

  return (
    <section className="py-24 px-6 bg-gray-50/70 dark:bg-[#111827]/40 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-[2.5rem] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-2xl"
        >
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 md:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#00C896]/20 bg-[#00C896]/10 px-4 py-2 text-sm font-bold text-[#009E78] dark:text-[#00C896]">
                <ScanSearch className="h-4 w-4" />
                SMS-Based Transaction Analysis
              </div>
              <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                SMS-Based Transaction Analysis
              </h2>
              <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Analyze transaction messages to build behavioral patterns and detect fraud
              </p>

              <div className="mt-8 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  Transaction SMS
                </label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Paste SMS like: ₹2500 debited to unknown@upi"
                  rows={5}
                  className="w-full resize-none rounded-[1.75rem] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-5 py-4 text-gray-900 dark:text-white outline-none transition-all focus:border-[#00C896] focus:ring-4 focus:ring-[#00C896]/10"
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00C896] px-6 py-4 font-bold text-white shadow-xl shadow-[#00C896]/20 transition-all hover:bg-[#00A67E] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAnalyzing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ShieldAlert className="h-5 w-5" />}
                  Analyze SMS
                </button>
                <button
                  type="button"
                  onClick={handleUseSample}
                  disabled={isAnalyzing}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 font-bold text-red-600 transition-all hover:bg-red-500/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
                >
                  <MessageSquareWarning className="h-5 w-5" />
                  Use Sample Scam SMS
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="mt-8 rounded-[2rem] border border-blue-500/20 bg-blue-500/10 p-6"
                  >
                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      <p className="font-bold">{LOADING_STEPS[activeStep]}</p>
                    </div>
                    <div className="mt-5 space-y-3">
                      {LOADING_STEPS.map((step, index) => {
                        const isCompleted = index < activeStep;
                        const isCurrent = index === activeStep;

                        return (
                          <div key={step} className="flex items-center gap-3 text-sm">
                            <div
                              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                                isCompleted || isCurrent ? 'bg-blue-500' : 'bg-blue-200 dark:bg-blue-900'
                              }`}
                            />
                            <span
                              className={`transition-colors ${
                                isCompleted || isCurrent
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="p-8 md:p-10 lg:p-12 bg-gradient-to-br from-gray-50 to-white dark:from-[#0F172A] dark:to-[#111827]">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Fraud Signal</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">AI Risk Explanation</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className={`rounded-[2rem] border p-6 shadow-lg ${resultTone.card}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${resultTone.badge}`}>
                          {result.level === 'high' ? 'High Risk' : result.level === 'medium' ? 'Medium Risk' : 'Looks Safe'}
                        </div>
                        <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                          Scam Probability: {result.score}%
                        </p>
                      </div>
                      {result.level === 'high' ? (
                        <AlertTriangle className={`h-8 w-8 shrink-0 ${resultTone.icon}`} />
                      ) : (
                        <CheckCircle2 className={`h-8 w-8 shrink-0 ${resultTone.icon}`} />
                      )}
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/60 dark:bg-black/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${resultTone.bar}`}
                      />
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Extracted Amount</p>
                        <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                          {result.amount !== null ? `₹${result.amount}` : 'Not found'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">UPI ID</p>
                        <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white break-all">
                          {result.upiId ?? 'Not found'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">AI Risk Explanation</p>
                      <div className="mt-4 rounded-2xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4">
                        {result.reasons.length > 0 ? (
                          <ul className={`space-y-3 text-sm leading-relaxed ${result.level === 'high' ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>
                            {result.reasons.map((reason) => (
                              <li key={reason} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm font-medium text-[#009E78] dark:text-[#00C896]">
                            No suspicious signals detected
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-white/5 p-8"
                  >
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Paste an SMS to simulate AI-assisted transaction screening.</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      We extract transaction clues like amount and receiver, score risk, and show how SMS history can train proactive scam detection.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SmsAnalyzer;
