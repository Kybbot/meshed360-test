import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { UpdateDefaultAccountMappingBody } from "@/@types/defaultAccountMapping";

export const useUpdateDefaultAccountMapping = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<never>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			body: UpdateDefaultAccountMappingBody;
		}
	>({
		mutationKey: ["update-default-account-mapping"],
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<never>>(
				`/api/organisation/default-account-mappings/${organisationId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-organisation-default-account-mappings"],
			});
			toast.success("Account was successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
