import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { X, User } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import { auth } from './firebase';
import LandingPage from './components/LandingPage';
import Account from './pages/Account';

const AppShell: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scamAlertsEnabled, setScamAlertsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });

    return () => unsub();
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#00C896]/20 border-t-[#00C896] rounded-full animate-spin" />
          <p className="text-[#00C896] font-bold animate-pulse">AI Financial Guardian Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0B0F14] text-white' : 'bg-gray-50 text-gray-900'} selection:bg-[#00C896]/30 transition-colors duration-300`}>
      <Toaster position="top-right" theme={darkMode ? 'dark' : 'light'} richColors />

      <Routes>
        <Route
          path="/account"
          element={user ? <Navigate to="/" replace /> : <Account darkMode={darkMode} />}
        />
        <Route
          path="/"
          element={
            user ? (
              <LandingPage
                darkMode={darkMode}
                user={user}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            ) : (
              <Navigate to="/account" replace />
            )
          }
        />
      </Routes>

      <AnimatePresence>
        {isProfileModalOpen && user && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${darkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-200'} w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden`}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">User Profile</h3>
                  <button
                    onClick={() => setIsProfileModalOpen(false)}
                    className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00C896] to-blue-500 p-1 mb-4">
                    <div className={`w-full h-full ${darkMode ? 'bg-[#111827]' : 'bg-white'} rounded-[22px] flex items-center justify-center`}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-20 h-20 rounded-full object-cover" />
                      ) : (
                        <User className={`w-12 h-12 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                      )}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold">{user.displayName || 'Guest User'}</h4>
                  <p className="text-gray-400 text-sm">{user.email || 'No email'}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className={`p-4 ${darkMode ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-100 border-gray-200'} rounded-2xl border`}>
                    <p className="text-gray-500 text-xs mb-1">Phone Number</p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>

                  <div className={`p-4 ${darkMode ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-100 border-gray-200'} rounded-2xl border`}>
                    <p className="text-gray-500 text-xs mb-1">Account Status</p>
                    <p className="text-[#00C896] font-bold">Verified Premium</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#00C896] text-white font-bold rounded-2xl hover:bg-[#00A67E] transition-all shadow-lg shadow-[#00C896]/20">
                  Edit Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`${darkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-200'} w-full max-w-sm h-full rounded-l-3xl border-l shadow-2xl overflow-hidden flex flex-col`}
            >
              <div className="p-8 flex-1">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold">Settings</h3>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Dark Mode</p>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Switch between dark and light themes</p>
                    </div>

                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-[#00C896]' : 'bg-gray-300'}`}
                    >
                      <motion.div
                        animate={{ x: darkMode ? 26 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Scam Alerts</p>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Real-time notifications for risks</p>
                    </div>

                    <button
                      onClick={() => setScamAlertsEnabled(!scamAlertsEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${scamAlertsEnabled ? 'bg-[#00C896]' : 'bg-gray-300'}`}
                    >
                      <motion.div
                        animate={{ x: scamAlertsEnabled ? 26 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
