import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "./useDebounce";

import { LayputOptionsData } from "@/@types/utility";

export const useLayoutOptions = (
	type:
		| "orderLayoutOptions"
		| "activeProductLayoutOptions"
		| "purchaseOrderLayoutOptions"
		| "activeSupplierLayoutOptions"
		| "activeCustomersLayoutOptions"
		| "stockControlLayoutOptions"
		| "stockAvailabilityLayoutOptions",
	defaultOptions: LayputOptionsData,
) => {
	const [layoutOptions, setLayoutOptions] = useState(() => {
		const savedLayoutOptions = localStorage.getItem(type);

		if (savedLayoutOptions) {
			const parseOptions = JSON.parse(savedLayoutOptions) as LayputOptionsData;

			const parseKeys = Object.keys(parseOptions).length;
			const defaultKeys = Object.keys(defaultOptions).length;

			if (parseKeys < defaultKeys || parseKeys > defaultKeys) {
				localStorage.setItem(type, JSON.stringify(defaultOptions));
				return defaultOptions;
			}

			return parseOptions;
		}

		return defaultOptions;
	});
	const layoutOptionsDebounce = useDebounce(layoutOptions);

	const handleResetLayoutOptions = useCallback(() => {
		setLayoutOptions(defaultOptions);
	}, [defaultOptions]);

	const handleToggleLayoutOptions = useCallback((col: string) => {
		setLayoutOptions((prev) => {
			return { ...prev, [col]: { ...prev[col], isShown: !prev[col].isShown } };
		});
	}, []);

	useEffect(() => {
		localStorage.setItem(type, JSON.stringify(layoutOptionsDebounce));
	}, [type, layoutOptionsDebounce]);

	return { layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions };
};
