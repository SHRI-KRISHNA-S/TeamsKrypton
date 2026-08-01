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
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Button, Badge } from '../../common';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/api';

type AuthView = 'login' | 'register' | 'forgot' | 'reset' | 'verify';

export const AuthPages: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [view, setView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Input fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Eng');
  const [role, setRole] = useState('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  // Custom Validation messages
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (view === 'login') {
        if (!email.includes('@')) {
          setValidationError('Please enter a valid academic email address.');
          setIsLoading(false);
          return;
        }
        await login(email, password);
        navigate('/dashboard');
      } else if (view === 'register') {
        if (!name) {
          setValidationError('Full Name is required.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setValidationError('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        const res = await apiClient.post('/auth/register', {
          email,
          password,
          name,
          department,
          role,
        });

        if (res.data?.status === 'success') {
          setSuccessMsg('Account registered successfully. Please verify your email.');
          setView('verify');
        }
      } else if (view === 'forgot') {
        if (!email) {
          setValidationError('Please enter your email.');
          setIsLoading(false);
          return;
        }
        const res = await apiClient.post('/auth/forgot-password', { email });
        if (res.data?.status === 'success') {
          setSuccessMsg('A password reset link has been dispatched to your email inbox.');
        }
      } else if (view === 'reset') {
        if (password !== confirmPassword) {
          setValidationError('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        // Extract token from query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token') || '';
        const res = await apiClient.post('/auth/reset-password', { token, password });
        if (res.data?.status === 'success') {
          setSuccessMsg('Your password has been modified successfully. Redirecting to login...');
          setTimeout(() => {
            setView('login');
            setSuccessMsg('');
          }, 2000);
        }
      } else if (view === 'verify') {
        const res = await apiClient.post('/auth/verify-email', { token: verificationCode });
        if (res.data?.status === 'success') {
          setSuccessMsg('Email verified successfully! You can now log in.');
          setTimeout(() => {
            setView('login');
            setSuccessMsg('');
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      const errMsg = err.response?.data?.message || err.message || 'An error occurred during authentication';
      setValidationError(errMsg);
    } finally {
      setIsLoading(false);
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
            {view !== 'login' && (
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
              {view === 'verify' && 'Check your terminal console/logs for your email verification token.'}
            </p>
          </div>

          {/* Validation Banner alerts */}
          {validationError && (
            <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 dark:bg-rose-950/15 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2 animate-shake">
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

            {/* Department Picker (Register view only) */}
            {view === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Department</label>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-250 cursor-pointer"
                  >
                    <option value="Computer Science & Eng" className="dark:bg-[#080B11]">Computer Science & Eng</option>
                    <option value="Electrical Engineering" className="dark:bg-[#080B11]">Electrical Engineering</option>
                    <option value="Mechanical Engineering" className="dark:bg-[#080B11]">Mechanical Engineering</option>
                    <option value="Fine Arts" className="dark:bg-[#080B11]">Fine Arts</option>
                  </select>
                </div>
              </div>
            )}

            {/* Role Picker (Register view only) */}
            {view === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Requested Role</label>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-250 cursor-pointer"
                  >
                    <option value="STUDENT" className="dark:bg-[#080B11]">Student</option>
                    <option value="CLUB_PRESIDENT" className="dark:bg-[#080B11]">Club President</option>
                    <option value="FACULTY_COORDINATOR" className="dark:bg-[#080B11]">Faculty Coordinator</option>
                    <option value="COLLEGE_ADMIN" className="dark:bg-[#080B11]">College Admin</option>
                    <option value="SUPER_ADMIN" className="dark:bg-[#080B11]">Super Admin</option>
                  </select>
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
                    placeholder="Enter password"
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Verification Token</label>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                  <input
                    type="text"
                    required
                    placeholder="Enter verification token from logs"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                  />
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
              className="w-full mt-4 font-bold flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {view === 'login' && 'Sign In'}
                    {view === 'register' && 'Register Account'}
                    {view === 'forgot' && 'Send Reset Instructions'}
                    {view === 'reset' && 'Update Password'}
                    {view === 'verify' && 'Verify Email'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

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
