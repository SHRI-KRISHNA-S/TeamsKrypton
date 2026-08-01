import { apiClient } from './api';
import { UserRole, UserProfile } from '../types';

// Helper to map backend database roles to frontend lowercase roles
export function mapBackendRole(backendRole: string): UserRole {
  switch (backendRole.toUpperCase()) {
    case 'STUDENT':
      return 'student';
    case 'CLUB_PRESIDENT':
      return 'president';
    case 'FACULTY_COORDINATOR':
    case 'FACULTY':
      return 'faculty';
    case 'COLLEGE_ADMIN':
      return 'admin';
    case 'SUPER_ADMIN':
      return 'superadmin';
    default:
      return 'student';
  }
}

export const authService = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data?.status === 'success' && res.data.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.data.accessToken);
      const rawUser = res.data.data.user;
      const user: UserProfile = {
        id: rawUser.id,
        email: rawUser.email,
        name: rawUser.name,
        department: rawUser.department || 'Campus',
        role: mapBackendRole(rawUser.role),
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
      return { user, accessToken: res.data.data.accessToken };
    }
    throw new Error(res.data?.message || 'Login failed');
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    if (res.data?.status === 'success' && res.data.data?.user) {
      const rawUser = res.data.data.user;
      const user: UserProfile = {
        id: rawUser.id,
        email: rawUser.email,
        name: rawUser.name,
        department: rawUser.department || 'Campus',
        role: mapBackendRole(rawUser.role),
        isVerified: rawUser.isVerified,
        createdAt: rawUser.createdAt,
      };
      return user;
    }
    throw new Error('Failed to retrieve user profile');
  },
};
