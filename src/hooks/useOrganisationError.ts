import { useEffect } from "react";
import { useNavigate } from "react-router";
import { AxiosError, isAxiosError } from "axios";

import { ApiError } from "@/@types/api";

export const useOrganisationError = (isError: boolean, error: AxiosError<ApiError, unknown> | null) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (isError && error && isAxiosError<ApiError>(error)) {
			const errorMessage = error.response?.data.data.message;

			if (errorMessage === "Not found for this organisation") {
				const pathname = location.pathname;
				let newPathname = pathname;

				const isEdit = pathname.includes("edit");
				const isNew = pathname.includes("new");

				if (isEdit || isNew) {
					const segment = isEdit ? "/edit" : "/new";

					newPathname = pathname
						.split(segment)[0]
						.replace(/stockTake|stockTransfer|stockAdjustment/g, "stockControl");
				}

				navigate(newPathname);
			}
		}
	}, [isError, error, navigate]);
};
