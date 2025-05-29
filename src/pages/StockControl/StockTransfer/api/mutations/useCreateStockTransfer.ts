import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateStockTransferType, GetStockTransferResponseType } from "@/@types/stockControl";

export const useCreateStockTransfer = () => {
	return useMutation<
		ApiResult<GetStockTransferResponseType>,
		AxiosError<ApiError>,
		{ organisationId: string; body: CreateStockTransferType }
	>({
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockTransferResponseType>>(
				`/api/stock-control/${organisationId}/transfers`,
				body,
			);
			return data;
		},
		onSuccess: () => {
			toast.success("New Stock Transfer was successfully added");
		},
		onError: (error) => {
			showError(error);
		},
	});
};
