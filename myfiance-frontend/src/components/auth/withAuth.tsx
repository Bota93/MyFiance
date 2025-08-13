'use client';

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";

/**
 * Un Higher-Order Component (HOC) que protege una página o componente.
 * Comprueba si existe un token de autenticación en el localStorage.
 * Si no existe, redirige al usuario a la página de inicio de la sesión.
 * @param WrappedComponent El componente de la página que se va a proteger.
 * @returns Un nuevo componente que incluye la lógica de protección.
 */
const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const AuthComponent = (props: P) => {
        const router = useRouter();

        useEffect(() => {
            //Esta lógica solo se ejecuta en el lado del cliente después de que el componente se monta
            const token = localStorage.getItem('authToken');
            if (!token) {
                // Si no hay token redirige a la página de login
                router.push('/login');
            }
        } , [router]);

        // Si hay token renderiza la página solicitada
        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
}

export default withAuth;