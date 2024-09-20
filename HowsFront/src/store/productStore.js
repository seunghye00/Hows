import {create} from "zustand";

export const useProductStore = create(set => ({
  subHeader : false,
  setSubHeader: param => set({ subHeader : param})
}))
