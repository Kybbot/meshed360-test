import { ReactNode, forwardRef } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenuRoot = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuItem = DropdownMenuPrimitive.Item;
export const DropdownMenuLabel = DropdownMenuPrimitive.Label;

interface DropdownMenuProps extends DropdownMenuPrimitive.DropdownMenuContentProps {
	children: ReactNode[] | ReactNode;
}

type Ref = HTMLDivElement;

export const DropdownMenu = forwardRef<Ref, DropdownMenuProps>(({ children, ...props }, forwardedRef) => {
	return (
		<DropdownMenuPrimitive.Portal container={document.body.querySelector("#portal2") as HTMLDivElement}>
			<DropdownMenuPrimitive.Content {...props} ref={forwardedRef}>
				{children}
			</DropdownMenuPrimitive.Content>
		</DropdownMenuPrimitive.Portal>
	);
});
