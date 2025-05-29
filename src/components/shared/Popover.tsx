import { forwardRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

type Ref = HTMLDivElement;

interface PopoverContentProps extends PopoverPrimitive.PopoverProps {
	customClassName?: string;
}

export const PopoverContent = forwardRef<Ref, PopoverContentProps>(
	({ children, customClassName, ...props }, forwardedRef) => (
		<PopoverPrimitive.Portal container={document.body.querySelector("#portal2") as HTMLDivElement}>
			<PopoverPrimitive.Content
				align="start"
				sideOffset={10}
				ref={forwardedRef}
				className={`popover__content ${customClassName}`}
				{...props}
			>
				{children}
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Portal>
	),
);
