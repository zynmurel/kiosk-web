import { type StateCreator } from "zustand";

export interface UserDataSlice {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;

  refetchProducts: () => void;
  setRefetchProducts: (refetch: () => void) => void;
}

export const createUserDataSlice: StateCreator<UserDataSlice> = (set, get) => ({
  walletBalance: 0,
  setWalletBalance: (balance) => {
    set({ walletBalance: balance });
  },

  refetchProducts: () => {},
  setRefetchProducts: (refetch) => set({ refetchProducts: refetch }),
});
