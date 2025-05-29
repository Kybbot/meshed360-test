import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import {
	ExtendedSalesOrder,
	FulfilmentType,
	GetOrderByIdResponseType,
	UpdateFulfillmentPackingType,
} from "@/@types/salesOrders/api.ts";

export const useAuthorisePacking = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<{ fulfillment: FulfilmentType; salesOrder: ExtendedSalesOrder }>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			orderId: string;
			fulfillmentId: string;
			body: UpdateFulfillmentPackingType;
		}
	>({
		mutationKey: ["authorise-packing"],
		mutationFn: async ({ organisationId, orderId, fulfillmentId, body }) => {
			await axiosInstance.post(
				`/api/sales-orders/${organisationId}/orders/${orderId}/fulfillments/${fulfillmentId}/packing/save`,
				JSON.stringify(body),
			);

			const { data } = await axiosInstance.post<
				ApiResult<{ fulfillment: FulfilmentType; salesOrder: ExtendedSalesOrder }>
			>(
				`/api/sales-orders/${organisationId}/orders/${orderId}/fulfillments/${fulfillmentId}/packing/authorize`,
				JSON.stringify(body),
			);

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

			toast.success("Packing was successfully authorized");
		},
		onError(error) {
			showError(error);
		},
	});
};
