import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axios";
import { ApiError, ApiResult } from "@/@types/api";

import { ProductAvailabilityResponseType } from "@/@types/stockControl";

interface Props {
	organisationId?: string;
	productId: string;
	warehouseId: string;
	batchNumber?: string;
	isDisabled?: boolean;
}

export const useGetProductAvailability = ({
	organisationId,
	productId,
	warehouseId,
	batchNumber,
	isDisabled = false,
}: Props) => {
	return useQuery<ApiResult<ProductAvailabilityResponseType[]>, AxiosError<ApiError>>({
		queryKey: ["product-availability", organisationId, productId, warehouseId, batchNumber],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<ProductAvailabilityResponseType[]>>(
				`/api/organisation/product-availability/${organisationId}`,
				{
					params: {
						productId,
						warehouseId,
						batchNumber,
					},
				},
			);
			return data;
		},
		enabled: !!organisationId && !!productId && !!warehouseId && !isDisabled,
	});
};
