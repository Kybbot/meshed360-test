import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreatePaymentTermBody, PaymentTermType } from "@/@types/paymentTerms";

export const useUpdatePaymentTerm = (isForCheckbox = false) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<PaymentTermType>,
		AxiosError<ApiError>,
		{
			paymentTermId: string;
			body: Omit<CreatePaymentTermBody, "organisationId">;
		}
	>({
		mutationFn: async ({ paymentTermId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<PaymentTermType>>(
				`/api/organisation/payment-term/${paymentTermId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-paymentTerms"],
			});
			toast.success("Payment Term was successfully updated");
		},
		onError(error) {
			if (isForCheckbox) showError(error);
		},
	});
};
