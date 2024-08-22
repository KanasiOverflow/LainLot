import { ModalProvider } from './context/ModalProvider';
import { AuthProvider } from './context/AuthProvider';
import { DataProvider } from './context/DataProvider';
import { ForeignKeysProvider } from './context/ForeignKeysProvider';
import { PaginationProvider } from './context/PaginationProvider';

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <DataProvider>
                <PaginationProvider>
                    <ForeignKeysProvider>
                        <ModalProvider>
                            {children}
                        </ModalProvider>
                    </ForeignKeysProvider>
                </PaginationProvider>
            </DataProvider>
        </AuthProvider>
    )
};