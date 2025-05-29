import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockAdjustmentResponseType } from "@/@types/stockControl";

export const useUndoStockAdjustment = () => {
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
				`/api/stock-control/${organisationId}/adjustments/${stockAdjustmentId}/undo`,
			);

			return data;
		},
		onSuccess: (newData, variables) => {
			toast.success("Stock Adjustment was successfully undone");

			queryClient.setQueryData<ApiResult<GetStockAdjustmentResponseType>>(
				["get-stock-adjustment-by-id", variables.organisationId, variables.stockAdjustmentId],
				(oldData) => {
					if (oldData) {
						return {
							...oldData,
							data: {
								...oldData.data,
								stockAdjustment: {
									...oldData.data.stockAdjustment,
									status: newData.data.stockAdjustment.status,
								},
							},
						};
					}
					return oldData;
				},
			);
		},
		onError: (error) => {
			showError(error);
		},
	});
};
