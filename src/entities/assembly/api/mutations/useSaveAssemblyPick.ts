import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	AssemblyPickType,
	CreateAssemblyPickType,
	GetAssemblyPickResponseType,
	SaveAssemblyPickResponseType,
} from "@/@types/assembly/pick";
import { ApiError, ApiResult } from "@/@types/api";
import { GetAssemblyByIdResponseType } from "@/@types/assembly/assembly";

export const useSaveAssemblyPick = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<SaveAssemblyPickResponseType>,
		AxiosError<ApiError>,
		{
			body: CreateAssemblyPickType;
			newData: AssemblyPickType[];
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<SaveAssemblyPickResponseType>>(
				`/api/assemblies/pick`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData, variables) => {
			toast.success("Assembly Pick was successfully saved");

			queryClient.setQueryData<ApiResult<GetAssemblyPickResponseType>>(
				["get-assembly-pick", variables.body.orderId],
				(oldData) => {
					if (oldData) {
						return {
							data: {
								...oldData.data,
								status: newData.data.status,
								pickStatus: newData.data.pickStatus,
								lines: variables.newData,
							},
							status: oldData.status,
						};
					}
					return oldData;
				},
			);

			queryClient.setQueriesData<ApiResult<GetAssemblyByIdResponseType>>(
				{ queryKey: ["get-assembly-by-id", variables.body.orderId] },
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
