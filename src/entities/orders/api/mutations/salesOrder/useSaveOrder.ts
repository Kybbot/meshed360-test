import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import { UpdateOrderLinesType, GetOrderByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useSaveOrder = () => {
	const queryClient = useQueryClient();
	return useMutation<
		ApiResult<GetOrderByIdResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			organisationId: string;
			body: UpdateOrderLinesType;
		}
	>({
		mutationKey: ["save-order"],
		mutationFn: async ({ organisationId, orderId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetOrderByIdResponseType>>(
				`/api/sales-orders/${organisationId}/orders/${orderId}/save`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (data, { organisationId, orderId }) => {
			toast.success("Sales Order was successfully saved");

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
								orderLines: data.data.salesOrder.orderLines,
								serviceLines: data.data.salesOrder.serviceLines,
							},
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
