import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import {
	GetConfigurationSettingsResponseType,
	UpdateConfigurationSettingsRequestBody,
} from "@/@types/configurationSettings";

export const useUpdateConfigurationSettings = ({ organisationId }: { organisationId?: string }) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetConfigurationSettingsResponseType>,
		AxiosError<ApiError>,
		{
			body: UpdateConfigurationSettingsRequestBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<GetConfigurationSettingsResponseType>>(
				`/api/organisation/xero-settings/${organisationId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["user-info"],
			});
			toast.success("Xero Configuration settings were successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
