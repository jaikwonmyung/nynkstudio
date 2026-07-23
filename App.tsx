import React, { useState } from 'react';
import LoginPage from './src/components/LoginPage';
import SplitLandingPage from './src/components/SplitLandingPage';
import RedGenerationPage from './src/components/RedGenerationPage';
import WhiteGenerationPage from './src/components/WhiteGenerationPage';
import LockPage from './src/components/LockPage';

// TEMPORARY LOCK: while true, the entire site is replaced by the 402 lock page.
// To unlock, set this back to false (or revert the lock commit) and push.
const SITE_LOCKED = true;

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'red' | 'white' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  // When the site is locked, a discreet hidden control on the lock page can flip
  // this to true to let the visitor back into the app.
  const [lockBypassed, setLockBypassed] = useState(false);

  if (SITE_LOCKED && !lockBypassed) {
    return <LockPage onEnter={() => setLockBypassed(true)} />;
  }

  // SECURITY: the API key is NEVER persisted (no localStorage, no baked-in env
  // key). It lives only in memory for the current session, so every time the
  // site is opened/reloaded the user must paste their own key again.
  const handleSaveKey = () => {
    if (!tempKey.trim()) return;
    setApiKey(tempKey.trim());
    setShowKeyModal(false);
  };

  const handleClearKey = () => {
    setApiKey(null);
    setTempKey('');
    setShowKeyModal(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // Ask for the API key right after login (before channel selection). The key
  // is kept in memory only and is required again on every visit/reload.
  if (!apiKey || showKeyModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 border border-zinc-200">
          <h1 className="text-xl font-medium tracking-tight text-zinc-800">nynk studio</h1>
          <p className="text-zinc-500 text-xs">
            Enter your Gemini API Key to access the studio.
          </p>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveKey(); }}
            placeholder="Paste API Key here..."
            autoFocus
            className="w-full bg-white border border-zinc-200 p-3 text-zinc-900 text-xs outline-none focus:border-zinc-600 transition-colors rounded-none placeholder:text-zinc-300"
          />
          <button
            onClick={handleSaveKey}
            className="w-full py-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 transition-colors text-sm font-medium rounded-none"
          >
            Enter Studio
          </button>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-400 hover:text-zinc-900 block mt-4"
          >
            Get API Key
          </a>
          <p className="text-[10px] text-zinc-300 pt-2">
            For your security, the key is not saved — enter it each visit.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedChannel) {
    return <SplitLandingPage onSelect={(channel) => setSelectedChannel(channel)} />;
  }

  // Routing
  if (selectedChannel === 'red') {
    return (
      <RedGenerationPage
        apiKey={apiKey}
        setShowKeyModal={setShowKeyModal}
        onBack={() => setSelectedChannel(null)}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        handleClearKey={handleClearKey}
      />
    );
  } else {
    return (
      <WhiteGenerationPage
        apiKey={apiKey}
        setShowKeyModal={setShowKeyModal}
        onBack={() => setSelectedChannel(null)}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        handleClearKey={handleClearKey}
      />
    );
  }
};

export default App;
