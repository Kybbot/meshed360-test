import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetStockTransferResponseType } from "@/@types/stockControl";

export const useAuthorizeStockTransfer = () => {
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
				`/api/stock-control/${organisationId}/transfers/${stockTransferId}/authorize`,
			);
			return data;
		},
		onSuccess: (_newData, variables) => {
			toast.success("Stock Transfer was successfully authorized");
			queryClient.invalidateQueries({
				queryKey: ["get-stock-transfer-by-id", variables.organisationId, variables.stockTransferId],
			});
		},
		onError: (error) => {
			showError(error);
		},
	});
};
