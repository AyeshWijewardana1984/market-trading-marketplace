import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  Store,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Language } from '../../types/marketplace';
import {
  UserAccount,
  UserRole,
  verifyCredentials,
  generateNewAccount,
  generateRandomPassword,
  getStoredUsers,
  subscribeToUsers,
} from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess: (email: string, user?: UserAccount) => void;
  language?: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
  language = 'si',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Quick Credential Generator Drawer State
  const [showGenerator, setShowGenerator] = useState(false);
  const [genRole, setGenRole] = useState<UserRole>('super_admin');
  const [genCustomName, setGenCustomName] = useState('');
  const [generatedAccount, setGeneratedAccount] = useState<UserAccount | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Stored users for quick helper pills
  const [usersList, setUsersList] = useState<UserAccount[]>([]);

  useEffect(() => {
    if (isOpen) {
      setUsersList(getStoredUsers());
      setErrorMessage(null);
      setSuccessNotice(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = subscribeToUsers((latest) => {
      setUsersList(latest);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  // Quick 1-Click Autofill
  const handleAutoFill = (role: 'admin' | 'vendor' | 'customer' | 'buyer') => {
    setErrorMessage(null);
    setSuccessNotice(null);

    let target: UserAccount | undefined;
    if (role === 'admin') {
      target = usersList.find((u) => u.role === 'super_admin');
    } else if (role === 'vendor') {
      target = usersList.find((u) => u.role === 'vendor');
    } else if (role === 'buyer') {
      target = usersList.find((u) => u.role === 'buyer');
    } else {
      target = usersList.find((u) => u.role === 'customer');
    }

    if (target) {
      setEmail(target.email);
      setPassword(target.password);
      setSuccessNotice(
        language === 'si'
          ? `${target.name} (${target.role}) සඳහා තොරතුරු පිරවිණි. Password: ${target.password}`
          : `Autofilled credentials for ${target.name} (${target.role}). Password: ${target.password}`
      );
    }
  };

  // Generate New User / Admin Login
  const handleGenerateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newAcc = generateNewAccount({
      role: genRole,
      name: genCustomName.trim() || undefined,
    });
    setGeneratedAccount(newAcc);
    setEmail(newAcc.email);
    setPassword(newAcc.password);
    setErrorMessage(null);
    setSuccessNotice(
      language === 'si'
        ? `නව ${newAcc.role} ගිණුමක් උත්පාදනය විය! ඊමේල්: ${newAcc.email} | මුරපදය: ${newAcc.password}`
        : `Generated fresh ${newAcc.role} login! Email: ${newAcc.email} | Password: ${newAcc.password}`
    );
  };

  // Handle Login & Registration Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'login') {
      // Strict credentials check (verifies admin password properly)
      const res = verifyCredentials(email, password, 'PASSWORD');
      if (!res.success) {
        setErrorMessage(
          res.error || (language === 'si' ? 'වලංගු නොවන මුරපදයකි' : 'Invalid credentials entered.')
        );
        return;
      }

      onSuccess(res.user?.email || email.trim(), res.user);
      onClose();
    } else {
      // Register Mode
      if (!email.trim() || !password.trim()) {
        setErrorMessage(
          language === 'si'
            ? 'කරුණාකර ඊමේල් සහ මුරපදය ඇතුළත් කරන්න'
            : 'Please enter both email and password.'
        );
        return;
      }

      const assignedRole: UserRole = isVendor ? 'vendor' : 'customer';
      const created = generateNewAccount({
        role: assignedRole,
        email: email.trim(),
        name: name.trim() || undefined,
        password: password.trim(),
      });

      onSuccess(created.email, created);
      onClose();
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 pb-3 bg-gradient-to-r from-slate-900 to-[#11192d] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ea580c] flex items-center justify-center shadow-md text-white">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-display">
                {language === 'si' ? 'වෙළඳපල පිවිසුම් ද්වාරය' : 'Marketplace Access Terminal'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'si' ? 'පාරිභෝගික සහ පාලක (Admin) පිවිසුම් සත්‍යාපනය' : 'Authenticated Customer & Administrator Gateway'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Quick Demo Autofill Credentials Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-display">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'si' ? 'පරීක්ෂණ පිවිසුම් (1-Click Autofill)' : 'Quick Test Logins (1-Click Autofill)'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Verified Passwords</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-left">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleAutoFill('admin')}
                className="p-1.5 rounded-lg bg-white border border-orange-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-left cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-orange-600 font-display flex items-center gap-1">
                    👑 Admin
                  </span>
                  <span className="text-[9px] text-slate-400">Backend</span>
                </div>
                <div className="text-[10px] text-slate-700 font-mono truncate">admin</div>
                <div className="text-[9px] text-slate-500 font-mono truncate">Admin@2026!</div>
              </button>

              {/* Vendor Button */}
              <button
                type="button"
                onClick={() => handleAutoFill('vendor')}
                className="p-1.5 rounded-lg bg-white border border-sky-200 hover:border-sky-500 hover:bg-sky-50 transition-all text-left cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-sky-600 font-display flex items-center gap-1">
                    🏬 Vendor
                  </span>
                  <span className="text-[9px] text-slate-400">Seller</span>
                </div>
                <div className="text-[10px] text-slate-700 font-mono truncate">vendor@nordic</div>
                <div className="text-[9px] text-slate-500 font-mono truncate">Vendor@2026!</div>
              </button>

              {/* Buyer Button */}
              <button
                type="button"
                onClick={() => handleAutoFill('buyer')}
                className="p-1.5 rounded-lg bg-white border border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-purple-600 font-display flex items-center gap-1">
                    💼 Buyer
                  </span>
                  <span className="text-[9px] text-slate-400">B2B</span>
                </div>
                <div className="text-[10px] text-slate-700 font-mono truncate">buyer@global</div>
                <div className="text-[9px] text-slate-500 font-mono truncate">Buyer@2026!</div>
              </button>

              {/* Customer Button */}
              <button
                type="button"
                onClick={() => handleAutoFill('customer')}
                className="p-1.5 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-emerald-600 font-display flex items-center gap-1">
                    👤 Customer
                  </span>
                  <span className="text-[9px] text-slate-400">Store</span>
                </div>
                <div className="text-[10px] text-slate-700 font-mono truncate">ayesh_w</div>
                <div className="text-[9px] text-slate-500 font-mono truncate">User@2026!</div>
              </button>
            </div>
          </div>

          {/* Collapsible "Generate User & Admin Logins" Drawer */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/70">
            <button
              type="button"
              onClick={() => setShowGenerator(!showGenerator)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer font-display"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#ea580c]" />
                <span>{language === 'si' ? 'නව පරිශීලක / Admin පිවිසුමක් උත්පාදනය කරන්න' : 'Generate New User / Admin Login'}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                <span>{showGenerator ? 'Hide' : 'Configure'}</span>
                {showGenerator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showGenerator && (
              <form onSubmit={handleGenerateAccount} className="p-3.5 pt-1 border-t border-slate-200 bg-white space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Target Role
                    </label>
                    <select
                      value={genRole}
                      onChange={(e) => setGenRole(e.target.value as UserRole)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#ea580c]"
                    >
                      <option value="super_admin">👑 Super Administrator</option>
                      <option value="catalog_admin">🏷️ Catalog & Inventory Admin</option>
                      <option value="vendor">🏬 Verified Seller / Vendor</option>
                      <option value="buyer">💼 B2B Wholesale Buyer</option>
                      <option value="customer">👤 Standard Customer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Account Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={genCustomName}
                      onChange={(e) => setGenCustomName(e.target.value)}
                      placeholder="e.g. Kasun Fernando / North Hub"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">
                    Generates persistent login, email, and secure password automatically
                  </span>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-[#ea580c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 font-display shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Generate & Autofill</span>
                  </button>
                </div>

                {generatedAccount && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-slate-800 animate-in fade-in">
                    <div className="flex items-center justify-between text-emerald-800 font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Account Created & Loaded
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `Email: ${generatedAccount.email}\nPassword: ${generatedAccount.password}`,
                            'gen'
                          )
                        }
                        className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'gen' ? 'Copied!' : 'Copy Info'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-slate-700">
                      Email: <strong>{generatedAccount.email}</strong> | Password: <strong>{generatedAccount.password}</strong>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Feedback banners */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">{language === 'si' ? 'පිවිසීමේ දෝෂයකි: ' : 'Authentication Error: '}</span>
                <span>{errorMessage}</span>
                {errorMessage.toLowerCase().includes('admin') && (
                  <div className="mt-1 pt-1 border-t border-red-200 text-[11px] text-red-800 flex items-center gap-2">
                    <span>Default Admin Password: <strong className="font-mono">Admin@2026!</strong></span>
                    <button
                      type="button"
                      onClick={() => setPassword('Admin@2026!')}
                      className="underline font-bold hover:text-red-900 cursor-pointer"
                    >
                      Fill Correct Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {successNotice && !errorMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{successNotice}</span>
            </div>
          )}

          {/* Tabs for Sign In / Register */}
          <div className="flex border-b border-slate-200 font-display">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`pb-2.5 text-xs font-bold flex-1 text-center cursor-pointer transition-colors ${
                mode === 'login'
                  ? 'text-[#ea580c] border-b-2 border-[#ea580c]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'si' ? 'ගිණුමට ඇතුල් වන්න (Sign In)' : 'Sign In with Credentials'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`pb-2.5 text-xs font-bold flex-1 text-center cursor-pointer transition-colors ${
                mode === 'register'
                  ? 'text-[#ea580c] border-b-2 border-[#ea580c]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'si' ? 'අලුත් ගිණුමක් ලියාපදිංචි කරන්න' : 'Register New Account'}
            </button>
          </div>

          {/* Unified Login & Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name / Organization
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ayesh Wijewardana"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {language === 'si' ? 'ඊමේල් ලිපිනය හෝ පරිශීලක නාමය' : 'Email Address or Username'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@market.com or username"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#ea580c] font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'si' ? 'මුරපදය' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (email.toLowerCase().includes('admin')) {
                        setPassword('Admin@2026!');
                        setSuccessNotice('Autofilled default admin password.');
                      } else {
                        setPassword('User@2026!');
                        setSuccessNotice('Autofilled default user password.');
                      }
                    }}
                    className="text-[11px] text-orange-600 hover:underline cursor-pointer"
                  >
                    {language === 'si' ? 'මුරපදය පෙන්වන්න / යොදන්න' : 'Auto-fill password'}
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-9 pr-10 py-2 border rounded-lg text-xs focus:outline-none font-mono ${
                    errorMessage && errorMessage.toLowerCase().includes('password')
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-slate-300 focus:border-[#ea580c]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="flex items-center gap-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
                <input
                  type="checkbox"
                  id="vendorCheck"
                  checked={isVendor}
                  onChange={(e) => setIsVendor(e.target.checked)}
                  className="w-4 h-4 accent-[#ea580c] cursor-pointer"
                />
                <label
                  htmlFor="vendorCheck"
                  className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>
                    {language === 'si'
                      ? 'බහු-විකුණුම්කාර වෙළෙන්දෙකු (Seller) ලෙස ලියාපදිංචි වන්න'
                      : 'Register as Verified Multi-Vendor Seller'}
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-display shadow-md hover:scale-[1.01] active:scale-98"
            >
              {mode === 'login'
                ? (language === 'si' ? 'ගිණුමට ආරක්ෂිතව පිවිසෙන්න' : 'Sign In Securely')
                : (language === 'si' ? 'ගිණුම නිර්මාණය කරන්න' : 'Create Marketplace Account')}
            </button>
          </form>

          {/* Footer role routing notice */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Role-Based Routing: Admins go to Backend, Customers to Store</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
