import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateStockTransferType, GetStockTransferResponseType } from "@/@types/stockControl";

export const useSaveStockTransfer = () => {
	return useMutation<
		ApiResult<GetStockTransferResponseType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			stockTransferId: string;
			body: CreateStockTransferType;
			options?: {
				showSuccessToast?: boolean;
			};
		}
	>({
		mutationFn: async ({ organisationId, stockTransferId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockTransferResponseType>>(
				`/api/stock-control/${organisationId}/transfers/${stockTransferId}/save`,
				body,
			);
			return data;
		},
		onSuccess: (_newData, variables) => {
			if (variables.options?.showSuccessToast !== false) {
				toast.success("Stock Transfer was successfully saved");
			}
		},
		onError: (error) => {
			showError(error);
		},
	});
};
