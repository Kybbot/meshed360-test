import { Dispatch, SetStateAction } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { ReceivingType, CreateReceivingsType } from "@/@types/purchaseOrder/receiving";

export const useAddReceivings = (setCurrentReceivingId: Dispatch<SetStateAction<string>>) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<ReceivingType>,
		AxiosError<ApiError>,
		{
			body: CreateReceivingsType;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<ReceivingType>>(
				`/api/purchase-orders/receivings`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Receivings were successfully added");

			queryClient.invalidateQueries({ queryKey: ["get-purchase-order-receivings", variables.body.orderId] });
			queryClient.invalidateQueries({ queryKey: ["get-purchase-order-by-id", variables.body.orderId] });

			setCurrentReceivingId(newData.data.id);
		},
		onError(error) {
			showError(error);
		},
	});
};
