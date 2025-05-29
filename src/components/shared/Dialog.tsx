import { ReactNode, forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const DialogRoot = DialogPrimitive.Root;
export const DialogClose = DialogPrimitive.Close;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;

interface DialogContentProps extends DialogPrimitive.DialogContentProps {
	children: ReactNode;
	size?: string;
	className?: string;
	removeOverflow?: boolean;
}

type Ref = HTMLDivElement;

export const DialogContent = forwardRef<Ref, DialogContentProps>(
	({ children, size, className, removeOverflow, ...props }, forwardedRef) => (
		<DialogPrimitive.Portal container={document.body.querySelector("#portal") as HTMLDivElement}>
			<DialogPrimitive.Overlay className="dialog__overlay" />
			<DialogPrimitive.Content
				ref={forwardedRef}
				aria-describedby={undefined}
				className={`
					dialog__content
					${size ? `dialog__content--${size}` : ""}
					${removeOverflow ? `dialog__content--removeOverflow` : ""}
				`}
				{...props}
			>
				<div className={`dialog__main ${className ? className : ""}`}>{children}</div>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	),
);
