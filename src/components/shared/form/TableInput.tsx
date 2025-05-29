import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

type Ref = HTMLInputElement;

export type TableInputProps = {
	label: string;
	error?: string;
	placeholder?: string;
	isUpperCase?: boolean;
	disabled?: boolean;
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "size" | "ref">;

export const TableInput = forwardRef<Ref, TableInputProps>(
	({ id, label, error, className, placeholder, isUpperCase, disabled, ...props }, forwardedRef) => {
		const hasError = !!error;

		return (
			<div
				ref={forwardedRef}
				className={`tableInput ${className ? className : ""} ${hasError ? "tableInput--error" : ""}`}
			>
				<input
					id={id}
					{...props}
					disabled={disabled}
					placeholder={placeholder || ""}
					aria-invalid={hasError ? "true" : "false"}
					className={`tableInput__field ${isUpperCase ? "tableInput__field--upperCase" : ""}`}
				/>
				<label htmlFor={id} className="tableInput__label srOnly">
					{label}
				</label>
				{hasError && (
					<p role="alert" className="tableInput__error">
						{error}
					</p>
				)}
			</div>
		);
	},
);
