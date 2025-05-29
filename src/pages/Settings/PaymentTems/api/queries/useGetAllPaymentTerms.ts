import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllPaymentTermsResponseType } from "@/@types/paymentTerms";

export const useGetAllPaymentTerms = ({
	organisationId,
	searchValue,
	pageNumber,
	pageSize,
}: {
	organisationId?: string;
	searchValue: string;
	pageNumber: string;
	pageSize: string;
}) => {
	return useQuery<ApiResult<GetAllPaymentTermsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-all-paymentTerms", organisationId, { searchValue, pageSize, pageNumber }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllPaymentTermsResponseType>>(
				`/api/organisation/payment-term/${organisationId}?search=${searchValue}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
			);

			return data;
		},
		enabled: !!organisationId,
		placeholderData: keepPreviousData,
	});
};
