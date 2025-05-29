import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

type Ref = HTMLInputElement;

export type SwitchProps = {
	label: string;
	error?: string;
	hideLabel?: boolean;
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "size" | "ref">;

export const Switch = forwardRef<Ref, SwitchProps>(
	({ id, label, error, hideLabel = false, className, ...props }, forwardedRef) => {
		const hasError = !!error;

		return (
			<label htmlFor={id} className={`switch ${className ? className : ""}`}>
				<input
					id={id}
					{...props}
					role="switch"
					type="checkbox"
					ref={forwardedRef}
					className="switch__input"
					aria-invalid={hasError ? "true" : "false"}
				/>
				<span className={hideLabel ? "srOnly" : ""}>{label}</span>
				{hasError && (
					<p role="alert" className="switch__error">
						{error}
					</p>
				)}
			</label>
		);
	},
);
