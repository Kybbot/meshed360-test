import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { AuthoriseBillStatusResponseType } from "@/@types/purchaseOrders";

export const useEmailBill = () => {
	return useMutation<
		ApiResult<AuthoriseBillStatusResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<AuthoriseBillStatusResponseType>>(
				`/api/purchase-orders/bills/email`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("Email was successfully sent");
		},
		onError(error) {
			showError(error);
		},
	});
};
