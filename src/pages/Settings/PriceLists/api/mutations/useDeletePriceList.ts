import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { PriceListType } from "@/@types/priceLists";

export const useDeletePriceList = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<PriceListType>, AxiosError<ApiError>, { priceListId: string }>({
		mutationFn: async ({ priceListId }) => {
			const { data } = await axiosInstance.delete<ApiResult<PriceListType>>(
				`api/organisation/price-list/${priceListId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-priceLists"],
			});
			toast.success("Price List was successfully deleted");
		},
	});
};
