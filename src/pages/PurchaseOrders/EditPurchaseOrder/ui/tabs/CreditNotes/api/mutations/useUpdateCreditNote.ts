import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAddCreditNoteResponseType, UpdateCreditNoteType } from "@/@types/purchaseOrder/creditNote";

export const useUpdateCreditNote = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetAddCreditNoteResponseType>,
		AxiosError<ApiError>,
		{
			orderId: string;
			body: UpdateCreditNoteType;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<GetAddCreditNoteResponseType>>(
				`/api/purchase-orders/credit-notes`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Credit Notes was successfully updated");

			queryClient.invalidateQueries({ queryKey: ["get-purchase-order-credit-note", variables.orderId] });
		},
		onError(error) {
			showError(error);
		},
	});
};
