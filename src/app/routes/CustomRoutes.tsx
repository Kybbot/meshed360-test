import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { useQueryClient } from "@tanstack/react-query";

import { SignedInRoutes } from "./SignedInRoutes";
import { SignedOutRoutes } from "./SignedOutRoutes";

import { authStore } from "@/app/stores/authStore";

export const CustomRoutes: FC = () => {
	const queryClient = useQueryClient();
	const isLoggedIn = useStore(authStore, (state) => state.isLoggedIn);

	useEffect(() => {
		if (!isLoggedIn) {
			queryClient.clear();
		}
	}, [isLoggedIn, queryClient]);

	return <>{isLoggedIn ? <SignedInRoutes /> : <SignedOutRoutes />}</>;
};
