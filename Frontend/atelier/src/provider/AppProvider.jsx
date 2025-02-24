import { AuthProvider } from './context/AuthProvider';

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
};