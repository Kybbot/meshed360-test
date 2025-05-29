import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { showError } from "@/utils/showError";

import { ApiError, ApiResult } from "@/@types/api";
import { GetProfileSettingsType, UpdateProfileSettingsRequestBody } from "@/@types/profileSettings";

export const useUpdateProfileSettings = ({ organisationId }: { organisationId?: string }) => {
	return useMutation<
		ApiResult<GetProfileSettingsType>,
		AxiosError<ApiError>,
		{ body: UpdateProfileSettingsRequestBody }
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<GetProfileSettingsType>>(
				`/api/organisation/profile/${organisationId}`,
				body,
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("Profile settings were successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
