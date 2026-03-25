import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { db } from "../firebase";

const TransactionHistory = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setErrorMessage("Unable to load transaction history right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <section className="px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Recent payments and their scam-risk evaluation.</p>
          </div>

          {!user ? (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-6 py-10 text-center text-gray-400">
              Sign in to view your transaction history
            </div>
          ) : isLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-6 py-10 text-center text-gray-400">
              Loading transactions...
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-500 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
              {errorMessage}
            </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-6 py-10 text-center text-gray-400">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-[#0B0F14] border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{txn.merchant}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{txn.amount}</p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">Risk Score</span>
                    <div
                      className={`text-sm font-bold ${
                        txn.riskScore > 70 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {txn.riskScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TransactionHistory;
