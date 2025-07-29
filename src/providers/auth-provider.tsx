import { genCode } from "@/lib/login";
import { getToken } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const AUTH_PATH = "/auth";
const ACCESS_TOKEN_KEY = "access_token";
const CODE_VERIFIER_KEY = "code_verifier";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates }));
  };

  const checkAuthStatus = (): boolean => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    return Boolean(accessToken);
  };

  const handleAuthCallback = async (
    code: string,
    codeVerifier: string,
  ): Promise<void> => {
    try {
      updateAuthState({ isLoading: true, error: null });

      const response = await getToken({ code, codeVerifier });

      if (!response.access_token) {
        throw new Error("No access token received");
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
      localStorage.removeItem(CODE_VERIFIER_KEY);

      updateAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      updateAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  const logout = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(CODE_VERIFIER_KEY);
    updateAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const initiateAuth = (): void => {
    try {
      genCode();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate authentication";
      updateAuthState({ error: errorMessage, isLoading: false });
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (pathname === AUTH_PATH) {
        const searchParams = new URLSearchParams(search);
        const code = searchParams.get("code");
        const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);

        if (code && codeVerifier) {
          await handleAuthCallback(code, codeVerifier);
          navigate("/");
        }
      }

      const isAuthenticated = checkAuthStatus();
      if (isAuthenticated) {
        updateAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        updateAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        initiateAuth();
      }
    };
    initializeAuth();
  }, [pathname, search]);

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
