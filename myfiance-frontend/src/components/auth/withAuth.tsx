'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Higher-Order Component (HOC) que protege un componente de la página.
 * Verifica la existencia de un 'authToken' en el localStorage del cliente.
 * Si no se encuentra un token, redirige al usuario a la página '/login'.
 * Muestra un estado nulo (página en blanco) durante la verificación para evitar
 * un parpadeo de contenido protegido.
 * @param {ComponentType<P>} WrappedComponent El componente de página que se desea proteger.
 * @returns {ComponentType<P>} Un nuevo componente que envuelve al original con la lógica de autenticación.
 */
const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const AuthComponent = (props: P) => {
        const router = useRouter();
        // Estado para controlar si el usuario ha sido verificado como autenticado.
        // Inicia en 'false' por defecto para ser seguro.
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                // Si no hay token, se inicia la redirección a login.
                router.push('/login');
            } else {
                // Si se encuentra un token, se marca al usuario como autenticado.
                setIsAuthenticated(true);
            }
        }, [router]);

        // Si el usuario aún no ha sido verificado, no se muestra nada.
        // Esto previene que un usuario no autenticado vea la página protegida por un instante.
        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;