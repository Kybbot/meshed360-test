import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay?: number, callback?: VoidFunction): T {
	const isFirstRender = useRef(true);

	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
			if (!isFirstRender.current) callback?.();

			if (isFirstRender.current) {
				isFirstRender.current = false;
			}
		}, delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay, callback]);

	return debouncedValue;
}
