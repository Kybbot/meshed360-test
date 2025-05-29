import { Dispatch, SetStateAction } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { BillFormValues, CreateBillType, GetAddBillResponseType } from "@/@types/purchaseOrders";

export const useAddBill = (setCurrentBillId: Dispatch<SetStateAction<string>>) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetAddBillResponseType>,
		AxiosError<ApiError>,
		{
			body: CreateBillType;
			formData: BillFormValues;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetAddBillResponseType>>(
				`/api/purchase-orders/bills`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Bill was successfully added");

			queryClient.invalidateQueries({ queryKey: ["get-purchase-order-bills", variables.body.orderId] });
			queryClient.invalidateQueries({ queryKey: ["get-purchase-order-by-id", variables.body.orderId] });

			setCurrentBillId(newData.data.id);
		},
		onError(error) {
			showError(error);
		},
	});
};
