import { create } from "zustand";

const useAuthStore = create((set) => ({
  username: "",
  email: "",
  password: "",
  error: null,
  isAddModalOpen: false,
  isAddPlanModalOpen: false,
  method: "",

  // Action untuk update state
  setUsername: (name) => set({ username: name }),
  setEmail: (mail) => set({ email: mail }),
  setPassword: (pass) => set({ password: pass }),
  setError: (err) => set({ error: err }),
  toggleAddModal: () =>
    set((state) => ({
      isAddModalOpen: !state.isAddModalOpen,
    })),
  toggleAddPlanModal: (method = "") =>
    set((state) => ({
      isAddPlanModalOpen: !state.isAddPlanModalOpen,
      method,
    })),

  // Action untuk reset data (misal setelah submit berhasil)
  clearAuthData: () =>
    set({
      username: "",
      email: "",
      password: "",
      error: "",
      isAddModalOpen: false,
    }),
}));

export default useAuthStore;
