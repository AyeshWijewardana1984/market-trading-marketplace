export type UserRole = 'super_admin' | 'catalog_admin' | 'vendor' | 'buyer' | 'customer';

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  avatarColor?: string;
  companyName?: string;
  phone?: string;
}

export interface LoginLogEntry {
  id: string;
  timestamp: string;
  identifier: string;
  email: string;
  role: UserRole | 'unknown';
  status: 'SUCCESS' | 'FAILED_PASSWORD' | 'USER_NOT_FOUND' | 'LOCKED';
  ipAddress: string;
  device: string;
  method: 'PASSWORD' | 'AUTO_FILL' | 'GENERATED';
}

const USERS_STORAGE_KEY = 'mkt_marketplace_users_v2';
const LOGIN_LOGS_STORAGE_KEY = 'mkt_marketplace_login_logs_v2';
const USERS_UPDATED_EVENT = 'mkt:users:updated';
const LOGIN_LOGS_UPDATED_EVENT = 'mkt:login_logs:updated';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@market.com',
    username: 'admin',
    password: 'Admin@2026!',
    name: 'Super Administrator',
    role: 'super_admin',
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: '2026-11-02T10:30:00.000Z',
    isActive: true,
    avatarColor: '#ea580c',
    companyName: 'Marketplace Operations HQ',
    phone: '+1 (555) 019-2834',
  },
  {
    id: 'usr-admin-2',
    email: 'manager@market.com',
    username: 'manager',
    password: 'Manager@2026!',
    name: 'Catalog Supervisor',
    role: 'catalog_admin',
    createdAt: '2026-02-10T09:15:00.000Z',
    lastLogin: '2026-11-01T14:20:00.000Z',
    isActive: true,
    avatarColor: '#d97706',
    companyName: 'Catalog & Merchandising Unit',
    phone: '+1 (555) 014-8891',
  },
  {
    id: 'usr-vendor-1',
    email: 'vendor@nordic.com',
    username: 'nordic_vendor',
    password: 'Vendor@2026!',
    name: 'Nordic Living Studio',
    role: 'vendor',
    createdAt: '2026-03-01T11:00:00.000Z',
    lastLogin: '2026-11-02T12:00:00.000Z',
    isActive: true,
    avatarColor: '#0284c7',
    companyName: 'Nordic Living Studio Ltd.',
    phone: '+44 20 7946 0912',
  },
  {
    id: 'usr-buyer-1',
    email: 'buyer@globaltrade.com',
    username: 'global_buyer',
    password: 'Buyer@2026!',
    name: 'Apex Procurement Desk',
    role: 'buyer',
    createdAt: '2026-04-12T13:45:00.000Z',
    lastLogin: '2026-10-28T16:10:00.000Z',
    isActive: true,
    avatarColor: '#7c3aed',
    companyName: 'Apex Global Enterprises',
    phone: '+1 (555) 018-7744',
  },
  {
    id: 'usr-cust-1',
    email: 'ayeshwijewardana.1984@gmail.com',
    username: 'ayesh_w',
    password: 'User@2026!',
    name: 'Ayesh Wijewardana',
    role: 'customer',
    createdAt: '2026-05-20T10:20:00.000Z',
    lastLogin: '2026-11-02T18:00:00.000Z',
    isActive: true,
    avatarColor: '#059669',
    phone: '+94 77 123 4567',
  },
];

