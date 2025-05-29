import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	CreditNoteFormValues,
	CreateCreditNoteType,
	GetAddCreditNoteResponseType,
} from "@/@types/purchaseOrder/creditNote";
import { ApiError, ApiResult } from "@/@types/api";

export const useAddCreditNote = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetAddCreditNoteResponseType>,
		AxiosError<ApiError>,
		{
			body: CreateCreditNoteType;
			formData: CreditNoteFormValues;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<GetAddCreditNoteResponseType>>(
				`/api/purchase-orders/credit-notes`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Credit Note was successfully added");

			queryClient.invalidateQueries({
				queryKey: ["get-purchase-order-credit-note", variables.body.orderId],
			});
		},
		onError(error) {
			showError(error);
		},
	});
};
