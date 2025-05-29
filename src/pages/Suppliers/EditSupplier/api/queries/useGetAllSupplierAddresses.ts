import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { NormalizedAddressesData, GetAllAddressesResponseType } from "@/@types/suppliers";

export const useGetAllSupplierAddresses = ({
	supplierId,
	pageNumber,
	pageSize,
}: {
	supplierId?: string;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<NormalizedAddressesData>, AxiosError<ApiError>>({
		queryKey: ["get-all-supplier-addresses", supplierId, { pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllAddressesResponseType>>(
				`/api/suppliers/addresses/${supplierId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return {
				data: {
					totalCount: data.data.totalCount,
					totalPages: data.data.totalPages,
					addresses: data.data.addresses,
				},
				status: data.status,
			};
		},
		enabled: !!supplierId,
	});
};
