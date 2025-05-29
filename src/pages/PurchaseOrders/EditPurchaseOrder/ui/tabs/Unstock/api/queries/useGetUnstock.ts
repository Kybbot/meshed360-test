import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetUnstokResponseType } from "@/@types/purchaseOrder/unstock";

export const useGetUnstock = ({ purchaseOrderId }: { purchaseOrderId?: string }) => {
	return useQuery<ApiResult<GetUnstokResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-purchase-order-unstock", purchaseOrderId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetUnstokResponseType>>(
				`/api/purchase-orders/unstock/${purchaseOrderId}`,
			);

			return data;
		},
		enabled: !!purchaseOrderId,
	});
};
