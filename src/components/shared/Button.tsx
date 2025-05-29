import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from "react";

type Ref = HTMLButtonElement;

type ButtonProps = {
	children: string | ReactNode;
	isLoading?: boolean;
	isSecondary?: boolean;
	isUseSpinner?: boolean;
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button = forwardRef<Ref, ButtonProps>(
	({ children, isLoading, isSecondary, isUseSpinner, className, ...props }, forwardedRef) => {
		return (
			<button
				ref={forwardedRef}
				className={`btn
					${className ? className : ""}
					${isLoading ? "btn--loading" : ""}
					${isUseSpinner ? "btn--spinner" : ""}
					${isSecondary ? "btn--secondary" : ""}
				`}
				{...props}
			>
				<span className="btn__content">{children}</span>
				<span className="btn__loader">
					<div className="btn__dot" />
					<div className="btn__dot" />
					<div className="btn__dot" />
				</span>
			</button>
		);
	},
);
