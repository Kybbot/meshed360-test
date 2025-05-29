import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

type Ref = HTMLInputElement;

export type CheckboxProps = {
	label: string;
	error?: string;
	hideLabel?: boolean;
	isLabelBefore?: boolean;
	isTemplateLabel?: boolean;
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "size" | "ref">;

export const Checkbox = forwardRef<Ref, CheckboxProps>(
	(
		{
			id,
			label,
			error,
			className,
			hideLabel = false,
			isLabelBefore = false,
			isTemplateLabel = false,
			...props
		},
		forwardedRef,
	) => {
		const hasError = !!error;

		return (
			<div
				ref={forwardedRef}
				className={`customCheckbox ${className ? className : ""} ${hasError ? "customCheckbox--error" : ""}`}
			>
				<input
					id={id}
					{...props}
					type="checkbox"
					className={`customCheckbox__field ${isLabelBefore ? "customCheckbox__field--right" : ""}`}
					aria-invalid={hasError ? "true" : "false"}
				/>
				{isLabelBefore && (
					<label
						htmlFor={id}
						className={`
							customCheckbox__label
							${hideLabel ? "srOnly" : ""}
							${isTemplateLabel ? "customCheckbox__label--template" : ""}
						`}
					>
						{label}
					</label>
				)}
				<svg
					width="20"
					height="20"
					fill="none"
					aria-hidden="true"
					viewBox="0 0 20 20"
					className="customCheckbox__svg customCheckbox__svg--first"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="white" stroke="#D7DBEC" />
				</svg>
				<svg
					width="20"
					height="20"
					fill="none"
					aria-hidden="true"
					viewBox="0 0 20 20"
					className={`customCheckbox__svg customCheckbox__svg--second ${isLabelBefore ? "customCheckbox__svg--right" : ""}`}
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width="20" height="20" rx="4" fill="#1E5EFF" />
					<path
						fill="white"
						fillRule="evenodd"
						clipRule="evenodd"
						d="M13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0676 7.65338 15.0953 8.22061 14.7903 8.6129L14.7071 8.70711L9.70711 13.7071C9.34662 14.0676 8.77939 14.0953 8.3871 13.7903L8.29289 13.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289C5.65338 8.93241 6.22061 8.90468 6.6129 9.2097L6.70711 9.29289L9 11.585L13.2929 7.29289Z"
					/>
				</svg>
				{!isLabelBefore && (
					<label
						htmlFor={id}
						className={`
							customCheckbox__label
							${hideLabel ? "srOnly" : ""}
							${isTemplateLabel ? "customCheckbox__label--template" : ""}
						`}
					>
						{label}
					</label>
				)}
				{hasError && (
					<p role="alert" className="customCheckbox__error">
						{error}
					</p>
				)}
			</div>
		);
	},
);
