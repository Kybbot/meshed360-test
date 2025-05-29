import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllUnitsOfMeasureResponseType } from "@/@types/unitsOfMeasure";

export const useGetUnitsOfMeasure = ({
	organisationId,
	searchValue,
}: {
	organisationId?: string;
	searchValue: string;
}) => {
	return useQuery<ApiResult<GetAllUnitsOfMeasureResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-select-units-of-measure", organisationId, searchValue],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllUnitsOfMeasureResponseType>>(
				`/api/organisation/unit-of-measure/${organisationId}?search=${searchValue}`,
			);

			return data;
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!organisationId,
	});
};
