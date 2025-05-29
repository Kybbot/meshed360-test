import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { PaymentTermType } from "@/@types/paymentTerms";

export const useDeletePaymentTerm = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<PaymentTermType>, AxiosError<ApiError>, { paymentTermId: string }>({
		mutationFn: async ({ paymentTermId }) => {
			const { data } = await axiosInstance.delete<ApiResult<PaymentTermType>>(
				`api/organisation/payment-term/${paymentTermId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-paymentTerms"],
			});
			toast.success("Payment Term was successfully deleted");
		},
	});
};
