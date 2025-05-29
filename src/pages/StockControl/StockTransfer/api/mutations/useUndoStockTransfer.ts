import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockTransferResponseType } from "@/@types/stockControl";

export const useUndoStockTransfer = () => {
	const queryClient = useQueryClient();

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
				`/api/stock-control/${organisationId}/transfers/${stockTransferId}/undo`,
			);
			return data;
		},
		onSuccess: (newData, variables) => {
			toast.success("Stock Transfer was successfully undone");
			queryClient.setQueryData<ApiResult<GetStockTransferResponseType>>(
				["get-stock-transfer-by-id", variables.organisationId, variables.stockTransferId],
				(oldData) => {
					if (oldData) {
						return {
							...oldData,
							data: {
								...oldData.data,
								stockTransfer: {
									...oldData.data.stockTransfer,
									status: newData.data.stockTransfer.status,
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
