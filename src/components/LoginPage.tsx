import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '0000') {
            onLogin();
        } else {
            setError('Incorrect password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900 p-6">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
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
                            placeholder="Enter password"
                            className="w-full bg-white border border-zinc-200 p-3 text-sm outline-none focus:border-zinc-600 transition-colors rounded-none placeholder:text-zinc-300"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-xs">{error}</p>
                    )}

                    {/* Hidden submit button to enable Enter key submission */}
                    <button type="submit" className="hidden" />
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

