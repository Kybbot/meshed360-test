import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockAdjustmentResponseType } from "@/@types/stockControl";

export const useVoidStockAdjustment = () => {
	return useMutation<
		ApiResult<GetStockAdjustmentResponseType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			stockAdjustmentId: string;
		}
	>({
		mutationFn: async ({ organisationId, stockAdjustmentId }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockAdjustmentResponseType>>(
				`/api/stock-control/${organisationId}/adjustments/${stockAdjustmentId}/void`,
			);

			return data;
		},
		onSuccess: () => {
			toast.success("Stock Adjustment was successfully voided");
		},
		onError: (error) => {
			showError(error);
		},
	});
};
