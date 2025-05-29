import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, useState } from "react";

type Ref = HTMLInputElement;

export type InputProps = {
	label: string;
	error?: string;
	isSmall?: boolean;
	isUpperCase?: boolean;
	hideErrorMessage?: boolean;
	isShowPasswordBtn?: boolean;
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "size" | "ref">;

export const Input = forwardRef<Ref, InputProps>(
	(
		{
			id,
			label,
			error,
			isSmall,
			className,
			isUpperCase,
			hideErrorMessage = false,
			isShowPasswordBtn = false,
			...props
		},
		forwardedRef,
	) => {
		const hasError = !!error;

		const [isShowPassword, setShowPassword] = useState(false);

		const togglePasswordVisibility = () => {
			setShowPassword((prev) => !prev);
		};

		return (
			<div
				ref={forwardedRef}
				className={`customInput ${className ? className : ""} ${hasError ? "customInput--error" : ""}`}
			>
				{isShowPasswordBtn && (
					<>
						<p aria-live="polite" className="srOnly">
							{isShowPassword ? "Password shown" : "Password hidden"}
						</p>

						<button
							type="button"
							role="switch"
							id="show-password"
							className="customInput__btn"
							aria-checked={isShowPassword}
							onClick={togglePasswordVisibility}
						>
							<svg width="24" height="24" focusable="false" aria-hidden="true">
								{isShowPassword ? (
									<use xlinkHref="/icons/icons.svg#eyeOpen" />
								) : (
									<use xlinkHref="/icons/icons.svg#eyeClose" />
								)}
							</svg>
						</button>
					</>
				)}

				<input
					id={id}
					{...props}
					placeholder=""
					aria-invalid={hasError ? "true" : "false"}
					type={isShowPasswordBtn ? (isShowPassword ? "text" : "password") : props.type}
					className={`customInput__field ${isUpperCase ? "customInput__field--upperCase" : ""} ${isSmall ? "customInput__field--small" : ""}`}
				/>
				<label htmlFor={id} className="customInput__label">
					{label}
				</label>
				{hasError && !hideErrorMessage && (
					<p role="alert" className="customInput__error">
						{error}
					</p>
				)}
			</div>
		);
	},
);
