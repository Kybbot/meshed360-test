import { FC } from "react";
import { AxiosError } from "axios";

import { ApiError } from "@/@types/api";

type ImportErrorProps = {
	error: AxiosError<ApiError, unknown>;
};

export const ImportError: FC<ImportErrorProps> = ({ error }) => {
	if (
		error.response &&
		error.response.data &&
		error.response.data.error &&
		error.response.data.error.name === "ZodError"
	) {
		return <p className="import__error">Validation Error</p>;
	}

	if (error.response && error.response.data) {
		const messages = error.response.data.data.message.split("\n");

		return (
			<>
				{messages.map((item, index) => (
					<p className="import__error" key={index}>
						{item}
					</p>
				))}
			</>
		);
	}

	return <p className="import__error">{error.message}</p>;
};
