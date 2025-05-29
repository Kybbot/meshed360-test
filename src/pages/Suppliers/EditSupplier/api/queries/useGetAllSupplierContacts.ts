import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllContactsResponseType } from "@/@types/suppliers";

export const useGetAllSupplierContacts = ({
	supplierId,
	pageNumber,
	pageSize,
}: {
	supplierId?: string;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<GetAllContactsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-all-supplier-contacts", supplierId, { pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllContactsResponseType>>(
				`/api/suppliers/contacts/${supplierId}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!supplierId,
	});
};
