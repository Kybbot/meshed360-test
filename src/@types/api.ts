export type ApiResult<T> = {
	data: T;
	status: "SUCCESS";
};

export type ApiError = {
	data: {
		code?: number;
		message: string;
	};
	error?: { name: "ZodError" };
	status: "ERROR";
};

export type ApiResponse<T> = ApiError | ApiResult<T>;
