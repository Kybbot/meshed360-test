import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import { GetOrderByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useVoidQuote = () => {
	const queryClient = useQueryClient();
	return useMutation<
		void,
		AxiosError<ApiError>,
		{
			orderId: string;
			organisationId: string;
		}
	>({
		mutationKey: ["authorise-quote"],
		mutationFn: async ({ organisationId, orderId }) => {
			await axiosInstance.post(`/api/sales-orders/${organisationId}/orders/${orderId}/quote/void`);
		},
		onSuccess: (_, { organisationId, orderId }) => {
			toast.success("Quote was successfully voided");

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
							quote: null,
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
