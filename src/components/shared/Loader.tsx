import { FC } from "react";

type LoaderProps = {
	isSmall?: boolean;
	isFullWidth?: boolean;
	isFullWindow?: boolean;
};

export const Loader: FC<LoaderProps> = ({ isSmall, isFullWindow, isFullWidth }) => {
	return (
		<div
			className={`loader
			${isSmall ? "loader--small" : ""}
			${isFullWidth ? "loader--fullWidth" : ""}
			${isFullWindow ? "loader--fullWindow" : ""}
		`}
		>
			<div className="loader__dot" />
			<div className="loader__dot" />
			<div className="loader__dot" />
		</div>
	);
};
