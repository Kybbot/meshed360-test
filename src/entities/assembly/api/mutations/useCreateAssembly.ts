import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateAssemblyBodyType, CreateAssemblyResponseType } from "@/@types/assembly/assembly";

export const useCreateAssembly = () => {
	return useMutation<
		ApiResult<CreateAssemblyResponseType>,
		AxiosError<ApiError>,
		{ body: CreateAssemblyBodyType }
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<CreateAssemblyResponseType>>(
				`/api/assemblies`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("New Assembly was successfully added");
		},
		onError(error) {
			showError(error);
		},
	});
};
