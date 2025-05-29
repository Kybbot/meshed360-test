import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockAdjustmentResponseType } from "@/@types/stockControl";

export const useAuthorizeStockAdjustment = () => {
	const queryClient = useQueryClient();

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
				`/api/stock-control/${organisationId}/adjustments/${stockAdjustmentId}/authorize`,
			);

			return data;
		},
		onSuccess: (_newData, variables) => {
			toast.success("Stock Adjustment was successfully authorized");
			queryClient.invalidateQueries({
				queryKey: ["get-stock-adjustment-by-id", variables.organisationId, variables.stockAdjustmentId],
			});
		},
		onError: (error) => {
			showError(error);
		},
	});
};
