import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import { UpdateOrderLinesType, GetOrderByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useEmailOrder = () => {
	const queryClient = useQueryClient();
	return useMutation<
		ApiResult<GetOrderByIdResponseType> | void,
		AxiosError<ApiError>,
		{
			orderId: string;
			organisationId: string;
			body?: UpdateOrderLinesType;
		}
	>({
		mutationKey: ["email-order"],
		mutationFn: async ({ organisationId, orderId, body }) => {
			if (body) {
				const { data } = await axiosInstance.post<ApiResult<GetOrderByIdResponseType>>(
					`/api/sales-orders/${organisationId}/orders/${orderId}/save`,
					JSON.stringify(body),
				);

				await axiosInstance.post<ApiResult<GetOrderByIdResponseType>>(
					`/api/sales-orders/${organisationId}/orders/${orderId}/email`,
				);

				return data;
			} else {
				await axiosInstance.post<ApiResult<GetOrderByIdResponseType>>(
					`/api/sales-orders/${organisationId}/orders/${orderId}/email`,
				);
			}
		},
		onSuccess: async (data, { organisationId, orderId }) => {
			toast.success("Sales Order email sent successfully");

			const existing = queryClient.getQueryData<ApiResult<GetOrderByIdResponseType>>([
				"get-order-by-id",
				organisationId,
				orderId,
			]);

			if (existing && data) {
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
