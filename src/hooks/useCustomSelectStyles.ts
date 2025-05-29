import { useEffect, useRef } from "react";

export const useCustomSelectStyles = (isOpen: boolean) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			if (contentRef.current && containerRef.current) {
				const clientHeight = document.documentElement.clientHeight;
				const { height: contentHeight } = contentRef.current.getBoundingClientRect();
				const { bottom: containerBottom } = containerRef.current.getBoundingClientRect();

				const diff = Math.max(0, contentHeight + containerBottom - clientHeight);

				if (diff !== 0 && diff < contentHeight) {
					document.documentElement.style.setProperty("--customSelect-top", `-${contentHeight}px`);
				} else {
					document.documentElement.style.setProperty("--customSelect-top", "100%");
				}
			}

			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

			document.body.style.overflow = "hidden";
			document.body.style.overscrollBehavior = "contain";
			document.body.style.marginRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
		} else {
			document.body.style.removeProperty("overflow");
			document.body.style.removeProperty("margin-right");
			document.body.style.removeProperty("overscroll-behavior");
		}

		return () => {
			document.body.style.removeProperty("overflow");
			document.body.style.removeProperty("margin-right");
			document.body.style.removeProperty("overscroll-behavior");
		};
	}, [isOpen]);

	return { contentRef, containerRef };
};
