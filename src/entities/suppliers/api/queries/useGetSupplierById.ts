import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetSupplierByIdResponseType } from "@/@types/suppliers";

export const useGetSupplierById = ({
	organisationId,
	supplierId,
}: {
	organisationId?: string;
	supplierId?: string;
}) => {
	return useQuery<ApiResult<GetSupplierByIdResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-supplier-by-id", organisationId, supplierId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetSupplierByIdResponseType>>(
				`/api/suppliers/${supplierId}?organisationId=${organisationId}`,
			);
			return data;
		},
		enabled: !!organisationId && !!supplierId,
	});
};
