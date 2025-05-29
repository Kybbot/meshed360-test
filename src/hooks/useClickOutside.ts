import { useCallback, useEffect } from "react";

export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
	const handleClick = useCallback(
		(e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				callback();
			}
		},
		[ref, callback],
	);

	useEffect(() => {
		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [handleClick]);
};
