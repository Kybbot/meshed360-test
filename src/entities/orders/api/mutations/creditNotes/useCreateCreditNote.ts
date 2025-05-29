import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import {
	CreditNoteType,
	ExtendedSalesOrder,
	GetOrderByIdResponseType,
	UpdateInvoiceType,
} from "@/@types/salesOrders/api.ts";

export const useCreateCreditNote = (onSuccess: (invoiceId: string) => void) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<{ salesOrderCreditNote: CreditNoteType; salesOrder: ExtendedSalesOrder }>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			orderId: string;
			body: UpdateInvoiceType;
		}
	>({
		mutationKey: ["create-credit-note"],
		mutationFn: async ({ organisationId, orderId, body }) => {
			const { data } = await axiosInstance.post<
				ApiResult<{ salesOrderCreditNote: CreditNoteType; salesOrder: ExtendedSalesOrder }>
			>(`/api/sales-orders/${organisationId}/orders/${orderId}/credit-notes`, JSON.stringify(body));

			return data;
		},
		onSuccess: async (data, { organisationId, orderId }) => {
			await queryClient.invalidateQueries({
				queryKey: ["get-credit-notes-by-id", organisationId, orderId],
				exact: true,
			});

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
							salesOrder: {
								...existing.data.salesOrder,
								status: data.data.salesOrder.status,
							},
						},
					},
				);
			}

			onSuccess(data.data.salesOrderCreditNote.id);

			toast.success("New Invoice was successfully added");
		},
		onError(error) {
			showError(error);
		},
	});
};
