export function detectScam(transaction) {
  const { amount = 0, merchant = "", time = "", isNew = false } = transaction ?? {};

  let score = 0;

  if (amount > 5000) {
    score += 30;
  }

  if (merchant.toLowerCase().includes("unknown")) {
    score += 40;
  }

  if (time === "late-night") {
    score += 20;
  }

  if (isNew === true) {
    score += 30;
  }

  score = Math.min(score, 100);

  let message = "✅ Looks safe.";
  let level = "low";

  if (score > 80) {
    message = "🚨 High risk! Likely scam.";
    level = "high";
  } else if (score > 50) {
    message = "⚠️ Suspicious transaction.";
    level = "medium";
  }

  return {
    score,
    message,
    level,
  };
}

export default detectScam;
