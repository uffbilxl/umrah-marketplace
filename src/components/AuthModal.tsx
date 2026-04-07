import { useState } from 'react';
import { X, Eye, EyeOff, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const STORES = ['Leicester', 'Liverpool', 'Huddersfield', 'Northampton'];

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'success'>('login');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successName, setSuccessName] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regStore, setRegStore] = useState('');
  const [regTerms, setRegTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const resetForms = () => {
    setLoginEmail(''); setLoginPass('');
    setRegName(''); setRegEmail(''); setRegPhone(''); setRegPass(''); setRegConfirm(''); setRegStore(''); setRegTerms(false);
    setError(''); setFieldErrors({}); setShowPass(false); setShowConfirmPass(false);
  };

  const switchMode = (m: 'login' | 'register') => {
    resetForms();
    setMode(m);
  };

  const fillDemo = () => {
    setLoginEmail('demo@umrahsupermarket.co.uk');
    setLoginPass('UmrahDemo2026!');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(loginEmail, loginPass);
    setLoading(false);
    if (err) {
      setError('Incorrect email or password');
      return;
    }
    toast.success('Welcome back!');
    onClose();
    resetForms();
  };

  const validateRegister = () => {
    const errs: Record<string, string> = {};
    if (!regName || regName.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!regEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = 'Please enter a valid email';
    if (!regPass || regPass.length < 8) errs.password = 'Password must be at least 8 characters';
    if (regPass !== regConfirm) errs.confirm = 'Passwords do not match';
    if (!regTerms) errs.terms = 'You must agree to the Terms & Privacy Policy';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setError('');
    setLoading(true);
    const { error: err } = await signUp(regEmail, regPass, regName.trim(), regPhone, regStore);
    setLoading(false);
    if (err) {
      if (err.message?.includes('already')) {
        setError('An account with this email already exists.');
      } else {
        setError(err.message || 'Registration failed');
      }
      return;
    }
    toast.success('Account created! Welcome to U Points');
    setSuccessName(regName.trim());
    setMode('success');
    setTimeout(() => {
      onClose();
      resetForms();
      setMode('login');
    }, 4000);
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      setError('Enter your email first, then click Forgot Password');
      return;
    }
    const { default: sb } = await import('@/integrations/supabase/client').then(m => ({ default: m.supabase }));
    await sb.auth.resetPasswordForEmail(loginEmail, { redirectTo: `${window.location.origin}/reset-password` });
    toast.info('If an account exists with that email, a reset link has been sent.');
  };

  const inputCls = "w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all";
  const fieldErr = (key: string) => fieldErrors[key] ? <p className="text-destructive text-xs mt-1">{fieldErrors[key]}</p> : null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-umrah-black/85" />
      <div className="relative bg-card rounded-lg w-full max-w-[420px] max-h-[90vh] overflow-y-auto shadow-[var(--shadow-lg)]" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {mode === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-header text-xl tracking-[0.08em] uppercase mb-2">Welcome to U Points, {successName}!</h2>
              <div className="gold-line mx-auto" />
              <p className="text-sm text-muted-foreground mb-6">You've earned 0 pts — start shopping to earn your first points!</p>
              <a href="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all">
                Start Shopping
              </a>
            </div>
          ) : mode === 'login' ? (
            <>
              {/* Logo + Header */}
              <div className="text-center mb-6">
                <img src="/images/umrah_logo.png" alt="Umrah Supermarket" className="h-12 mx-auto mb-4" />
                <h2 className="font-header text-xl tracking-[0.08em] uppercase">Welcome Back</h2>
                <div className="gold-line mx-auto mt-3" />
              </div>

              {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">{error}</div>}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input type="email" required placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={inputCls} />
                </div>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} className={inputCls} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input type="checkbox" className="rounded" /> Remember me
                  </label>
                  <button type="button" onClick={handleForgotPassword} className="text-xs text-secondary hover:underline">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-[2px] font-header text-sm font-bold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</> : 'Sign In'}
                </button>
              </form>

              {/* Demo hint */}
              <button type="button" onClick={fillDemo} className="w-full text-center text-[0.7rem] text-muted-foreground mt-4 hover:text-foreground transition-colors cursor-pointer">
                Demo: demo@umrahsupermarket.co.uk / UmrahDemo2026!
              </button>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button onClick={() => switchMode('register')} className="w-full py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                Create an Account
              </button>
            </>
          ) : (
            <>
              {/* Register */}
              <div className="flex items-center mb-4">
                <button onClick={() => switchMode('login')} className="text-muted-foreground hover:text-foreground transition-colors mr-3">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="font-header text-xl tracking-[0.08em] uppercase">Join U Points</h2>
                </div>
              </div>
              <div className="gold-line mb-6" />

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">
                  {error}{' '}
                  {error.includes('already') && (
                    <button onClick={() => switchMode('login')} className="underline font-semibold">Sign in instead?</button>
                  )}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <input required placeholder="Full Name" value={regName} onChange={e => setRegName(e.target.value)} className={inputCls} />
                  {fieldErr('name')}
                </div>
                <div>
                  <input required type="email" placeholder="Email Address" value={regEmail} onChange={e => setRegEmail(e.target.value)} className={inputCls} />
                  {fieldErr('email')}
                </div>
                <div>
                  <input placeholder="Phone Number (optional)" value={regPhone} onChange={e => setRegPhone(e.target.value)} className={inputCls} />
                </div>
                <div className="relative">
                  <input required type={showPass ? 'text' : 'password'} placeholder="Password (min 8 characters)" value={regPass} onChange={e => setRegPass(e.target.value)} className={inputCls} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {fieldErr('password')}
                </div>
                <div className="relative">
                  <input required type={showConfirmPass ? 'text' : 'password'} placeholder="Confirm Password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} className={inputCls} />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {fieldErr('confirm')}
                </div>
                <div>
                  <select value={regStore} onChange={e => setRegStore(e.target.value)} className={inputCls}>
                    <option value="">Preferred Store (optional)</option>
                    {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={regTerms} onChange={e => setRegTerms(e.target.checked)} className="mt-0.5 rounded" />
                    I agree to the Terms & Privacy Policy
                  </label>
                  {fieldErr('terms')}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-[2px] font-header text-sm font-bold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : 'Create Account & Join U Points'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
