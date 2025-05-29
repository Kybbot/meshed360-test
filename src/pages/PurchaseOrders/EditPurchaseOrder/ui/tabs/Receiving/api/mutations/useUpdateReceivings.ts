import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	ReceivingType,
	UpdateReceivingsType,
	GetAllReceivingResponseType,
} from "@/@types/purchaseOrder/receiving";
import { ApiError, ApiResult } from "@/@types/api";

export const useUpdateReceivings = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<ReceivingType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: UpdateReceivingsType;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<ReceivingType>>(
				`/api/purchase-orders/receivings`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Receivings were successfully updated");

			queryClient.setQueryData<ApiResult<GetAllReceivingResponseType>>(
				["get-purchase-order-receivings", variables.orderId],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								receivings: oldData.data.receivings.map((item) => {
									if (newData.data.id === item.id) {
										return {
											...item,
											lines: newData.data.lines,
											receivingDate: newData.data.receivingDate,
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

			await queryClient.invalidateQueries({ queryKey: ["get-purchase-order-by-id", variables.orderId] });
		},
		onError(error) {
			showError(error);
		},
	});
};
