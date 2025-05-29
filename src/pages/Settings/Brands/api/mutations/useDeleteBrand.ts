import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { BrandType } from "@/@types/brands";
import { ApiError, ApiResult } from "@/@types/api";

export const useDeleteBrand = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<BrandType>, AxiosError<ApiError>, { brandId: string; organisationId: string }>(
		{
			mutationFn: async ({ brandId, organisationId }) => {
				const { data } = await axiosInstance.delete<ApiResult<BrandType>>(
					`api/organisation/brand/${brandId}/${organisationId}`,
				);

				return data;
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: ["get-all-brands"],
				});
				toast.success("Brand was successfully deleted");
			},
		},
	);
};
