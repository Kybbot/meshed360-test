import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { GetCreditNoteResponseType, VoidCreditNoteResponseType } from "@/@types/purchaseOrder/creditNote";

export const useVoidCreditNote = (handleNewCreditNote: () => void) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<VoidCreditNoteResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<VoidCreditNoteResponseType>>(
				`/api/purchase-orders/credit-notes/void`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Credit Note was successfully voided");

			queryClient.setQueryData<ApiResult<GetCreditNoteResponseType>>(
				["get-purchase-order-credit-note", variables.orderId],
				(oldData) => {
					if (oldData) {
						handleNewCreditNote();

						return {
							data: null,
							status: oldData.status,
						};
					}

					return oldData;
				},
			);

			queryClient.setQueriesData<ApiResult<GetPurchaseOrderByIdResponseType>>(
				{ queryKey: ["get-purchase-order-by-id", variables.orderId] },
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
