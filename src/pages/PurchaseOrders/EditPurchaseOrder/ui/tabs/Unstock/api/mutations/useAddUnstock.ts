import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateUnstockType, GetAddUnstokResponseType } from "@/@types/purchaseOrder/unstock";

export const useAddUnstock = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetAddUnstokResponseType>,
		AxiosError<ApiError>,
		{
			body: CreateUnstockType;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetAddUnstokResponseType>>(
				`/api/purchase-orders/unstock`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Unstock was successfully added");

			queryClient.invalidateQueries({ queryKey: ["get-purchase-order-unstock", variables.body.orderId] });
		},
		onError(error) {
			showError(error);
		},
	});
};
