import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import {
	CreateFulfillmentType,
	ExtendedSalesOrder,
	FulfilmentType,
	GetOrderByIdResponseType,
} from "@/@types/salesOrders/api.ts";

export const useCreateFulfilment = (onSuccess: (fulfilmentId: string) => void) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<{ fulfillment: FulfilmentType; salesOrder: ExtendedSalesOrder }>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			orderId: string;
			body: CreateFulfillmentType;
		}
	>({
		mutationKey: ["create-fulfilment"],
		mutationFn: async ({ organisationId, orderId, body }) => {
			const { data } = await axiosInstance.post<
				ApiResult<{ fulfillment: FulfilmentType; salesOrder: ExtendedSalesOrder }>
			>(`/api/sales-orders/${organisationId}/orders/${orderId}/fulfillments`, JSON.stringify(body));

			return data;
		},
		onSuccess: async (data, { organisationId, orderId }) => {
			await queryClient.invalidateQueries({
				queryKey: ["get-fulfilment-by-id", organisationId, orderId],
				exact: true,
			});

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
						},
					},
				);
			}

			onSuccess(data.data.fulfillment.id);

			toast.success("New Fulfillment was successfully added");
		},
		onError(error) {
			showError(error);
		},
	});
};
