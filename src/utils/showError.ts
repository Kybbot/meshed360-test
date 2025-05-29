import { AxiosError, isAxiosError } from "axios";

import { ApiError } from "@/@types/api";
import toast from "react-hot-toast";

export const showError = (error: AxiosError<ApiError, unknown>, prefix?: string) => {
	if (
		error.response &&
		error.response.data &&
		error.response.data.error &&
		error.response.data.error.name === "ZodError"
	) {
		toast.error(`${prefix ?? ""}Validation Error`);
		return;
	}

	if (isAxiosError<ApiError>(error) && error.response && error.response.data) {
		toast.error(`${prefix ?? ""}${error.response.data.data.message}`);
		return;
	}

	toast.error(`${prefix ?? ""}${error.message}`);
};
