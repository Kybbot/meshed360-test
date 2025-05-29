import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import { CreateOrderType, GetOrderByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useCreateOrder = (onSuccess: (orderId: string) => void) => {
	return useMutation<
		ApiResult<GetOrderByIdResponseType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			body: CreateOrderType;
		}
	>({
		mutationKey: ["create-order"],
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetOrderByIdResponseType>>(
				`/api/sales-orders/${organisationId}/orders/`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (data) => {
			toast.success("New Order was successfully added");
			onSuccess(data.data.salesOrder.id);
		},
		onError(error) {
			showError(error);
		},
	});
};
