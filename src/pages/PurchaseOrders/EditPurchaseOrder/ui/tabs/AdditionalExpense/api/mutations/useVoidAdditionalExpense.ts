import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAdditionalExpenseType,
	VoidAdditionalExpenseStatusResponseType,
} from "@/@types/purchaseOrder/additionalExpense";
import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

export const useVoidAdditionalExpense = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<VoidAdditionalExpenseStatusResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string }; // orderId
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<VoidAdditionalExpenseStatusResponseType>>(
				`/api/purchase-orders/expenses/void`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Additional Expenses was successfully voided");

			queryClient.setQueryData<ApiResult<GetAdditionalExpenseType>>(
				["get-purchase-order-additional-expense", variables.body.id],
				(oldData) => {
					if (oldData) {
						return {
							data: oldData.data ? { lines: [], status: newData.data.additionalExpensesStatus } : null,
							status: oldData.status,
						};
					}

					return oldData;
				},
			);

			queryClient.setQueriesData<ApiResult<GetPurchaseOrderByIdResponseType>>(
				{ queryKey: ["get-purchase-order-by-id", variables.body.id] },
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.orderStatus,
							},
							status: oldData.status,
						};
					}
					return oldData;
				},
			);
		},
		onError(error) {
			showError(error);
		},
	});
};
