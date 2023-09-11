import { createContext } from 'preact';
import {useContext, useState, useEffect } from 'preact/hooks';

export const AuthContext = createContext<{ user: User | boolean, checkAuth: () => void, clearAuth: () => void }>(false)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User|false>(false)
    console.log(user);
    const checkAuth = async () => {
        try {
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
        }
    }
    const clearAuth = async () => {
        setUser(false);
        console.log("clearing auth!!!");
        await fetch('/api/v1/auth/sign-out', { method: 'POST' })
        console.log("done!!!");
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
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