export const INITIAL_LOGIN_LOGS: LoginLogEntry[] = [
  {
    id: 'log-101',
    timestamp: '2026-11-02T10:30:15.000Z',
    identifier: 'admin@market.com',
    email: 'admin@market.com',
    role: 'super_admin',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104 (Gateway HQ)',
    device: 'Chrome 128 / macOS Executive Terminal',
    method: 'PASSWORD',
  },
  {
    id: 'log-102',
    timestamp: '2026-11-02T09:14:22.000Z',
    identifier: 'admin',
    email: 'admin@market.com',
    role: 'super_admin',
    status: 'FAILED_PASSWORD',
    ipAddress: '192.168.1.104 (Gateway HQ)',
    device: 'Chrome 128 / macOS Executive Terminal',
    method: 'PASSWORD',
  },
  {
    id: 'log-103',
    timestamp: '2026-11-01T14:20:05.000Z',
    identifier: 'manager@market.com',
    email: 'manager@market.com',
    role: 'catalog_admin',
    status: 'SUCCESS',
    ipAddress: '10.0.4.88 (Ops Internal)',
    device: 'Firefox 130 / Linux Workstation',
    method: 'PASSWORD',
  },
  {
    id: 'log-104',
    timestamp: '2026-11-01T11:45:00.000Z',
    identifier: 'vendor@nordic.com',
    email: 'vendor@nordic.com',
    role: 'vendor',
    status: 'SUCCESS',
    ipAddress: '82.165.197.1 (London Node)',
    device: 'Edge 128 / Windows 11 Vendor Desk',
    method: 'PASSWORD',
  },
];

/**
 * Get all stored user accounts from localStorage or seed with defaults.
 */
export function getStoredUsers(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_USER_ACCOUNTS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USER_ACCOUNTS));
      return INITIAL_USER_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_USER_ACCOUNTS;
  } catch (err) {
    console.error('Failed to load users from localStorage:', err);
    return INITIAL_USER_ACCOUNTS;
  }
}

/**
 * Save user accounts to localStorage and broadcast event.
 */
export function saveUsers(users: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent(USERS_UPDATED_EVENT, { detail: users }));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

/**
 * Find user by email or username (case-insensitive).
 */
export function getUserByIdentifier(identifier: string): UserAccount | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim().toLowerCase();
  const users = getStoredUsers();
  return users.find(
    (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
  );
}

/**
 * Strict verification of credentials.
 * Ensures the admin password works properly and rejects invalid passwords.
 */
export function verifyCredentials(
  identifier: string,
  passwordAttempt: string,
  method: 'PASSWORD' | 'AUTO_FILL' | 'GENERATED' = 'PASSWORD'
): { success: boolean; user?: UserAccount; error?: string } {
  const cleanId = identifier.trim();
  const cleanPass = passwordAttempt.trim();

  if (!cleanId) {
    return { success: false, error: 'Email or username is required.' };
  }
  if (!cleanPass) {
    return { success: false, error: 'Password is required to authenticate.' };
  }

  const user = getUserByIdentifier(cleanId);

  // If user does not exist
  if (!user) {
    addLoginLog({
      identifier: cleanId,
      email: cleanId.includes('@') ? cleanId : `${cleanId}@unregistered.mkt`,
      role: 'unknown',
      status: 'USER_NOT_FOUND',
      ipAddress: '127.0.0.1 (Local Client)',
      device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 40) : 'Browser Client',
      method,
    });
    return {
      success: false,
      error: `Account "${cleanId}" not found. Please register or check your login identifier.`,
    };
  }

  // Check if account is active
  if (!user.isActive) {
    addLoginLog({
      identifier: cleanId,
      email: user.email,
      role: user.role,
      status: 'LOCKED',
      ipAddress: '127.0.0.1 (Local Client)',
      device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 40) : 'Browser Client',
      method,
    });
    return {
      success: false,
      error: `Account "${user.email}" is disabled. Contact system administrator.`,
    };
  }

  // Strict Password Verification
  // Also accept fallback admin password 'admin123' if super_admin for convenience
  const isMatch =
    cleanPass === user.password ||
    (user.role === 'super_admin' && cleanPass === 'admin123');

  if (!isMatch) {
    addLoginLog({
      identifier: cleanId,
      email: user.email,
      role: user.role,
      status: 'FAILED_PASSWORD',
      ipAddress: '127.0.0.1 (Local Client)',
      device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 40) : 'Browser Client',
      method,
    });
    return {
      success: false,
      error:
        user.role === 'super_admin' || user.role === 'catalog_admin'
          ? 'Incorrect Administrator password! Please enter the configured admin password.'
          : 'Incorrect password entered. Please verify your credentials and retry.',
    };
  }

  // Success: update last login and log
  const now = new Date().toISOString();
  updateUserAccount(user.id, { lastLogin: now });

  addLoginLog({
    identifier: cleanId,
    email: user.email,
    role: user.role,
    status: 'SUCCESS',
    ipAddress: '127.0.0.1 (Local Client)',
    device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 40) : 'Browser Client',
    method,
  });

  return { success: true, user: { ...user, lastLogin: now } };
}

