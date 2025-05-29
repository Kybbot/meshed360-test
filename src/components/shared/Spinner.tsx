import { FC } from "react";

type SpinnerProps = {
	width?: string;
	height?: string;
	className?: string;
};

export const Spinner: FC<SpinnerProps> = ({ width = "18", height = "18", className }) => {
	return (
		<svg
			width={width}
			height={height}
			focusable="false"
			aria-hidden="true"
			className={`spinner ${className ? className : ""}`}
		>
			<use xlinkHref="/icons/icons.svg#spinner" />
		</svg>
	);
};
