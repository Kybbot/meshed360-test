import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { UpdateBillType, GetAddBillResponseType } from "@/@types/purchaseOrders";

export const useUpdateBill = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetAddBillResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: UpdateBillType;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<GetAddBillResponseType>>(
				`/api/purchase-orders/bills`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Bill was successfully updated");

			await queryClient.invalidateQueries({ queryKey: ["get-purchase-order-bills", variables.orderId] });
			await queryClient.invalidateQueries({ queryKey: ["get-purchase-order-by-id", variables.orderId] });
		},
		onError(error) {
			showError(error);
		},
	});
};
