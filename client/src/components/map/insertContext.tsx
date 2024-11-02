import React, { createContext, useContext, useState, ReactNode } from "react";

export const SelectedInsertContext = createContext<{
    selectedInsert: number;
    setSelectedInsert: React.Dispatch<React.SetStateAction<number>>;
} | undefined>(undefined);

export const SelectedInsertProvider = ({ children }: { children: ReactNode }) => {
    const [selectedInsert, setSelectedInsert] = useState(0);

    return (
        <SelectedInsertContext.Provider value={{ selectedInsert, setSelectedInsert }}>
            {children}
        </SelectedInsertContext.Provider>
    );
};

export const useSelectedInsert = () => {
    const context = useContext(SelectedInsertContext);
    if (!context) {
        throw new Error("useSelectedInsert must be used within a SelectedInsertProvider");
    }
    return context;
};
