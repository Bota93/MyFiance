'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Higher-Order Component (HOC) que protege un componente de la página.
 * Utiliza un estado de carga para evitar parpadeos y condiciones de carrera.
 */
const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const AuthComponent = (props: P) => {
        const router = useRouter();
        // Usamos un estado para saber si estamos verificando, autenticados, o no.
        const [authStatus, setAuthStatus] = useState<'verifying' | 'authenticated' | 'unauthenticated'>('verifying');

        useEffect(() => {
            const token = localStorage.getItem('authToken');
            if (token) {
                // Si hay token, el usuario está autenticado.
                setAuthStatus('authenticated');
            } else {
                // Si no hay token, redirigimos.
                setAuthStatus('unauthenticated');
                router.push('/');
            }
        }, [router]);

        // Si estamos verificando, no mostramos nada para evitar el parpadeo del contenido.
        if (authStatus !== 'authenticated') {
            return null; // O un componente de carga/esqueleto
        }

        // Solo si el estado es 'authenticated', mostramos la página protegida.
        return <WrappedComponent {...props} />;
    };

    AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return AuthComponent;
};

export default withAuth;