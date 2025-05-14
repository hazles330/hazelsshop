import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth'

interface AuthError extends Error {
  code?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          if (!credentials.email || !credentials.password) {
            throw Object.assign(new Error('이메일과 비밀번호를 입력해주세요.'), { code: 'INVALID_CREDENTIALS' })
          }

          // TODO: 실제 API 연동
          const isAdmin = credentials.email === 'admin@example.com' && credentials.password === 'admin'
          const mockUser: User = {
            id: '1',
            email: credentials.email,
            name: isAdmin ? '관리자' : '사용자',
            role: isAdmin ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }

          // 로그인 지연 시뮬레이션 (실제 API 호출 시에는 제거)
          await new Promise(resolve => setTimeout(resolve, 500))
          
          set({ user: mockUser, error: null })
          return mockUser
        } catch (error) {
          const authError = error as AuthError
          const errorMessage = authError.code === 'INVALID_CREDENTIALS' 
            ? authError.message 
            : '로그인에 실패했습니다.'
          set({ user: null, error: errorMessage })
          throw authError
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          if (!credentials.email || !credentials.password || !credentials.name) {
            throw Object.assign(new Error('모든 필드를 입력해주세요.'), { code: 'INVALID_INPUT' })
          }

          // 이메일 형식 검증
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(credentials.email)) {
            throw Object.assign(new Error('올바른 이메일 형식이 아닙니다.'), { code: 'INVALID_EMAIL' })
          }

          // 비밀번호 유효성 검사 (최소 8자, 문자/숫자 조합)
          if (credentials.password.length < 8) {
            throw Object.assign(new Error('비밀번호는 최소 8자 이상이어야 합니다.'), { code: 'INVALID_PASSWORD' })
          }

          // TODO: 실제 API 연동
          const mockUser: User = {
            id: Math.random().toString(36).substring(2),
            email: credentials.email,
            name: credentials.name,
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }

          // 회원가입 지연 시뮬레이션 (실제 API 호출 시에는 제거)
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          set({ user: mockUser, error: null })
          return mockUser
        } catch (error) {
          const authError = error as AuthError
          const errorMessage = authError.code ? authError.message : '회원가입에 실패했습니다.'
          set({ user: null, error: errorMessage })
          throw authError
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        localStorage.removeItem('auth-storage')
        set({ user: null, error: null })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state && state.user) {
          state.error = null
          state.isLoading = false
        }
      }
    }
  )
)