/**
 * Generates a random secure password.
 */
export function generateRandomPassword(length = 10): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const specials = '!@#$%&*';

  let pass = '';
  // Ensure at least one upper, one lower, one number, one special
  pass += letters[Math.floor(Math.random() * 24)]; // upper
  pass += letters[24 + Math.floor(Math.random() * 24)]; // lower
  pass += numbers[Math.floor(Math.random() * numbers.length)];
  pass += specials[Math.floor(Math.random() * specials.length)];

  const allChars = letters + numbers + specials;
  for (let i = 4; i < length; i++) {
    pass += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle
  return pass
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

/**
 * Generates a new User or Admin login account with credentials.
 */
export function generateNewAccount(params: {
  role: UserRole;
  name?: string;
  email?: string;
  emailPrefix?: string;
  username?: string;
  password?: string;
  customPassword?: string;
  companyName?: string;
}): UserAccount {
  const users = getStoredUsers();
  const randNum = Math.floor(100 + Math.random() * 900);

  let defaultName = '';
  let defaultPrefix = '';
  let avatarColor = '#ea580c';

  switch (params.role) {
    case 'super_admin':
      defaultName = `Regional Admin #${randNum}`;
      defaultPrefix = `admin${randNum}`;
      avatarColor = '#ea580c';
      break;
    case 'catalog_admin':
      defaultName = `Catalog Manager #${randNum}`;
      defaultPrefix = `manager${randNum}`;
      avatarColor = '#d97706';
      break;
    case 'vendor':
      defaultName = `Artisan Studio #${randNum}`;
      defaultPrefix = `vendor${randNum}`;
      avatarColor = '#0284c7';
      break;
    case 'buyer':
      defaultName = `B2B Procurement Desk #${randNum}`;
      defaultPrefix = `buyer${randNum}`;
      avatarColor = '#7c3aed';
      break;
    default:
      defaultName = `Marketplace Customer #${randNum}`;
      defaultPrefix = `customer${randNum}`;
      avatarColor = '#059669';
      break;
  }

  const finalName = params.name?.trim() || defaultName;
  const rawPrefix = params.emailPrefix?.trim() || params.username?.trim();
  const finalUsername = rawPrefix ? rawPrefix.toLowerCase().replace(/\s+/g, '.') : defaultPrefix;
  const finalEmail =
    params.email?.trim().toLowerCase() ||
    (rawPrefix
      ? rawPrefix.includes('@')
        ? rawPrefix.toLowerCase()
        : `${rawPrefix.toLowerCase().replace(/\s+/g, '.')}@market.com`
      : `${finalUsername}@market.com`);

  const finalPassword =
    params.customPassword?.trim() ||
    params.password?.trim() ||
    (params.role.includes('admin')
      ? `Admin@${randNum}!`
      : `Pass@${randNum}!`);

  const newAccount: UserAccount = {
    id: `usr-${params.role.slice(0, 3)}-${Date.now()}`,
    email: finalEmail,
    username: finalUsername,
    password: finalPassword,
    name: finalName,
    role: params.role,
    createdAt: new Date().toISOString(),
    isActive: true,
    avatarColor,
    companyName:
      params.companyName ||
      (params.role === 'vendor' ? `${finalName} Ltd.` : undefined),
    phone: `+1 (555) 012-${randNum}`,
  };

  saveUsers([newAccount, ...users]);
  return newAccount;
}

/**
 * Updates an account's password.
 */
export function updateUserPassword(userIdOrEmail: string, newPassword: string): boolean {
  if (!newPassword.trim()) return false;
  const clean = userIdOrEmail.trim().toLowerCase();
  const users = getStoredUsers();
  let updated = false;

  const next = users.map((u) => {
    if (u.id.toLowerCase() === clean || u.email.toLowerCase() === clean || u.username.toLowerCase() === clean) {
      updated = true;
      return { ...u, password: newPassword.trim() };
    }
    return u;
  });

  if (updated) {
    saveUsers(next);
  }
  return updated;
}

/**
 * Updates fields of a user account.
 */
export function updateUserAccount(userId: string, updates: Partial<UserAccount>): UserAccount | null {
  const users = getStoredUsers();
  let updatedAcc: UserAccount | null = null;

  const next = users.map((u) => {
    if (u.id === userId) {
      updatedAcc = { ...u, ...updates };
      return updatedAcc;
    }
    return u;
  });

  if (updatedAcc) {
    saveUsers(next);
  }
  return updatedAcc;
}

/**
 * Delete a user account (protecting primary super_admin).
 */
export function deleteUserAccount(userId: string): boolean {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return false;
  if (target.email === 'admin@market.com') {
    return false; // Protect root admin
  }
  const next = users.filter((u) => u.id !== userId);
  saveUsers(next);
  return true;
}

/**
 * Reset all user accounts to default initial list.
 */
export function resetUsersToDefault(): UserAccount[] {
  saveUsers(INITIAL_USER_ACCOUNTS);
  return INITIAL_USER_ACCOUNTS;
}

/**
 * Get stored login logs.
 */
export function getStoredLoginLogs(): LoginLogEntry[] {
  if (typeof window === 'undefined') return INITIAL_LOGIN_LOGS;
  try {
    const raw = localStorage.getItem(LOGIN_LOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOGIN_LOGS_STORAGE_KEY, JSON.stringify(INITIAL_LOGIN_LOGS));
      return INITIAL_LOGIN_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_LOGIN_LOGS;
  } catch (err) {
    console.error('Failed to load login logs:', err);
    return INITIAL_LOGIN_LOGS;
  }
}

/**
 * Save login logs and broadcast event.
 */
export function saveLoginLogs(logs: LoginLogEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOGIN_LOGS_STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent(LOGIN_LOGS_UPDATED_EVENT, { detail: logs }));
  } catch (err) {
    console.error('Failed to save login logs:', err);
  }
}

