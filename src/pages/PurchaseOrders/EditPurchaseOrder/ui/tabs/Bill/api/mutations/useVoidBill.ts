import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { VoidBillStatusResponseType, GetAllBillsResponseType } from "@/@types/purchaseOrders";

export const useVoidBill = (handleNewBill: () => void) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<VoidBillStatusResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<VoidBillStatusResponseType>>(
				`/api/purchase-orders/bills/void`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Bill was successfully voided");

			queryClient.setQueryData<ApiResult<GetAllBillsResponseType>>(
				["get-purchase-order-bills", variables.orderId],
				(oldData) => {
					if (oldData) {
						handleNewBill();

						return {
							data: {
								bills: oldData.data.bills.filter((item) => item.id !== variables.body.id),
							},
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
