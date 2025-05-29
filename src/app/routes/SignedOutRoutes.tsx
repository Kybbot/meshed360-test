import { FC } from "react";
import * as Sentry from "@sentry/react";
import { Route, Routes } from "react-router";

import Login from "@/pages/Login";
import { AuthLayout } from "../lauouts/AuthLayout";

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

export const SignedOutRoutes: FC = () => {
	return (
		<SentryRoutes>
			<Route path="/" element={<AuthLayout />}>
				<Route index element={<Login />} />
				<Route path="*" element={<Login />} />
			</Route>
		</SentryRoutes>
	);
};
