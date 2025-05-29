import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

export const useGetPurchaseOrderById = ({
	orderId,
	organisationId,
}: {
	orderId?: string;
	organisationId?: string;
}) => {
	return useQuery<ApiResult<GetPurchaseOrderByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-purchase-order-by-id", orderId, organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetPurchaseOrderByIdResponseType>>(
				`/api/purchase-orders/${orderId}?organisationId=${organisationId}`,
			);
			return data;
		},
		enabled: !!orderId && !!organisationId,
	});
};
