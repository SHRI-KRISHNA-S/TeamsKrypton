import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import { authService } from '../services/auth.service';
import { UserProfile, UserRole } from '../types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [authLoading, setAuthLoading] = useState(true);

  // React Query to restore session profile on startup
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery<UserProfile | null>({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      try {
        return await authService.getMe();
      } catch (err) {
        localStorage.removeItem('accessToken');
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Automatically restore session check on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await refetchProfile();
      }
      setAuthLoading(false);
    };
    initializeAuth();
  }, [refetchProfile]);

  // Intercept automatic logout event dispatched by apiClient response interceptors
  useEffect(() => {
    const handleLogoutEvent = () => {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear();
      window.location.href = '/';
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, [queryClient]);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: any) => authService.login(email, password),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(['auth-user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear(); // Clear all cached user queries
      window.location.href = '/';
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const refreshSession = async () => {
    await refetchProfile();
  };

  const user = profileData || null;
  const role = user ? user.role : null;
  const isAuthenticated = !!user;
  const loading = authLoading || isProfileLoading;

  // Branded premium loading page
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-indigo-650/20 border border-indigo-500/30 flex items-center justify-center font-bold text-2xl text-white shadow-xl animate-bounce">
            CP
          </div>
          <h1 className="font-display font-bold text-2xl text-white tracking-wider">ClubPortal</h1>
          <p className="text-slate-400 text-xs animate-pulse">Restoring secure session, please wait...</p>
          
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-indigo-500 rounded-full animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
