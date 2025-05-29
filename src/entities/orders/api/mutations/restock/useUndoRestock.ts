import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import { ExtendedSalesOrder, RestockType } from "@/@types/salesOrders/api.ts";

export const useUndoRestock = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<{ salesOrderRestock: RestockType; salesOrder: ExtendedSalesOrder }>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			orderId: string;
		}
	>({
		mutationKey: ["undo-restock"],
		mutationFn: async ({ organisationId, orderId }) => {
			const { data } = await axiosInstance.post<
				ApiResult<{ salesOrderRestock: RestockType; salesOrder: ExtendedSalesOrder }>
			>(`/api/sales-orders/${organisationId}/orders/${orderId}/restock/undo`);

			return data;
		},
		onSuccess: async (_, { organisationId, orderId }) => {
			await queryClient.invalidateQueries({
				queryKey: ["get-restock-by-id", organisationId, orderId],
				exact: true,
			});
		},
		onError(error) {
			showError(error);
		},
	});
};
