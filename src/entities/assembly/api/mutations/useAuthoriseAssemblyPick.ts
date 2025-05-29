import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAssemblyPickResponseType, AuthoriseAssemblyPickStatusResponseType } from "@/@types/assembly/pick";
import { GetAssemblyByIdResponseType } from "@/@types/assembly/assembly";

export const useAuthoriseAssemblyPick = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<AuthoriseAssemblyPickStatusResponseType>,
		AxiosError<ApiError>,
		{
			body: { id: string };
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<AuthoriseAssemblyPickStatusResponseType>>(
				`/api/assemblies/pick/authorise`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Pick was successfully authorised");

			queryClient.setQueryData<ApiResult<GetAssemblyPickResponseType>>(
				["get-assembly-pick", variables.body.id],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
								pickStatus: newData.data.pickStatus,
							},
							status: oldData.status,
						};
					}
					return oldData;
				},
			);

			queryClient.setQueriesData<ApiResult<GetAssemblyByIdResponseType>>(
				{ queryKey: ["get-assembly-by-id", variables.body.id] },
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
							},
							status: oldData.status,
						};
					}
					return oldData;
				},
			);
		},
		onError(error) {
			showError(error);
		},
	});
};
