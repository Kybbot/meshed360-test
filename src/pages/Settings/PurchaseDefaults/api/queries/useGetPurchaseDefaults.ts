import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetPurchaseDefaults } from "@/@types/purchaseDefaults";

export const useGetPurchaseDefaults = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetPurchaseDefaults>, AxiosError<ApiError>>({
		queryKey: ["get-purchase-defaults", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetPurchaseDefaults>>(
				`/api/organisation/purchase-defaults/${organisationId}`,
			);
			return data;
		},
		enabled: !!organisationId,
	});
};
