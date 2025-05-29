import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAdditionalExpenseType,
	UndoAdditionalExpenseStatusResponseType,
} from "@/@types/purchaseOrder/additionalExpense";
import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

export const useUndoAdditionalExpense = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UndoAdditionalExpenseStatusResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string }; // orderId
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<UndoAdditionalExpenseStatusResponseType>>(
				`/api/purchase-orders/expenses/undo`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Additional Expenses was successfully undo");

			queryClient.setQueryData<ApiResult<GetAdditionalExpenseType>>(
				["get-purchase-order-additional-expense", variables.body.id],
				(oldData) => {
					if (oldData) {
						return {
							data: oldData.data ? { ...oldData.data, status: newData.data.additionalExpensesStatus } : null,
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
