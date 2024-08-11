import { ModalProvider } from './context/ModalProvider';
import { AuthProvider } from './context/AuthProvider';
import { DataProvider } from './context/DataProvider';
import { ForeignKeysProvider } from './context/ForeignKeysProvider';

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <DataProvider>
                <ForeignKeysProvider>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </ForeignKeysProvider>
            </DataProvider>
        </AuthProvider>
    )
};