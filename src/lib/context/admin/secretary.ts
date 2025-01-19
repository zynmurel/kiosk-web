import { createContext, type Dispatch, type SetStateAction, useContext } from "react";
export type SecretaryUpsert = {
    id: number;
    fullName: string;
    contact: string | undefined; 
    email: string | undefined;
    employeeID: string;
}
export type UpsertSecretaryType = SecretaryUpsert | undefined | "create";
interface SecretaryContextType {
    upsertSecretary : UpsertSecretaryType;
    setUpsertSecretary : Dispatch<SetStateAction<UpsertSecretaryType>>
    searchText: string;
    setSearchText : Dispatch<SetStateAction<string>>,
    refetchSecretarys: () => Promise<void>

}

export const SecretaryContext = createContext<SecretaryContextType | undefined>(undefined);

export const useSecretaryContext = () => useContext(SecretaryContext);