import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateStockAdjustmentType, GetStockAdjustmentResponseType } from "@/@types/stockControl";

export const useSaveStockAdjustment = () => {
	return useMutation<
		ApiResult<GetStockAdjustmentResponseType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			stockAdjustmentId: string;
			body: CreateStockAdjustmentType;
			options?: {
				showSuccessToast?: boolean;
			};
		}
	>({
		mutationFn: async ({ organisationId, stockAdjustmentId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockAdjustmentResponseType>>(
				`/api/stock-control/${organisationId}/adjustments/${stockAdjustmentId}/save`,
				body,
			);

			return data;
		},
		onSuccess: (_newData, variables) => {
			if (variables.options?.showSuccessToast !== false) {
				toast.success("Stock Adjustment was successfully saved");
			}
		},
		onError: (error) => {
			showError(error);
		},
	});
};
