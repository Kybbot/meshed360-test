import { createStore } from "zustand/vanilla";

type LoggedInStoreType = {
	isLoggedIn: boolean;
	setLoggedIn: (value: boolean) => void;
};

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

export const authStore = createStore<LoggedInStoreType>((set) => ({
	isLoggedIn: !!accessToken && !!refreshToken,
	setLoggedIn: (value) => set(() => ({ isLoggedIn: value })),
}));
