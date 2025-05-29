import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreatePriceListBody, PriceListType } from "@/@types/priceLists";

export const useCreatePriceList = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<PriceListType>,
		AxiosError<ApiError>,
		{
			body: CreatePriceListBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<PriceListType>>(
				`/api/organisation/price-list`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-priceLists"],
			});
			toast.success("New Price List was successfully added");
		},
	});
};
