import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetInvoicingByIdResponseType } from "@/@types/salesOrders/api.ts";

export const useGetOrderInvoicing = ({
	organisationId,
	orderId,
	disabled,
}: {
	organisationId?: string;
	orderId?: string;
	disabled?: boolean;
}) => {
	return useQuery<ApiResult<GetInvoicingByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-invoices-by-id", organisationId, orderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetInvoicingByIdResponseType>>(
				`/api/sales-orders/${organisationId}/orders/${orderId}/invoices`,
			);
			return data;
		},
		enabled: !!organisationId && !!orderId && !disabled,
	});
};
