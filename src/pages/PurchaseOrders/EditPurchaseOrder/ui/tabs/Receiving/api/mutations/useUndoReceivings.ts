import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAllReceivingResponseType,
	UndoReceivingsStatusResponseType,
} from "@/@types/purchaseOrder/receiving";
import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

export const useUndoReceivings = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UndoReceivingsStatusResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<UndoReceivingsStatusResponseType>>(
				`/api/purchase-orders/receivings/undo`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Receivings were successfully undo");

			queryClient.setQueryData<ApiResult<GetAllReceivingResponseType>>(
				["get-purchase-order-receivings", variables.orderId],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								receivings: oldData.data.receivings.map((item) => {
									if (variables.body.id === item.id) {
										return {
											...item,
											status: newData.data.status,
										};
									}
									return item;
								}),
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
