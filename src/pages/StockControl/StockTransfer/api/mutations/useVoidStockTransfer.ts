import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockTransferResponseType } from "@/@types/stockControl";

export const useVoidStockTransfer = () => {
	return useMutation<
		ApiResult<GetStockTransferResponseType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			stockTransferId: string;
		}
	>({
		mutationFn: async ({ organisationId, stockTransferId }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockTransferResponseType>>(
				`/api/stock-control/${organisationId}/transfers/${stockTransferId}/void`,
			);
			return data;
		},
		onSuccess: () => {
			toast.success("Stock Transfer was successfully voided");
		},
		onError: (error) => {
			showError(error);
		},
	});
};
