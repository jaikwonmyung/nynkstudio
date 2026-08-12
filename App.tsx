import React, { useState } from 'react';
import LockPage from './src/components/LockPage';
import LoginPage from './src/components/LoginPage';
import SplitLandingPage from './src/components/SplitLandingPage';
import RedGenerationPage from './src/components/RedGenerationPage';
import WhiteGenerationPage from './src/components/WhiteGenerationPage';
import GuidePage from './src/components/GuidePage';
import Cursor from './src/components/Cursor';
import BrandField from './src/components/BrandField';

// Site-wide lock. When true, everyone sees the fake blue screen (LockPage);
// the invisible dot in its bottom-right corner enters the studio.
// Set to false to open the site up again.
const SITE_LOCKED = true;

const App: React.FC = () => {
  const [lockBypassed, setLockBypassed] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'red' | 'white' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [checkingKey, setCheckingKey] = useState(false);

  // SECURITY: the API key is NEVER persisted (no localStorage, no baked-in env
  // key). It lives only in memory for the current session, so every time the
  // site is opened/reloaded the user must paste their own key again.
  // The gate used to accept any non-empty string, so a stray character or a
  // browser autofill let you in and the bad key only surfaced later as a failed
  // generation. Verify the key against the API before opening the studio.
  const handleSaveKey = async () => {
    const key = tempKey.trim();
    if (!key) {
      setKeyError('API 키를 입력해 주세요.');
      return;
    }
    // Do NOT pattern-match the vendor's key format. Google issues more than one
    // shape (classic "AIza...", newer "AQ...."), and guessing the format locks
    // out perfectly valid keys. Only catch obvious paste damage here and let
    // the API itself be the authority on whether the key works.
    if (/\s/.test(key) || key.length < 20) {
      setKeyError('키가 온전히 붙여넣어지지 않은 것 같습니다. 공백 없이 전체를 복사해 주세요.');
      return;
    }

    setCheckingKey(true);
    setKeyError('');
    try {
      // ListModels is the lightest authenticated call available.
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: { 'x-goog-api-key': key },
      });
      if (!res.ok) {
        // 400/401/403 all mean "this credential was rejected"; anything else is
        // a transient failure the user should just retry.
        setKeyError(
          [400, 401, 403].includes(res.status)
            ? '이 키로는 접속할 수 없습니다. 키가 맞는지, Generative Language API 사용 설정이 되어 있는지 확인해 주세요.'
            : `키를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요. (오류 ${res.status})`
        );
        return;
      }
      setApiKey(key);
      setShowKeyModal(false);
    } catch {
      setKeyError('네트워크에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setCheckingKey(false);
    }
  };

  const handleClearKey = () => {
    setApiKey(null);
    setTempKey('');
    setShowKeyModal(true);
  };

  // The lock screen is a disguise: it deliberately keeps the system cursor and
  // no motion, because it has to read as a real crash. So it renders alone.
  if (SITE_LOCKED && !lockBypassed) {
    return <LockPage onEnter={() => setLockBypassed(true)} />;
  }

  return (
    <>
      <Cursor />
      {renderPage()}
      {/* Guide is reachable from every screen past the lock — including the
          login and API-key steps, which is exactly where a first-time user
          needs it. */}
      {!showGuide && (
        <button
          onClick={() => setShowGuide(true)}
          aria-label="사용 가이드 열기"
          className="sm-lift fixed bottom-5 right-5 z-[90] flex items-center gap-2 py-2.5 px-4 rounded-full border border-[#E2AEBF] bg-[#FFE1E9] text-[11px] tracking-[0.2em] text-[#223055] hover:border-[#223055] transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#223055] inline-block"></span>
          가이드
        </button>
      )}
    </>
  );

  function renderPage() {
    if (showGuide) {
      return <GuidePage onBack={() => setShowGuide(false)} />;
    }

    if (!isAuthenticated) {
      return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

  // Ask for the API key right after login (before channel selection). The key
  // is kept in memory only and is required again on every visit/reload.
  if (!apiKey || showKeyModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFE1E9] p-6 relative overflow-hidden">
        <BrandField className="absolute inset-0 w-full h-full opacity-70" />
        <div className="sm-rise relative z-10 max-w-md w-full text-center space-y-6 bg-[#FFE1E9] p-8 border border-[#F0C8D5]">
          <img src="/sm-logo.png" alt="SM Entertainment Group" className="sm-mark" />
          <p className="text-[#6B5A60] text-xs">
            스튜디오에 들어가려면 Gemini API 키를 입력해 주세요.
          </p>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => { setTempKey(e.target.value); setKeyError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !checkingKey) handleSaveKey(); }}
            placeholder="API 키를 붙여넣어 주세요"
            autoFocus
            className="w-full bg-[#FFE1E9] border border-[#F0C8D5] p-3 text-zinc-900 text-xs outline-none focus:border-[#223055] transition-colors rounded-none placeholder:text-[#B08E9B]"
          />
          {keyError && (
            <p className="text-red-600 text-xs leading-relaxed text-left">{keyError}</p>
          )}
          <button
            onClick={handleSaveKey}
            disabled={checkingKey}
            className="sm-lift w-full py-3 bg-[#FFE1E9] hover:bg-[#FBD3DE] border border-[#F0C8D5] text-zinc-900 transition-colors text-sm font-medium rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingKey ? '키 확인 중…' : '스튜디오 입장'}
          </button>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="sm-underline inline-block text-xs text-[#8A737B] hover:text-[#223055] mt-4"
          >
            API 키 발급받기
          </a>
          <p className="text-[10px] text-[#B08E9B] pt-2">
            보안을 위해 키는 저장하지 않습니다. 방문하실 때마다 입력이 필요합니다.
          </p>
        </div>
        <div className="absolute bottom-6 left-0 w-full px-6 text-center text-[9px] tracking-[0.25em] uppercase text-[#A8919A] z-10">
          SM Entertainment Vision &amp; eXperience(VX) Center
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
  }
};

export default App;
