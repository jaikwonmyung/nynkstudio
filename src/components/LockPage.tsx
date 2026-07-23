import React from 'react';

/**
 * Temporary service-lock screen. Rendered in place of the whole app when
 * SITE_LOCKED is true in App.tsx. Styled as an official "402 Payment Required"
 * system notice. To unlock: set SITE_LOCKED back to false (or revert this work).
 */
interface LockPageProps {
  /** Discreet hidden control to slip back into the app. */
  onEnter?: () => void;
}

const LockPage: React.FC<LockPageProps> = ({ onEnter }) => {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-zinc-200 p-6"
      style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
    >
      <div className="w-full max-w-xl border border-zinc-800 bg-[#0d0d0d]">
        {/* status bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-[11px] tracking-widest text-zinc-500">
          <span>NYNK STUDIO · SYSTEM</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
            SERVICE SUSPENDED
          </span>
        </div>

        <div className="px-8 py-12 space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] tracking-[0.3em] text-red-500">ERROR 402</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              PAYMENT REQUIRED
            </h1>
            <p className="text-[13px] leading-relaxed text-zinc-400">
              결제가 확인되지 않아 서비스가 일시 중단되었습니다.
              <br />
              This service has been suspended due to an outstanding payment.
            </p>
          </div>

          {/* payment notice — emphasized */}
          <div className="border border-red-900/60 bg-red-950/20 px-5 py-4">
            <p className="text-[11px] tracking-widest text-red-400">
              ACTION REQUIRED · 결제 필요
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-200">
              계정을 다시 활성화하려면 <span className="font-semibold text-white">미결제 금액을 정산</span>해 주세요.
              결제 완료가 확인되는 즉시 서비스가 자동으로 재개됩니다.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
              To restore access, please settle the outstanding balance.
              Access resumes automatically once payment is confirmed.
            </p>
          </div>

          {/* official-looking metadata */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-zinc-800 pt-6 text-[11px] text-zinc-500">
            <div>
              <span className="text-zinc-600">STATUS</span>
              <div className="text-zinc-300">402 · SUSPENDED</div>
            </div>
            <div>
              <span className="text-zinc-600">REF</span>
              <div className="text-zinc-300">NYNK-PAY-0001</div>
            </div>
            <div>
              <span className="text-zinc-600">NODE</span>
              <div className="text-zinc-300">nynkstudio.com</div>
            </div>
            <div>
              <span className="text-zinc-600">CONTACT</span>
              <div className="text-zinc-300">billing@nynkstudio.com</div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 px-4 py-2 text-[10px] tracking-widest text-zinc-600">
          © NYNK STUDIO — ALL SESSIONS TERMINATED
        </div>
      </div>

      {/* Hidden entry — nearly invisible dot in the bottom-right corner.
          Click it to slip back into the app. */}
      <button
        type="button"
        onClick={onEnter}
        aria-label="Enter"
        className="fixed bottom-3 right-3 h-4 w-4 rounded-full bg-transparent hover:bg-zinc-700/40 transition-colors focus:outline-none"
      />
    </div>
  );
};

export default LockPage;
