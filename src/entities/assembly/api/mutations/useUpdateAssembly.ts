import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { UpdateAssemblyBodyType, CreateAssemblyResponseType } from "@/@types/assembly/assembly";

export const useUpdateAssembly = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<CreateAssemblyResponseType>,
		AxiosError<ApiError>,
		{ body: UpdateAssemblyBodyType }
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<CreateAssemblyResponseType>>(
				`/api/assemblies`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (_newData, variables) => {
			toast.success("Assembly was successfully updated");
			await queryClient.invalidateQueries({ queryKey: ["get-assembly-by-id", variables.body.id] });
		},
		onError(error) {
			showError(error);
		},
	});
};
