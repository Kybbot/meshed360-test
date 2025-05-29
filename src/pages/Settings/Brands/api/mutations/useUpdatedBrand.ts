import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { BrandType, CreateBrandBody } from "@/@types/brands";

export const useUpdateBrand = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<BrandType>,
		AxiosError<ApiError>,
		{
			brandId: string;
			body: CreateBrandBody;
		}
	>({
		mutationFn: async ({ brandId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<BrandType>>(
				`/api/organisation/brand/${brandId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-brands"],
			});
			toast.success("Brand was successfully updated");
		},
	});
};
