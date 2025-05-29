import { AxiosError, isAxiosError } from "axios";

import { ApiError } from "@/@types/api";

export const returnErrorText = (error: AxiosError<ApiError, unknown>, prefix?: string) => {
	if (
		error.response &&
		error.response.data &&
		error.response.data.error &&
		error.response.data.error.name === "ZodError"
	) {
		return `${prefix ?? ""}Validation Error`;
	}

	if (isAxiosError<ApiError>(error) && error.response && error.response.data) {
		return `${prefix ?? ""}${error.response.data.data.message}`;
	}

	return `${prefix ?? ""}${error.message}`;
};
