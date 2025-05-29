import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAddUnstokResponseType, UpdateUnstockType } from "@/@types/purchaseOrder/unstock";

export const useUpdateUnstock = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetAddUnstokResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: UpdateUnstockType;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<GetAddUnstokResponseType>>(
				`/api/purchase-orders/unstock`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Unstock was successfully updated");

			queryClient.invalidateQueries({ queryKey: ["get-purchase-order-unstock", variables.orderId] });
		},
		onError(error) {
			showError(error);
		},
	});
};
