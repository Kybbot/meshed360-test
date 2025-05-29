import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { GetUnstokResponseType, UndoUnstockResponseType } from "@/@types/purchaseOrder/unstock";

export const useUndoUnstock = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UndoUnstockResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<UndoUnstockResponseType>>(
				`/api/purchase-orders/unstock/undo`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Unstock was successfully undo");

			queryClient.setQueryData<ApiResult<GetUnstokResponseType>>(
				["get-purchase-order-unstock", variables.orderId],
				(oldData) => {
					if (oldData) {
						return {
							data: oldData.data ? { ...oldData.data, status: newData.data.unstockStatus } : null,
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
