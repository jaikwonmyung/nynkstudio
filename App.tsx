import React, { useState, useEffect } from 'react';
import LoginPage from './src/components/LoginPage';
import SplitLandingPage from './src/components/SplitLandingPage';
import RedGenerationPage from './src/components/RedGenerationPage';
import WhiteGenerationPage from './src/components/WhiteGenerationPage';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'red' | 'white' | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    // Fallback to a build-time key (set via Vercel env GEMINI_API_KEY) so the
    // studio works without asking the user to paste a key. The key is NOT
    // committed to the repo.
    const envKey = (process.env.GEMINI_API_KEY || '').trim();
    if (storedKey) {
      setApiKey(storedKey);
    } else if (envKey) {
      setApiKey(envKey);
    } else {
      setShowKeyModal(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!tempKey.trim()) return;
    localStorage.setItem('gemini_api_key', tempKey);
    setApiKey(tempKey);
    setShowKeyModal(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey(null);
    setTempKey('');
    setShowKeyModal(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!selectedChannel) {
    return <SplitLandingPage onSelect={(channel) => setSelectedChannel(channel)} />;
  }

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
            placeholder="Paste API Key here..."
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
        </div>
      </div>
    );
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
