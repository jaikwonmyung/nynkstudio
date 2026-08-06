import React, { useEffect, useState } from 'react';

/**
 * Fake Windows-style blue screen (BSOD). Rendered in place of the whole app
 * when SITE_LOCKED is true in App.tsx. To unlock for everyone: set SITE_LOCKED
 * back to false. For the owner: click the invisible dot in the bottom-right
 * corner to slip into the app.
 */
interface LockPageProps {
  /** Discreet hidden control to enter the app. */
  onEnter?: () => void;
}

const LockPage: React.FC<LockPageProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);

  // Creep up like a real BSOD collect-info counter, then stall near the end.
  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1));
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full bg-[#0078D7] text-white overflow-hidden"
      style={{
        fontFamily:
          '"Segoe UI", "Segoe UI Variable", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-8 py-16 sm:px-16">
        <div className="text-[100px] leading-none font-light sm:text-[140px]">:(</div>

        <p className="mt-8 max-w-2xl text-[22px] leading-snug font-light sm:text-[28px]">
          Your device ran into a problem and needs to restart. We're just
          collecting some error info, and then we'll restart for you.
        </p>

        <p className="mt-8 text-[22px] font-light sm:text-[28px]">
          {progress}% complete
        </p>

        <div className="mt-14 flex items-start gap-5">
          {/* QR placeholder block, like the modern BSOD */}
          <div className="hidden h-[104px] w-[104px] shrink-0 bg-white p-[6px] sm:block">
            <div
              className="h-full w-full"
              style={{
                backgroundColor: '#0078D7',
                backgroundImage:
                  'repeating-linear-gradient(90deg, #000 0 6px, #fff 6px 12px), repeating-linear-gradient(0deg, #000 0 6px, transparent 6px 12px)',
                backgroundBlendMode: 'multiply',
              }}
            />
          </div>

          <div className="text-[13px] leading-relaxed font-light sm:text-[15px]">
            <p className="max-w-xl">
              For more information about this issue and possible fixes, visit
              <br />
              https://www.nynkstudio.com/stopcode
            </p>
            <p className="mt-5 max-w-xl">
              If you call a support person, give them this info:
              <br />
              Stop code: CRITICAL_PROCESS_DIED
            </p>
            <p className="mt-1 max-w-xl opacity-80">
              What failed: nynk_render.sys
            </p>
          </div>
        </div>
      </div>

      {/* Hidden entry — invisible dot in the bottom-right corner.
          Click it to enter the studio. */}
      <button
        type="button"
        onClick={onEnter}
        aria-label="Enter"
        title=""
        className="fixed bottom-2 right-2 h-6 w-6 bg-transparent focus:outline-none"
      />
    </div>
  );
};

export default LockPage;
