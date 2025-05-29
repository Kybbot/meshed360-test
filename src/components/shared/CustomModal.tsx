import { FC, ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type Props = {
	open: boolean;
	children: ReactNode;
	onOpenChange(open: boolean): void;
	size?: "large" | "big" | "default" | "small";
};

export const CustomModal: FC<Props> = ({ open, children, size = "default", onOpenChange }) => {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (open) {
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

			document.body.style.overflow = "hidden";
			document.body.style.overscrollBehavior = "contain";
			document.body.style.marginRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
		}

		return () => {
			document.body.style.removeProperty("overflow");
			document.body.style.removeProperty("margin-right");
			document.body.style.removeProperty("overscroll-behavior");
		};
	}, [open]);

	if (open) {
		return ReactDOM.createPortal(
			<div
				ref={contentRef}
				aria-hidden={open}
				className={`customModal ${open ? "customModal--visible" : ""}`}
			>
				<div className="customModal__overlay" aria-hidden="true" onClick={() => onOpenChange(false)} />
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Modal window"
					className={`customModal__content customModal__content--${size}`}
					data-state={open ? "open" : "closed"}
				>
					{children}
				</div>
			</div>,
			document.body.querySelector("#portal") as HTMLDivElement,
		);
	} else {
		return null;
	}
};
