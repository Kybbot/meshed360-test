import { FC } from "react";
import { Route, Routes } from "react-router";

import Login from "@/pages/Login";
import { AuthLayout } from "../lauouts/AuthLayout";

export const SignedOutRoutes: FC = () => {
	return (
		<Routes>
			<Route path="/" element={<AuthLayout />}>
				<Route index element={<Login />} />
				<Route path="*" element={<Login />} />
			</Route>
		</Routes>
	);
};
