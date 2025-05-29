import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreatePaymentTermBody, PaymentTermType } from "@/@types/paymentTerms";

export const useCreatePaymentTerm = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<PaymentTermType>,
		AxiosError<ApiError>,
		{
			body: CreatePaymentTermBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<PaymentTermType>>(
				`/api/organisation/payment-term`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-paymentTerms"],
			});
			toast.success("New Payment Term was successfully added");
		},
	});
};
