import { ReactNode, forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

interface SimpleSelectProps extends SelectPrimitive.SelectProps {
	id: string;
	children: ReactNode;
	error?: string;
	zIndex?: number;
	hideError?: boolean;
	placeholder?: string;
	isForPagination?: boolean;
	useTriggetWidth?: boolean;
}

type SimpleSelectRef = HTMLButtonElement;

export const SimpleSelect = forwardRef<SimpleSelectRef, SimpleSelectProps>(
	(
		{
			id,
			error,
			children,
			placeholder,
			hideError = false,
			useTriggetWidth = true,
			isForPagination = false,
			...props
		},
		forwardedRef,
	) => {
		const hasError = !!error;

		return (
			<SelectPrimitive.Root {...props}>
				<SelectPrimitive.Trigger
					id={id}
					ref={forwardedRef}
					className={`
						simpleSelect__trigger
						${hasError ? "simpleSelect__trigger--error" : ""}
						${isForPagination ? "simpleSelect__trigger--pagination" : ""}
					`}
				>
					<SelectPrimitive.Value placeholder={placeholder} />
					<SelectPrimitive.Icon className="simpleSelect__icon">
						<svg focusable="false">
							<use xlinkHref="/icons/icons.svg#arrowDown" />
						</svg>
					</SelectPrimitive.Icon>
					{hasError && (
						<span className={`input__error ${hideError ? "srOnly" : ""}`} role="alert">
							{error}
						</span>
					)}
				</SelectPrimitive.Trigger>
				<SelectPrimitive.Portal container={document.body.querySelector("#portal2") as HTMLDivElement}>
					<SelectPrimitive.Content
						position="popper"
						style={{ zIndex: props.zIndex }}
						className={`
							simpleSelect__content
							${isForPagination ? "simpleSelect__content--pagination" : ""}
							${useTriggetWidth ? "simpleSelect__content--triggerWidth" : ""}
						`}
					>
						<SelectPrimitive.Viewport className="simpleSelect__viewport">{children}</SelectPrimitive.Viewport>
					</SelectPrimitive.Content>
				</SelectPrimitive.Portal>
			</SelectPrimitive.Root>
		);
	},
);

interface SelectItemProps extends SelectPrimitive.SelectItemProps {
	children: ReactNode;
}

type SelectItemRef = HTMLDivElement;

export const SelectItem = forwardRef<SelectItemRef, SelectItemProps>(
	({ children, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Item {...props} ref={forwardedRef} className="simpleSelect__item">
				<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			</SelectPrimitive.Item>
		);
	},
);
