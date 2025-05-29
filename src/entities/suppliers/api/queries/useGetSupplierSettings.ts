import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetSupplierSettingsResponseType } from "@/@types/suppliers";

export const useGetSupplierSettings = ({ organisationId }: { organisationId?: string }) => {
	return useQuery<ApiResult<GetSupplierSettingsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-supplier-settings", organisationId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetSupplierSettingsResponseType>>(
				`/api/suppliers/info/${organisationId}`,
			);
			return data;
		},
		enabled: !!organisationId,
	});
};
