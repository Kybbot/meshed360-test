import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import { OrderType, UpdateOrderType } from "@/@types/salesOrders/api.ts";

export const useUpdateOrder = () => {
	return useMutation<
		ApiResult<[OrderType]>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			body: UpdateOrderType;
			orderId: string;
		}
	>({
		mutationKey: ["update-order"],
		mutationFn: async ({ organisationId, orderId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<[OrderType]>>(
				`/api/sales-orders/${organisationId}/orders/${orderId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("Order was successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
