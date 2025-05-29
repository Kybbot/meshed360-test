import { DetailedHTMLProps, forwardRef, TextareaHTMLAttributes } from "react";

type Ref = HTMLInputElement;

export type TextareaProps = {
	label: string;
	error?: string;
} & Omit<DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "size" | "ref">;

export const Textarea = forwardRef<Ref, TextareaProps>(
	({ id, label, error, className, ...props }, forwardedRef) => {
		const hasError = !!error;

		return (
			<div
				ref={forwardedRef}
				className={`customTextarea ${className ? className : ""} ${hasError ? "customTextarea--error" : ""}`}
			>
				<textarea
					id={id}
					{...props}
					placeholder=""
					className="customTextarea__field"
					aria-invalid={hasError ? "true" : "false"}
				/>
				<label htmlFor={id} className="customTextarea__label">
					{label}
				</label>
				{hasError && (
					<p role="alert" className="customTextarea__error">
						{error}
					</p>
				)}
			</div>
		);
	},
);
