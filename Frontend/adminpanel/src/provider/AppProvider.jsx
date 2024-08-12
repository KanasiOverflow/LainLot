import { ModalProvider } from './context/ModalProvider';
import { AuthProvider } from './context/AuthProvider';
import { DataProvider } from './context/DataProvider';
import { ForeignKeysProvider } from './context/ForeignKeysProvider';
import { PaginationProvider } from './context/PaginationProvider';

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <DataProvider>
                <ForeignKeysProvider>
                    <PaginationProvider>
                        <ModalProvider>
                            {children}
                        </ModalProvider>
                    </PaginationProvider>
                </ForeignKeysProvider>
            </DataProvider>
        </AuthProvider>
    )
};