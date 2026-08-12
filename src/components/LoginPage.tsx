import React, { useState } from 'react';
import BrandField from './BrandField';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '1211') {
            onLogin();
        } else {
            setError('비밀번호가 올바르지 않습니다');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFE1E9] text-zinc-900 p-6 relative overflow-hidden">
            <BrandField className="absolute inset-0 w-full h-full opacity-70" />

            <div className="w-full max-w-sm sm-rise relative z-10">
                <div className="flex justify-center mb-8">
                    <img src="/sm-logo.png" alt="SM Entertainment Group" className="sm-mark" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            placeholder="비밀번호를 입력해 주세요"
                            className="w-full bg-[#FFE1E9] border border-[#F0C8D5] p-3 text-sm outline-none focus:border-[#223055] transition-colors rounded-none placeholder:text-[#B08E9B] text-center"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-xs text-center">{error}</p>
                    )}

                    {/* Hidden submit button to enable Enter key submission */}
                    <button type="submit" className="hidden" />
                </form>
            </div>

            <div className="absolute bottom-6 left-0 w-full pl-6 pr-6 sm:pr-44 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] tracking-[0.25em] uppercase text-[#A8919A] z-10">
                <span>SM Entertainment Vision &amp; eXperience(VX) Center</span>
                <span className="normal-case tracking-[0.12em]">The Future of Culture Technology</span>
            </div>
        </div>
    );
};

export default LoginPage;
