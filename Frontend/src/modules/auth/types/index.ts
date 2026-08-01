export type UserRole = 'student' | 'president' | 'faculty' | 'admin' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  department: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