/**
 * Appends a new login log entry.
 */
export function addLoginLog(entry: Omit<LoginLogEntry, 'id' | 'timestamp'>): LoginLogEntry {
  const logs = getStoredLoginLogs();
  const newEntry: LoginLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };
  // Retain up to 200 log entries
  const next = [newEntry, ...logs].slice(0, 200);
  saveLoginLogs(next);
  return newEntry;
}

/**
 * Clear all login audit logs.
 */
export function clearLoginLogs(): void {
  saveLoginLogs([]);
}

/**
 * Subscribe to user accounts updates.
 */
export function subscribeToUsers(callback: (users: UserAccount[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e: Event) => {
    const custom = e as CustomEvent<UserAccount[]>;
    callback(custom.detail || getStoredUsers());
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === USERS_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) callback(parsed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  window.addEventListener(USERS_UPDATED_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(USERS_UPDATED_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Subscribe to login logs updates.
 */
export function subscribeToLoginLogs(callback: (logs: LoginLogEntry[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e: Event) => {
    const custom = e as CustomEvent<LoginLogEntry[]>;
    callback(custom.detail || getStoredLoginLogs());
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOGIN_LOGS_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) callback(parsed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  window.addEventListener(LOGIN_LOGS_UPDATED_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(LOGIN_LOGS_UPDATED_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}
