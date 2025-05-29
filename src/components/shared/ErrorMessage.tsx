import { FC } from "react";
import { AxiosError } from "axios";

import { ApiError } from "@/@types/api";

type ErrorMessage = {
	useTopMargin?: boolean;
	error: AxiosError<ApiError, unknown>;
};

export const ErrorMessage: FC<ErrorMessage> = ({ error, useTopMargin = false }) => {
	if (
		error.response &&
		error.response.data &&
		error.response.data.error &&
		error.response.data.error.name === "ZodError"
	) {
		return (
			<p className={`errorMessage ${useTopMargin ? "errorMessage--topMargin" : ""}`}>Validation Error</p>
		);
	}

	if (error.response && error.response.data) {
		return (
			<p className={`errorMessage ${useTopMargin ? "errorMessage--topMargin" : ""}`}>
				{error.response.data.data.message}
			</p>
		);
	}

	return <p className={`errorMessage ${useTopMargin ? "errorMessage--topMargin" : ""}`}>{error.message}</p>;
};
