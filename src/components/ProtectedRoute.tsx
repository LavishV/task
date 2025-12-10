import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    // Safe storage access with fallback
    let accessToken: string | null = null;
    try {
        accessToken = localStorage.getItem('accessToken');
    } catch (e) {
        // Storage not available, token check fails safely
        console.warn('localStorage not available in ProtectedRoute');
    }

    if (!accessToken) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};
