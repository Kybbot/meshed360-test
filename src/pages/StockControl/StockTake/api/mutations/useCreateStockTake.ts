import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateStockTakeType, GetStockTakeResponseType } from "@/@types/stockControl";

export const useCreateStockTake = () => {
	return useMutation<
		ApiResult<GetStockTakeResponseType>,
		AxiosError<ApiError>,
		{ organisationId: string; body: CreateStockTakeType }
	>({
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockTakeResponseType>>(
				`/api/stock-control/${organisationId}/stock-takes`,
				body,
			);
			return data;
		},
		onSuccess: () => {
			toast.success("New Stock Take was successfully added");
		},
		onError: (error) => {
			showError(error);
		},
	});
};
