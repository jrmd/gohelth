import { createContext } from 'preact';
import {useContext, useState, useEffect } from 'preact/hooks';

export const AuthContext = createContext<{ user: User | boolean, checkAuth: () => void, clearAuth: () => void, isLoading: boolean }>(false)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User|false>(false)

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const resp = await fetch('/api/v1/auth/me');

            if (!resp.ok) {
                setUser(false);
                return;
            }

            const json = await resp.json();
            setUser(json)

            setTimeout(() => {
                checkAuth()
            }, 10000)
        } catch (e) {
            setUser(false)
        } finally {
            setIsLoading(false);
        }
    }

    const clearAuth = async () => {
        setUser(false);
        await fetch('/api/v1/auth/sign-out', { method: 'POST' });
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            checkAuth,
            clearAuth,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export type User = {
    email: string
}

