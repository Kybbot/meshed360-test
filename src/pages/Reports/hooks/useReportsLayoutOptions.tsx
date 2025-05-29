import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import { LayputOptionsData } from "@/@types/utility";
import { ReportsLayoutOptionsTypes } from "@/pages/Reports/hooks/useReportsTable";

export const useReportsLayoutOptions = (
	type: ReportsLayoutOptionsTypes,
	defaultOptions: LayputOptionsData,
) => {
	const [layoutOptions, setLayoutOptions] = useState(() => {
		const savedLayoutOptions = localStorage.getItem(type);

		if (savedLayoutOptions) {
			const parseOptions = JSON.parse(savedLayoutOptions) as LayputOptionsData;
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
