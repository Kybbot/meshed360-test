import { FC } from "react";
import { Outlet } from "react-router";

export const AuthLayout: FC = () => {
	return (
		<main className="auth">
			<div className="auth__content">
				<Outlet />
			</div>
		</main>
	);
};
