import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseOrderSettingsResponseType } from "@/@types/purchaseOrder/order";

export const useGetPurchaseOrderSettings = ({ supplierId }: { supplierId?: string }) => {
	return useQuery<ApiResult<GetPurchaseOrderSettingsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-purchase-order-settings", supplierId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetPurchaseOrderSettingsResponseType>>(
				`/api/purchase-orders/details?supplierId=${supplierId}`,
			);
			return data;
		},
		enabled: !!supplierId,
	});
};
