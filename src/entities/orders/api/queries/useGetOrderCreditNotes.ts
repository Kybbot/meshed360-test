import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetCreditNotesByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useGetOrderCreditNotes = ({
	organisationId,
	orderId,
}: {
	organisationId?: string;
	orderId?: string;
}) => {
	return useQuery<ApiResult<GetCreditNotesByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-credit-notes-by-id", organisationId, orderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetCreditNotesByIdResponseType>>(
				`/api/sales-orders/${organisationId}/orders/${orderId}/credit-notes`,
			);
			return data;
		},
		enabled: !!organisationId && !!orderId,
	});
};
