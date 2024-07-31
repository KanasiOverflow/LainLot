import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <ModalProvider>
            {children}
            </ModalProvider>
        </AuthProvider>
    )
}