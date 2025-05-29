import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError.ts";
import { axiosInstance } from "@/utils/axios.ts";

import { ApiError, ApiResult } from "@/@types/api.ts";
import {
	ExtendedSalesOrder,
	GetOrderByIdResponseType,
	InvoiceType,
	UpdateInvoiceType,
} from "@/@types/salesOrders/api.ts";

export const useSaveInvoice = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<{ salesOrderInvoice: InvoiceType; salesOrder: ExtendedSalesOrder }>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			orderId: string;
			invoiceId: string;
			body: UpdateInvoiceType;
		}
	>({
		mutationKey: ["save-invoice"],
		mutationFn: async ({ organisationId, orderId, invoiceId, body }) => {
			const { data } = await axiosInstance.post<
				ApiResult<{ salesOrderInvoice: InvoiceType; salesOrder: ExtendedSalesOrder }>
			>(
				`/api/sales-orders/${organisationId}/orders/${orderId}/invoices/${invoiceId}/save`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (data, { organisationId, orderId }) => {
			await queryClient.invalidateQueries({
				queryKey: ["get-invoices-by-id", organisationId, orderId],
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

			toast.success("Invoice was successfully saved");
		},
		onError(error) {
			showError(error);
		},
	});
};
