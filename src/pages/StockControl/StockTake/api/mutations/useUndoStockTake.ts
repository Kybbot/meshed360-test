import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockTakeResponseType } from "@/@types/stockControl";

export const useUndoStockTake = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetStockTakeResponseType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			stockTakeId: string;
		}
	>({
		mutationFn: async ({ organisationId, stockTakeId }) => {
			const { data } = await axiosInstance.post<ApiResult<GetStockTakeResponseType>>(
				`/api/stock-control/${organisationId}/stock-takes/${stockTakeId}/undo`,
			);

			return data;
		},
		onSuccess: (newData, variables) => {
			toast.success("Stock Take was successfully undone");

			queryClient.setQueryData<ApiResult<GetStockTakeResponseType>>(
				["get-stock-take-by-id", variables.organisationId, variables.stockTakeId],
				(oldData) => {
					if (oldData) {
						return {
							...oldData,
							data: {
								...oldData.data,
								stockTake: {
									...oldData.data.stockTake,
									status: newData.data.stockTake.status,
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
