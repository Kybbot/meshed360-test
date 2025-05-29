import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { AdditionalExpense, CreateAdditionalExpenseType } from "@/@types/purchaseOrder/additionalExpense";

export const useAddAdditionalExpense = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<AdditionalExpense>,
		AxiosError<ApiError>,
		{
			body: CreateAdditionalExpenseType;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<AdditionalExpense>>(
				`/api/purchase-orders/expenses`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Additional Expenses was successfully added");

			queryClient.invalidateQueries({
				queryKey: ["get-purchase-order-additional-expense", variables.body.orderId],
			});
		},
		onError(error) {
			showError(error);
		},
	});
};
