import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import { GetOrderByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useUndoQuote = () => {
	const queryClient = useQueryClient();
	return useMutation<
		ApiResult<GetOrderByIdResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			organisationId: string;
		}
	>({
		mutationKey: ["undo-quote"],
		mutationFn: async ({ organisationId, orderId }) => {
			const { data } = await axiosInstance.post<ApiResult<GetOrderByIdResponseType>>(
				`/api/sales-orders/${organisationId}/orders/${orderId}/quote/undo`,
			);

			return data;
		},
		onSuccess: async (data, { organisationId, orderId }) => {
			const existing = queryClient.getQueryData<ApiResult<GetOrderByIdResponseType>>([
				"get-order-by-id",
				organisationId,
				orderId,
			]);

			if (existing) {
				queryClient.setQueryData<ApiResult<GetOrderByIdResponseType>>(
					["get-order-by-id", organisationId, orderId],
					{
						...existing,
						data: {
							...existing.data,
							salesOrder: {
								...existing.data.salesOrder,
								status: data.data.salesOrder.status,
							},
							quote: existing.data.quote
								? {
										...existing.data.quote,
										status: "DRAFT",
									}
								: null,
						},
					},
				);
			}
		},
		onError(error) {
			showError(error);
		},
	});
};
