import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";

type QueryDefaults = Record<string, string>;

type QueryUpdates = Partial<{ [key: string]: string | null | undefined }>;

type QueryUpdater = QueryUpdates | ((prev: QueryDefaults) => QueryUpdates);

export const useQueryParams = (keysWithDefaults: QueryDefaults) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const values = useMemo(() => {
		const result = { ...keysWithDefaults } as QueryDefaults;

		for (const key of Object.keys(keysWithDefaults)) {
			const paramValue = searchParams.get(key);
			if (paramValue !== null) {
				result[key] = paramValue;
			}
			// result[key] = paramValue !== null ? paramValue : defaultValue;
		}

		return result;
	}, [searchParams, keysWithDefaults]);

	const setValues = useCallback(
		(updates: QueryUpdater, delay?: number) => {
			const newParams = new URLSearchParams(searchParams);

			const updatesObject = typeof updates === "function" ? updates({ ...values }) : updates;

			for (const [key, value] of Object.entries(updatesObject)) {
				const defaultValue = keysWithDefaults[key];

				if (value === null || value === undefined) {
					newParams.delete(key);
				} else if (value === defaultValue) {
					newParams.delete(key);
				} else {
					if (value) newParams.set(key, value);
				}
			}

			if (delay) {
				setTimeout(() => {
					setSearchParams(newParams);
				}, delay);
			} else {
				setSearchParams(newParams);
			}
		},
		[values, searchParams, keysWithDefaults, setSearchParams],
	);

	return [values, setValues] as const;
};
