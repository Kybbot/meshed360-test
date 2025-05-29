import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	GetAllReceivingResponseType,
	VoidReceivingsStatusResponseType,
} from "@/@types/purchaseOrder/receiving";
import { ApiError, ApiResult } from "@/@types/api";

export const useVoidReceivings = (handleNewReceiving: () => void) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<VoidReceivingsStatusResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<VoidReceivingsStatusResponseType>>(
				`/api/purchase-orders/receivings/void`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Purchase Order Lines were successfully voided");

			queryClient.setQueryData<ApiResult<GetAllReceivingResponseType>>(
				["get-purchase-order-receivings", variables.orderId],
				(oldData) => {
					if (oldData) {
						handleNewReceiving();

						return {
							data: {
								receivings: oldData.data.receivings.filter((item) => item.id !== variables.body.id),
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
