import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { BrandType, CreateBrandBody } from "@/@types/brands";

export const useCreateBrand = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<BrandType>,
		AxiosError<ApiError>,
		{
			body: CreateBrandBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<BrandType>>(
				`/api/organisation/brand`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-brands"],
			});
			toast.success("New Brand was successfully added");
		},
	});
};
