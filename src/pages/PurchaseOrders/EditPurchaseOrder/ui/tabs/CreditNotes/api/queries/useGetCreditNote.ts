import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetCreditNoteResponseType } from "@/@types/purchaseOrder/creditNote";

export const useGetCreditNote = ({ purchaseOrderId }: { purchaseOrderId?: string }) => {
	return useQuery<ApiResult<GetCreditNoteResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-purchase-order-credit-note", purchaseOrderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetCreditNoteResponseType>>(
				`/api/purchase-orders/credit-notes/${purchaseOrderId}`,
			);

			return data;
		},
		enabled: !!purchaseOrderId,
	});
};
