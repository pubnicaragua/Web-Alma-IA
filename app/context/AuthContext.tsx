// src/context/AuthContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Definimos los tipos
type User = {
    id: string;
    name: string;
    email: string;
    token: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

// Creamos el contexto con valores por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar autenticación al iniciar
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Función de login
    const login = async (email: string, password: string) => {
        try {
            // Aquí iría la llamada real a tu API
            // Este es un ejemplo con datos mock
            const mockUser: User = {
                id: '1',
                name: 'Usuario Ejemplo',
                email: email,
                token: 'mock-token-123456'
            };

            localStorage.setItem('user', JSON.stringify(mockUser));
            setUser(mockUser);
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};