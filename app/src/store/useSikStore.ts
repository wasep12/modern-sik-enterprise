import { create } from 'zustand';
import type { SikRequest, User, UserRole, ActivityLog } from '../types/sik';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

interface SikState {
  // Auth & User State
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  requests: SikRequest[];
  
  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  logActivity: (action: string) => void;

  // Management Actions
  setRole: (userId: string, role: UserRole) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  
  // Request Actions
  submitRequest: (data: Partial<SikRequest>) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  checkIn: (requestId: string) => void;
  checkOut: (requestId: string) => void;
  markNotificationsRead: () => void;
}

// Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Wasep Gunawan', role: 'ADMIN', email: 'wasep@sik.com', avatar: 'W' },
  { id: 'u2', name: 'Jane Smith', role: 'DEPUTY', email: 'jane@sik.com', avatar: 'J' },
  { id: 'u3', name: 'Bob Security', role: 'SECURITY', email: 'bob@sik.com', avatar: 'B' },
  { id: 'u4', name: 'Alice Staff', role: 'USER', email: 'alice@sik.com', avatar: 'A' },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Sistem Aktif',
    description: 'Modern SIK Enterprise v1.0.5 siap digunakan.',
    time: new Date().toISOString(),
    isRead: false,
    type: 'info'
  }
];

const createLog = (status: string, message: string, actor: string) => ({
  status,
  message,
  timestamp: new Date().toISOString(),
  actor
});

const INITIAL_REQUESTS: SikRequest[] = [
  {
    id: '1',
    userId: 'u4',
    userName: 'Alice Staff',
    jobDescription: 'Maintenance AC Ruang Server Utama',
    location: 'Gedung A, Lantai 2',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 14400000).toISOString(),
    status: 'PENDING_L1',
    currentStep: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    logs: [
      createLog('DRAFT', 'Formulir dibuat oleh pemohon', 'Alice Staff'),
      createLog('PENDING_L1', 'Menunggu persetujuan GSD Deputy', 'System')
    ]
  }
];

// Helper to get device info
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";
  
  return {
     device: /Mobile|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop",
     browser,
     os: navigator.platform,
     ip: "192.168.1.104" // Mocked
  };
};

export const useSikStore = create<SikState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem('isAuth'),
  currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
  users: MOCK_USERS,
  activityLogs: [],
  notifications: INITIAL_NOTIFICATIONS,
  requests: INITIAL_REQUESTS,

  login: async (email, password) => {
    // Simulate API delay
    await new Promise(res => setTimeout(res, 1200));
    
    const user = MOCK_USERS.find(u => u.email === email);
    if (user && password === 'admin123') { // Simple mock bypass
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      set({ isAuthenticated: true, currentUser: user });
      get().logActivity(`User Login: ${user.name}`);
      return true;
    }
    return false;
  },

  logout: () => {
    const user = get().currentUser;
    if (user) get().logActivity(`User Logout: ${user.name}`);
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, currentUser: null });
  },

  logActivity: (action) => {
    const user = get().currentUser;
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest',
      action,
      metadata: getDeviceInfo(),
      timestamp: new Date().toISOString(),
    };
    set(state => ({ activityLogs: [newLog, ...state.activityLogs] }));
  },

  setRole: (userId, role) => set((state) => {
     const updatedUsers = state.users.map(u => u.id === userId ? { ...u, role } : u);
     const currentUser = state.currentUser?.id === userId ? { ...state.currentUser, role } : state.currentUser;
     if (currentUser) localStorage.setItem('user', JSON.stringify(currentUser));
     return { users: updatedUsers, currentUser };
  }),

  updateUser: (userId, data) => set(state => ({
    users: state.users.map(u => u.id === userId ? { ...u, ...data } : u)
  })),

  deleteUser: (userId) => set(state => ({
    users: state.users.filter(u => u.id !== userId)
  })),

  submitRequest: (data) => set((state) => {
    const newRequest = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: state.currentUser?.id || 'anon',
      userName: state.currentUser?.name || 'Anonymous',
      status: 'PENDING_L1',
      currentStep: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logs: [
        createLog('DRAFT', 'Formulir dibuat oleh pemohon', state.currentUser?.name || 'Anonymous'),
        createLog('PENDING_L1', 'Menunggu persetujuan GSD Deputy', 'System')
      ],
      ...data,
    } as SikRequest;

    get().logActivity(`Submit SIK Request: ${newRequest.id}`);
    return { requests: [newRequest, ...state.requests] };
  }),

  approveRequest: (id) => set((state) => {
    const actorRole = state.currentUser?.role || 'Approver';
    const newRequests = state.requests.map((req) => {
      if (req.id !== id) return req;
      let newStatus = req.status;
      let newStep = req.currentStep;
      let actionMsg = '';

      if (req.status === 'PENDING_L1') { newStatus = 'PENDING_L2'; newStep = 2; actionMsg = 'Disetujui L1'; }
      else if (req.status === 'PENDING_L2') { newStatus = 'PENDING_L3'; newStep = 3; actionMsg = 'Disetujui L2'; }
      else if (req.status === 'PENDING_L3') { newStatus = 'APPROVED'; actionMsg = 'Persetujuan Final'; }

      return { ...req, status: newStatus, currentStep: newStep, updatedAt: new Date().toISOString(), 
               logs: [...(req.logs || []), createLog(newStatus, actionMsg, actorRole)] };
    });

    get().logActivity(`Approve SIK: ${id} by ${actorRole}`);
    return { requests: newRequests };
  }),

  rejectRequest: (id, reason) => set((state) => {
    const actorRole = state.currentUser?.role || 'Approver';
    get().logActivity(`Reject SIK: ${id} - ${reason}`);
    return {
      requests: state.requests.map((req) => 
        req.id === id ? { ...req, status: 'REJECTED', rejectionReason: reason, updatedAt: new Date().toISOString(),
                        logs: [...(req.logs || []), createLog('REJECTED', `Ditolak: ${reason}`, actorRole)] } : req
      )
    };
  }),

  checkIn: (id) => {
    get().logActivity(`Security Check-In: ${id}`);
    set((state) => ({
    requests: state.requests.map((req) => 
      req.id === id ? { ...req, status: 'CHECKED_IN', checkInTime: new Date().toISOString(), updatedAt: new Date().toISOString(),
                        logs: [...(req.logs || []), createLog('CHECKED_IN', 'Masuk Area', 'Security')] } : req
    )
  }))},

  checkOut: (id) => {
    get().logActivity(`Security Check-Out: ${id}`);
    set((state) => ({
    requests: state.requests.map((req) => 
      req.id === id ? { ...req, status: 'CHECKED_OUT', checkOutTime: new Date().toISOString(), updatedAt: new Date().toISOString(),
                        logs: [...(req.logs || []), createLog('CHECKED_OUT', 'Keluar Area', 'Security')] } : req
    )
  }))},

  markNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  }))
}));
