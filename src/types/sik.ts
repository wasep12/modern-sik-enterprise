export type RequestStatus = 
  | 'DRAFT'
  | 'PENDING_L1' 
  | 'PENDING_L2' 
  | 'PENDING_L3' 
  | 'APPROVED' 
  | 'REJECTED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT';

export type UserRole = 'USER' | 'DEPUTY' | 'OP_HEAD' | 'GM_DIRECTOR' | 'SECURITY' | 'ADMIN';

export interface SikRequest {
  id: string;
  userId: string;
  userName: string;
  jobDescription: string;
  location: string;
  startTime: string;
  endTime: string;
  documentUrl?: string;
  status: RequestStatus;
  currentStep: number; // 1, 2, 3
  createdAt: string;
  updatedAt: string;
  approvedByL1?: string;
  approvedByL2?: string;
  approvedByL3?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  checkInTime?: string;
  checkOutTime?: string;
  logs?: {
    status: string;
    message: string;
    timestamp: string;
    actor: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  metadata: {
    device: string;
    browser: string;
    os: string;
    ip?: string;
  };
  timestamp: string;
}
