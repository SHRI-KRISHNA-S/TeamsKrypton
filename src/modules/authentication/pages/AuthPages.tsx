import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  KeyRound, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Button, Badge } from '../../common';

type AuthView = 'login' | 'register' | 'forgot' | 'reset' | 'verify';

export const AuthPages: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>('login');
  
  // Input fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Custom Validation messages
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Simulator submit handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    if (view === 'login') {
      if (!email.includes('@')) {
        setValidationError('Please enter a valid academic email address.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters.');
        return;
      }
      // Redirect to dashboard on success
      navigate('/dashboard');
    } else if (view === 'register') {
      if (!name) {
        setValidationError('Full Name is required.');
        return;
      }
      if (!email.includes('@')) {
        setValidationError('Please enter a valid college email.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      // Show Verification View
      setView('verify');
    } else if (view === 'forgot') {
      if (!email) {
        setValidationError('Please enter your email.');
        return;
      }
      setSuccessMsg('A password reset link has been dispatched to your email inbox.');
    } else if (view === 'reset') {
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      setSuccessMsg('Your security password has been modified successfully. Redirecting to login...');
      setTimeout(() => {
        setView('login');
        setSuccessMsg('');
      }, 2000);
    } else if (view === 'verify') {
      // Direct login after mock verification code
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#080B11]">
      {/* Left panel - Decorative Illustration & Info */}
      <div className="lg:col-span-5 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-violet-950 text-white p-12 flex-col justify-between hidden lg:flex relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-[-20%] w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-[-10%] w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Top brand */}
        <div className="flex items-center gap-3 relative z-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white shadow-md font-display">
            CP
          </div>
          <span className="font-display font-bold text-base tracking-wide">ClubPortal</span>
        </div>

        {/* Illustration & Headline */}
        <div className="space-y-6 relative z-10 my-auto">
          <Badge variant="primary" className="bg-white/10 border-white/20 text-white font-semibold py-1 px-3">
            Premium Student Workspace
          </Badge>
          <h2 className="text-3xl font-bold font-display leading-tight">
            Connect. Engage. Elevate.
          </h2>
          <p className="text-slate-350 text-xs leading-relaxed max-w-sm">
            Access customized dashboards to control event setups, track memberships, request financial budgets, and secure digital merit badges.
          </p>

          {/* Floating mock widgets */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl space-y-3 max-w-sm">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span className="font-bold">Recent Certificates</span>
              <span className="text-emerald-400 font-semibold">Active Ledger</span>
            </div>
            <div className="h-0.5 bg-white/10 rounded" />
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-slate-100">HackTech 2025 winner badge</span>
              </div>
              <span className="text-[10px] text-slate-400">Issued</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-450 relative z-10 flex justify-between">
          <span>Powered by React & Tailwind</span>
          <span>Security Verified</span>
        </div>
      </div>

      {/* Right panel - Forms */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12 md:px-20 relative">
        {/* Mobile top Brand */}
        <div className="lg:hidden flex items-center gap-3 absolute top-6 left-6 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-8.5 w-8.5 rounded-lg bg-primary text-white flex items-center justify-center font-bold font-display">
            CP
          </div>
          <span className="font-display font-bold text-slate-900 dark:text-white text-sm">ClubPortal</span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md space-y-7">
          {/* View titles */}
          <div className="space-y-2">
            {view !== 'login' && view !== 'verify' && (
              <button 
                onClick={() => { setView('login'); setValidationError(''); setSuccessMsg(''); }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-650 cursor-pointer mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </button>
            )}

            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {view === 'login' && 'Sign in to College Portal'}
              {view === 'register' && 'Create your Student Account'}
              {view === 'forgot' && 'Reset your password'}
              {view === 'reset' && 'Set new password'}
              {view === 'verify' && 'Verify your Email'}
            </h2>
            <p className="text-xs text-slate-400">
              {view === 'login' && 'Enter your campus credentials to access your portal.'}
              {view === 'register' && 'Fill out your profile details to register for clubs.'}
              {view === 'forgot' && 'Provide your institutional email to dispatch a link.'}
              {view === 'reset' && 'Establish a robust password for security parameters.'}
              {view === 'verify' && 'We emailed a verification link code to your address.'}
            </p>
          </div>

          {/* Validation Banner alerts */}
          {validationError && (
            <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 dark:bg-rose-950/15 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:bg-emerald-950/15 dark:border-emerald-900/40 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Forms */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Full Name (Register view only) */}
            {view === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Full Name</label>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                  <User className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Email Input (All except Reset and Verify views) */}
            {view !== 'reset' && view !== 'verify' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 font-sans">Academic Email Address</label>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Password Input (Login, Register, Reset) */}
            {(view === 'login' || view === 'register' || view === 'reset') && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Password</label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 relative">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter security key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-650 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (Register, Reset) */}
            {(view === 'register' || view === 'reset') && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Confirm Password</label>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Verification Code Box (Verify view only) */}
            {view === 'verify' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 text-center block">Enter 6-Digit Code</label>
                  <div className="flex gap-2 justify-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        defaultValue={i === 0 ? '7' : i === 1 ? '4' : i === 2 ? '0' : ''}
                        className="w-10 h-12 text-center rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 font-bold font-display text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center text-[10px] text-slate-400">
                  Didn't receive the email? <button type="button" className="text-primary font-bold hover:underline">Resend code</button>
                </div>
              </div>
            )}

            {/* Remember Me checkbox (Login view only) */}
            {view === 'login' && (
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-150 text-primary focus:ring-primary"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-450 font-semibold">Remember this device</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4 font-bold"
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              {view === 'login' && 'Sign In'}
              {view === 'register' && 'Register Account'}
              {view === 'forgot' && 'Send Reset Instructions'}
              {view === 'reset' && 'Update Password'}
              {view === 'verify' && 'Verify & Enter Dashboard'}
            </Button>
          </form>

          {/* Social Logins Divider & Buttons (Only Login & Register) */}
          {(view === 'login' || view === 'register') && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <div className="h-[1px] bg-slate-100 dark:bg-slate-800/80 flex-grow" />
                <span>Or connect via</span>
                <div className="h-[1px] bg-slate-100 dark:bg-slate-800/80 flex-grow" />
              </div>
              
              <div className="grid grid-cols-2 gap-3.5">
                <button 
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-100 dark:border-slate-800/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/35 cursor-pointer text-xs font-semibold text-slate-650 dark:text-slate-350"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Google Single Sign-On</span>
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-100 dark:border-slate-800/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/35 cursor-pointer text-xs font-semibold text-slate-650 dark:text-slate-350"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  <span>GitHub Account</span>
                </button>
              </div>
            </div>
          )}

          {/* Toggle between login/register */}
          <div className="text-center text-xs">
            {view === 'login' ? (
              <span className="text-slate-400">
                New to the community?{' '}
                <button
                  onClick={() => { setView('register'); setValidationError(''); setSuccessMsg(''); }}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </span>
            ) : view === 'register' ? (
              <span className="text-slate-400">
                Already registered?{' '}
                <button
                  onClick={() => { setView('login'); setValidationError(''); setSuccessMsg(''); }}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
