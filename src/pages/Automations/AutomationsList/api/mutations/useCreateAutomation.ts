import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { AutomationType, CreateAutomationBody } from "@/@types/automations";

export const useCreateAutomation = () => {
	return useMutation<
		ApiResult<AutomationType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			body: CreateAutomationBody;
		}
	>({
		mutationKey: ["create-automation"],
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstance.post<ApiResult<AutomationType>>(
				`/api/automations/${organisationId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("New Automation was successfully added");
		},
		onError(error) {
			showError(error);
		},
	});
};
