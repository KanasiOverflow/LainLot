import { ModalProvider } from './context/ModalProvider';
import { AuthProvider } from './context/AuthProvider';
import { DataProvider } from './context/DataProvider';

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <DataProvider>
                <ModalProvider>
                    {children}
                </ModalProvider>
            </DataProvider>
        </AuthProvider>
    )
};