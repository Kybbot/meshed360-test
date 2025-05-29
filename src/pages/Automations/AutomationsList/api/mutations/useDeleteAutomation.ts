import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { AutomationType } from "@/@types/automations";

export const useDeleteAutomation = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<AutomationType>, AxiosError<ApiError>, { automationId: string }>({
		mutationFn: async ({ automationId }) => {
			const { data } = await axiosInstance.delete<ApiResult<AutomationType>>(
				`/api/automations/${automationId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-automations"],
			});
			toast.success("Automation was successfully deleted");
		},
	});
};
