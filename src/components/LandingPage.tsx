import React, { useState } from 'react';
import { Shield, Lock, Zap, PieChart, ArrowRight, Menu, X, CheckCircle2, Globe, Smartphone, ShieldCheck, AlertTriangle, User, TrendingUp, ArrowUpRight, ArrowDownRight, Search, Filter, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import detectScam from '../utils/detectScam.js';
import { auth } from '../firebase';
import SmsAnalyzer from './SmsAnalyzer';
import TransactionHistory from './TransactionHistory';

interface LandingPageProps {
  darkMode: boolean;
  user: FirebaseUser | null;   // ✅ ADD THIS
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

const spendingData = [
  { label: 'Jan', savings: 1200 },
  { label: 'Feb', savings: 1800 },
  { label: 'Mar', savings: 900 },
  { label: 'Apr', savings: 2200 },
];

const weeklySpendingData = [
  { label: 'Monday', savings: 320 },
  { label: 'Tuesday', savings: 540 },
  { label: 'Wednesday', savings: 410 },
  { label: 'Thursday', savings: 680 },
  { label: 'Friday', savings: 520 },
  { label: 'Saturday', savings: 760 },
  { label: 'Sunday', savings: 430 },
];

const categories = [
  { name: 'Food & Dining', amount: 3200, icon: '🍔', color: '#00C896', percentage: 45 },
  { name: 'Transport', amount: 1200, icon: '🚗', color: '#3B82F6', percentage: 15 },
  { name: 'Shopping', amount: 2500, icon: '🛍️', color: '#F59E0B', percentage: 30 },
  { name: 'Entertainment', amount: 800, icon: '🎬', color: '#8B5CF6', percentage: 10 },
];

const recentTransactions = [
  { id: '1', title: 'Starbucks Coffee', amount: 450, date: 'Today, 10:24 AM', category: 'Food', type: 'expense', status: 'safe' },
  { id: '2', title: 'Amazon.in', amount: 2499, date: 'Yesterday, 8:15 PM', category: 'Shopping', type: 'expense', status: 'suspicious' },
  { id: '3', title: 'Salary Credit', amount: 85000, date: '20 Mar, 9:00 AM', category: 'Income', type: 'income', status: 'safe' },
  { id: '4', title: 'Netflix Subscription', amount: 649, date: '18 Mar, 11:30 AM', category: 'Entertainment', type: 'expense', status: 'safe' },
];

const LandingPage: React.FC<LandingPageProps> = ({ darkMode, user, onOpenProfile, onOpenSettings }) => {
  const navigate = useNavigate();
  const activeUser = user ?? auth.currentUser;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [scamCheck, setScamCheck] = useState({ upi: '' });
  const [scamResult, setScamResult] = useState<{ score: number; message: string; level: 'low' | 'medium' | 'high' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [analyticsView, setAnalyticsView] = useState<'weekly' | 'monthly'>('weekly');
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [isLoggingIn] = useState(false);
  const [isSigningUp] = useState(false);
  const isLoggedIn = true;

  const features = [
    {
      title: 'Real-time Scam Detection',
      description: 'Our AI monitors every transaction to identify and block suspicious activity before it happens.',
      icon: Shield,
      color: 'text-[#00C896]',
      bg: 'bg-[#00C896]/10',
    },
    {
      title: 'Smart Spending Insights',
      description: 'Get personalized advice on how to save more and spend smarter based on your habits.',
      icon: PieChart,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Bank-Grade Security',
      description: 'Your data is protected with 256-bit encryption and multi-factor authentication.',
      icon: Lock,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'dashboard', 'scam-check', 'analytics', 'security'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      setActiveSection(current || '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckScam = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction = {
      amount: 2500,
      merchant: 'Unknown Store',
      time: 'late-night',
      isNew: true,
    };

    const result = detectScam(transaction);

    setScamResult(result);
    setShowModal(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsProfileOpen(false);
    navigate('/account');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const analyticsData = analyticsView === 'weekly' ? weeklySpendingData : spendingData;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F14] text-gray-900 dark:text-white selection:bg-[#00C896]/30 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0B0F14]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-10 h-10 bg-[#00C896] rounded-xl flex items-center justify-center shadow-lg shadow-[#00C896]/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AI Financial Guardian</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollTo('dashboard')} 
              className={`transition-colors font-medium ${activeSection === 'dashboard' ? 'text-[#00C896]' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => scrollTo('analytics')} 
              className={`transition-colors font-medium ${activeSection === 'analytics' ? 'text-[#00C896]' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
            >
              Analytics
            </button>
            <button 
              onClick={() => scrollTo('security')} 
              className={`transition-colors font-medium ${activeSection === 'security' ? 'text-[#00C896]' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
            >
              Security
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pr-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-all active:scale-95 group"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00C896] to-blue-500 p-0.5">
                  <div className="w-full h-full bg-white dark:bg-[#111827] rounded-[10px] flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">Sidharth</span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-1">
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Account</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">sidharth@email.com</p>
                        </div>
                        <button 
                          onClick={() => { onOpenProfile(); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                          <User className="w-4 h-4" /> View Profile
                        </button>
                        <button 
                          onClick={() => { onOpenSettings(); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                          <Smartphone className="w-4 h-4" /> Settings
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <ArrowRight className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-400 hover:text-white">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#111827] border-b border-gray-800 p-6 space-y-4"
          >
            <button 
              onClick={() => { scrollTo('dashboard'); setIsMenuOpen(false); }} 
              className={`block w-full text-left font-medium ${activeSection === 'dashboard' ? 'text-[#00C896]' : 'text-gray-400'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => { scrollTo('analytics'); setIsMenuOpen(false); }} 
              className={`block w-full text-left font-medium ${activeSection === 'analytics' ? 'text-[#00C896]' : 'text-gray-400'}`}
              
            >
              
              Analytics
            </button>
            <button 
              onClick={() => { scrollTo('security'); setIsMenuOpen(false); }} 
              className={`block w-full text-left font-medium ${activeSection === 'security' ? 'text-[#00C896]' : 'text-gray-400'}`}
            >
              Security
            </button>
            <div className="pt-4 border-t border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Sidharth</p>
                <p className="text-xs text-gray-500">sidharth@email.com</p>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C896]/10 border border-[#00C896]/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-[#00C896]" />
              <span className="text-[#00C896] text-sm font-bold uppercase tracking-wider">AI-Powered Protection</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight text-gray-900 dark:text-white">
              Secure Your <span className="text-[#00C896]">Financial</span> Future with AI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
              The only financial guardian that learns your habits, blocks scams in real-time, and helps you save smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo('dashboard')}
                className="px-8 py-4 bg-[#00C896] text-white font-bold rounded-2xl hover:bg-[#00A67E] transition-all flex items-center justify-center gap-2 text-lg shadow-xl shadow-[#00C896]/20 active:scale-95"
              >
                Open Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Real UI Preview */}
            <div className="relative z-10 bg-white dark:bg-[#111827] rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden p-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Total Balance</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">₹1,24,500</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Monthly Spend</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">₹42,300</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Recent Transactions</p>
                {recentTransactions.slice(0, 3).map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${tx.type === 'income' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                        {tx.category === 'Food' ? '☕' : tx.category === 'Shopping' ? '🛍️' : '💰'}
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white text-sm font-medium flex items-center gap-2">
                          {tx.title}
                          {tx.status === 'suspicious' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-[#00C896]' : 'text-gray-900 dark:text-white'}`}>{tx.type === 'income' ? '+' : '-'}₹{tx.amount}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#00C896]/10 border border-[#00C896]/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00C896] rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white text-sm font-bold">Scam Shield Active</p>
                  <p className="text-[#00C896] text-xs">Real-time protection enabled</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-24 px-6 bg-gray-50/50 dark:bg-[#111827]/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Your Financial Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                A comprehensive overview of your wealth, spending habits, and AI-driven insights to keep you on track.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-gray-500 text-xs mb-1 uppercase font-bold tracking-widest">Savings Rate</p>
                <p className="text-2xl font-bold text-[#00C896]">62%</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-gray-500 text-xs mb-1 uppercase font-bold tracking-widest">Credit Score</p>
                <p className="text-2xl font-bold text-blue-500">784</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Balance & Transactions */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-[#00C896]/10 rounded-2xl">
                      <TrendingUp className="w-6 h-6 text-[#00C896]" />
                    </div>
                    <span className="text-xs font-bold text-[#00C896] bg-[#00C896]/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> +12.5%
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Balance</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">₹1,24,500.00</p>
                </div>
                <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                      <ArrowDownRight className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" /> -2.4%
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Monthly Spending</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">₹42,300.00</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                  <button className="text-[#00C896] text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${tx.type === 'income' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                          {tx.category === 'Food' ? '🍔' : tx.category === 'Shopping' ? '🛍️' : tx.category === 'Income' ? '💰' : '🎬'}
                        </div>
                        <div>
                          <h4 className="text-gray-900 dark:text-white font-bold flex items-center gap-2">
                            {tx.title}
                            {tx.status === 'suspicious' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          </h4>
                          <p className="text-gray-500 text-xs">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${tx.type === 'income' ? 'text-[#00C896]' : 'text-gray-900 dark:text-white'}`}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                        </p>
                        <p className="text-gray-500 text-xs">{tx.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights & Categories */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#00C896] to-[#00A67E] p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="text-sm font-bold uppercase tracking-widest">AI Financial Insight</span>
                  </div>
                  <p className="text-xl font-medium leading-relaxed mb-8">
                    "You've spent <span className="font-bold underline">₹3,200</span> on dining this week. Reducing this by 20% would help you reach your <span className="font-bold">New Car Goal</span> 2 months earlier."
                  </p>
                  <button className="w-full py-4 bg-white text-[#00C896] font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-lg">
                    Adjust Food Budget
                  </button>
                </div>
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              </div>

              <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
                <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white">Expense Categories</h3>
                <div className="space-y-6">
                  {categories.map((cat) => (
                    <div key={cat.name} className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center gap-3">
                          <span className="text-xl">{cat.icon}</span> {cat.name}
                        </span>
                        <span className="text-gray-900 dark:text-white font-bold">₹{cat.amount}</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${cat.percentage}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scam Detection Section */}
      <section id="scam-check" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#1F2937] p-10 md:p-16 rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-2xl text-center transition-colors duration-300"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Check Transaction Risk</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Before you pay, let our AI verify the UPI ID or account. We analyze millions of data points to ensure your money is safe.
            </p>

            <form onSubmit={handleCheckScam} className="grid md:grid-cols-4 gap-4 mb-10">
              <input 
                type="text" 
                placeholder="Enter UPI ID (e.g. user@upi)"
                required
                value={scamCheck.upi}
                onChange={(e) => setScamCheck({ ...scamCheck, upi: e.target.value })}
                className="md:col-span-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <button 
                type="submit"
                className="md:col-span-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
              >
                Check
              </button>
            </form>

            <AnimatePresence>
              {showModal && scamResult && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                  >
                    <div
                      className={`w-full max-w-lg p-8 rounded-3xl border bg-white dark:bg-[#1F2937] shadow-2xl ${
                        scamResult.level === 'high'
                          ? 'border-red-500/30'
                          : scamResult.level === 'medium'
                            ? 'border-yellow-500/30'
                            : 'border-[#00C896]/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <span
                            className={`font-bold text-lg ${
                              scamResult.level === 'high'
                                ? 'text-red-500'
                                : scamResult.level === 'medium'
                                  ? 'text-yellow-500'
                                  : 'text-[#00C896]'
                            }`}
                          >
                            Risk Score: {scamResult.score}%
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        {scamResult.level === 'high' ? (
                          <AlertTriangle className="text-red-500" />
                        ) : (
                          <CheckCircle2 className={scamResult.level === 'medium' ? 'text-yellow-500' : 'text-[#00C896]'} />
                        )}
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{scamResult.message}</p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <SmsAnalyzer />

      {/* Analytics Section */}
      <section id="analytics" className="py-24 px-6 bg-gray-50 dark:bg-[#111827]/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Deep Spending Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Understand where your money goes with detailed visualizations and AI-powered categorization.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {analyticsView === 'weekly' ? 'Weekly Spending Trends' : 'Monthly Spending Trends'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAnalyticsView('weekly')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                      analyticsView === 'weekly'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    WEEKLY
                  </button>
                  <button
                    onClick={() => setAnalyticsView('monthly')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                      analyticsView === 'monthly'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    MONTHLY
                  </button>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C896" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1f2937" : "#e5e7eb"} vertical={false} />
                    <XAxis dataKey="label" stroke={darkMode ? "#6b7280" : "#9ca3af"} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={darkMode ? "#6b7280" : "#9ca3af"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff', 
                        border: darkMode ? 'none' : '1px solid #e5e7eb', 
                        borderRadius: '16px', 
                        color: darkMode ? '#fff' : '#111827' 
                      }}
                      itemStyle={{ color: '#00C896' }}
                    />
                    <Area type="monotone" dataKey="savings" stroke="#00C896" strokeWidth={4} fillOpacity={1} fill="url(#colorSavings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white dark:bg-[#111827] p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-xl">
                <h3 className="text-xl font-bold mb-8 text-center text-gray-900 dark:text-white">Spending Mix</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="amount"
                      >
                        {categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {categories.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs text-gray-400 truncate">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-[2.5rem]">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-5 h-5" />
                  Savings Potential
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Based on your spending patterns, you could save an additional <span className="text-gray-900 dark:text-white font-bold">₹8,500</span> this month by optimizing your entertainment subscriptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-6 relative overflow-hidden bg-white dark:bg-[#0B0F14] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-sm font-bold uppercase tracking-wider">Advanced Protection</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">AI-Powered Security</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                Our proprietary AI models analyze transaction patterns in real-time, identifying potential scams before they can affect your account. We don't just alert you; we protect you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-[#00C896]" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-gray-900 dark:text-white">Zero-Latency Analysis</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Every transaction is scanned in under 50ms using our edge-AI network.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-gray-900 dark:text-white">Global Threat Database</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Connected to global fraud databases to stay ahead of the latest scam tactics.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">Scam Detection Engine</h3>
                  <div className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-full">LIVE SCAN</div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <span className="font-bold text-red-500">High Risk Detected</span>
                      </div>
                      <span className="text-red-500 font-bold">87%</span>
                    </div>
                    <div className="w-full bg-red-500/20 h-2 rounded-full mb-4 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '87%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="bg-red-500 h-full"
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      ⚠️ Scam Probability: 87% - This transaction matches patterns of known phishing attempts from unverified sources.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 text-xs mb-1">Verified Source</p>
                      <p className="text-red-500 font-bold">FAILED</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 text-xs mb-1">Pattern Match</p>
                      <p className="text-red-500 font-bold">SUSPICIOUS</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#00C896]/5 blur-[100px] rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Account Section */}
      {!isLoggedIn && (
        <section id="account" className="py-24 px-6 bg-gray-50 dark:bg-[#0B0F14] transition-colors duration-300">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#111827] p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#00C896]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#00C896]" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome to AI Financial Guardian</h2>
                <p className="text-gray-500 dark:text-gray-400">Secure your financial future today</p>
              </div>

              <div className="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-8">
                <button 
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authTab === 'login' ? 'bg-[#00C896] text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setAuthTab('signup')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authTab === 'signup' ? 'bg-[#00C896] text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Create Account
                </button>
              </div>

              <AnimatePresence mode="wait">
                {authTab === 'login' ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="name@example.com"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20 transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full py-4 bg-[#00C896] text-white font-bold rounded-xl hover:bg-[#00A67E] transition-all shadow-xl shadow-[#00C896]/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isLoggingIn ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : 'Login'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSignup}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="name@example.com"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20 transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSigningUp}
                      className="w-full py-4 bg-[#00C896] text-white font-bold rounded-xl hover:bg-[#00A67E] transition-all shadow-xl shadow-[#00C896]/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isSigningUp ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : 'Create Account'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      )}


      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F14] transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00C896] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">AI Financial Guardian</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 AI Financial Guardian. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
