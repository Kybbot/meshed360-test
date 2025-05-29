import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreatePriceListBody, PriceListType } from "@/@types/priceLists";

export const useUpdatePriceList = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<PriceListType>,
		AxiosError<ApiError>,
		{
			priceListId: string;
			body: CreatePriceListBody;
		}
	>({
		mutationFn: async ({ priceListId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<PriceListType>>(
				`/api/organisation/price-list/${priceListId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-priceLists"],
			});
			toast.success("Price List was successfully updated");
		},
	});
};
