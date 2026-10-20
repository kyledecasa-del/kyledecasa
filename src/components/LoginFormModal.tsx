import React, { useState } from 'react';
import { AuthUser, FitnessGoal, FitnessLevel } from '../types';
import {
  authenticateUser,
  registerNewUser,
  DEFAULT_REGISTERED_USERS
} from '../lib/storage';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
  KeyRound,
  UserCheck
} from 'lucide-react';

interface LoginFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'signin' | 'signup' | 'demo';
}

export const LoginFormModal: React.FC<LoginFormModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'demo'>(initialMode);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpGoal, setSignUpGoal] = useState<FitnessGoal>('muscle_gain');
  const [signUpLevel, setSignUpLevel] = useState<FitnessLevel>('intermediate');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Sign In submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signInEmail.trim() || !signInPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = authenticateUser(signInEmail, signInPassword);
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMsg(`Welcome back, ${res.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 500);
  };

  // Handle Sign Up submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signUpName.trim()) {
      setErrorMsg('Please enter your full athlete name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the biometric health data policy to proceed.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerNewUser({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: 'athlete',
        fitnessGoal: signUpGoal,
        fitnessLevel: signUpLevel
      });
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMsg(`Account created! Welcome to AuraFit, ${res.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 700);
      } else {
        setErrorMsg(res.error || 'Registration failed. Please try a different email.');
      }
    }, 600);
  };

  // Handle 1-Click Demo Login
  const handleSelectDemoUser = (email: string, pass: string) => {
    setErrorMsg(null);
    setSignInEmail(email);
    setSignInPassword(pass);
    setIsLoading(true);

    setTimeout(() => {
      const res = authenticateUser(email, pass);
      setIsLoading(false);
      if (res.success && res.user) {
        setSuccessMsg(`Authenticated as ${res.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 500);
      } else {
        setErrorMsg(res.error || 'Unable to authenticate demo account.');
      }
    }, 450);
  };

  // Handle Social Mock Login
  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      setIsLoading(false);
      const socialUser: AuthUser = {
        id: `user_${provider.toLowerCase()}_${Date.now()}`,
        name: provider === 'Google' ? 'Kyle Decasa (Google)' : 'Athlete (Apple)',
        email: provider === 'Google' ? 'kyledecasa@gmail.com' : 'athlete@icloud.com',
        role: 'athlete',
        fitnessGoal: 'muscle_gain',
        fitnessLevel: 'elite',
        lastLogin: 'Just now'
      };
      setSuccessMsg(`Connected via ${provider} Single Sign-On!`);
      setTimeout(() => {
        onLoginSuccess(socialUser);
        onClose();
      }, 500);
    }, 500);
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
    }, 500);
  };

  // Quick Guest Login Bypass
  const handleContinueAsGuest = () => {
    const guestUser: AuthUser = {
      id: `guest_${Date.now()}`,
      name: 'Guest Athlete',
      email: 'guest@aurafit.local',
      role: 'guest',
      isGuest: true,
      fitnessGoal: 'general_wellness',
      fitnessLevel: 'intermediate',
      lastLogin: 'Just now'
    };
    onLoginSuccess(guestUser);
    onClose();
  };

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 2, label: 'Good', color: 'bg-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(signUpPassword);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 my-6 text-slate-100 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-emerald-500/15 via-cyan-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors z-10"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 relative pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
              OmniSync AI Fitness Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Biometric Telemetry • Adaptive AI Routines • Real-Time HRV
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        {mode !== 'forgot' && (
          <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('demo');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'demo'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Demo</span>
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{successMsg}</div>
          </div>
        )}

        {/* ===================================== */}
        {/* 1. SIGN IN FORM                       */}
        {/* ===================================== */}
        {mode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Athlete Email Address</span>
                <span className="text-[10px] text-slate-500 font-normal">e.g. kyledecasa@gmail.com</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setForgotEmail(signInEmail);
                    setErrorMsg(null);
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 transition-colors outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Quick Hint */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember on this device</span>
              </label>

              <span className="text-[10px] text-slate-500">
                Demo pass: <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">password123</code>
              </span>
            </div>

            {/* Sign In Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Authenticating Biometrics...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to AuraFit</span>
                </>
              )}
            </button>

            {/* Quick SSO Social Dividers */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <span className="bg-slate-900 px-3">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.6-7.85-11.74-14.3-6.53-10.23-11.83-22.38-15.91-36.45-4.08-14.08-6.13-26.8-6.13-38.16 0-14.68 3.59-26.8 10.78-36.38 7.18-9.58 16.31-14.48 27.38-14.69 4.35 0 9.4 1.16 15.15 3.49 5.75 2.33 9.68 3.54 11.81 3.65 1.95 0 6.04-1.32 12.28-3.97 6.24-2.65 11.39-3.81 15.45-3.49 11.84.95 21.08 5.4 27.72 13.35-10.55 6.43-15.68 15.34-15.39 26.74.3 9.38 4.04 17.26 11.22 23.63 7.18 6.37 15.6 10.02 25.26 10.95-2.06 6.09-4.56 12.51-7.51 19.26zm-31.94-118.8c0 5.6-2.06 11.08-6.17 16.44-4.12 5.37-9.33 8.94-15.63 10.71-.24-1.48-.36-2.8-.36-3.97 0-5.39 2.12-10.74 6.36-16.05 4.24-5.31 9.42-8.79 15.54-10.45.16 1.11.26 2.22.26 3.32z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Guest Escape Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-xs text-slate-400 hover:text-emerald-300 font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                <span>Want to test first?</span>
                <span className="text-emerald-400 underline underline-offset-4 group-hover:text-emerald-300">
                  Continue as Guest Athlete
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </form>
        )}

        {/* ===================================== */}
        {/* 2. CREATE ACCOUNT FORM                */}
        {/* ===================================== */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Athlete Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@aurafit.ai"
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Fitness Level & Goal Side-by-side */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Fitness Level</label>
                <select
                  value={signUpLevel}
                  onChange={(e) => setSignUpLevel(e.target.value as FitnessLevel)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite Athlete</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Primary Goal</label>
                <select
                  value={signUpGoal}
                  onChange={(e) => setSignUpGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="muscle_gain">Muscle Hypertrophy</option>
                  <option value="fat_loss">Fat Loss & Leanness</option>
                  <option value="endurance">Endurance & VO2 Max</option>
                  <option value="injury_recovery">Joint & Recovery</option>
                  <option value="general_wellness">General Wellness</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Create Password</label>
                {signUpPassword && (
                  <span className={`text-[10px] font-bold ${strength.score === 3 ? 'text-emerald-400' : strength.score === 2 ? 'text-amber-400' : 'text-rose-400'}`}>
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-100 placeholder:text-slate-600 transition-colors outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {signUpPassword && (
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <div className={`h-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-800'}`} />
                  <div className={`h-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-800'}`} />
                  <div className={`h-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-800'}`} />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 transition-colors outline-none font-mono"
                />
              </div>
            </div>

            {/* Health Terms Check */}
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-[11px] leading-relaxed">
                I agree to the AuraFit biometric processing terms, safety telemetry, and AI sports science protocol.
              </span>
            </label>

            {/* Create Account Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Create Bio-Adaptive Account</span>
                </>
              )}
            </button>

            {/* Back to sign in */}
            <p className="text-center text-xs text-slate-400">
              Already have an athlete account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-emerald-400 hover:underline font-bold"
              >
                Sign In
              </button>
            </p>

          </form>
        )}

        {/* ===================================== */}
        {/* 3. ONE-CLICK DEMO ACCOUNTS            */}
        {/* ===================================== */}
        {mode === 'demo' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Instantly authenticate into test athlete personas with pre-configured telemetry, recovery scores, and workout histories:
            </p>

            <div className="space-y-2.5">
              {DEFAULT_REGISTERED_USERS.map((demoUser) => (
                <div
                  key={demoUser.id}
                  onClick={() => handleSelectDemoUser(demoUser.email, demoUser.password)}
                  className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 text-sm group-hover:scale-105 transition-transform">
                      {demoUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-200 group-hover:text-emerald-300 transition-colors">
                          {demoUser.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {demoUser.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{demoUser.email}</span>
                        <span>•</span>
                        <span className="capitalize">{demoUser.fitnessLevel}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-slate-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-xs text-slate-400 hover:text-slate-200 font-semibold"
              >
                ← Back to standard Sign In
              </button>
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* 4. FORGOT PASSWORD FLOW               */}
        {/* ===================================== */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <KeyRound className="w-4 h-4" />
              <span>Password Recovery</span>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reset instructions sent!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A biometric verification link has been dispatched to{' '}
                  <strong className="text-white">{forgotEmail}</strong>. Please check your inbox or use the 1-click demo login.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setForgotSent(false);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                <p className="text-xs text-slate-400">
                  Enter your athlete account email. We will send a secure password reset link to your inbox.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Registered Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <span>Send Reset Link</span>}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
