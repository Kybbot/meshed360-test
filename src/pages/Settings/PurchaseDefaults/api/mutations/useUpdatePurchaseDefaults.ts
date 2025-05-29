import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";
import { ApiError, ApiResult } from "@/@types/api";

import { UpdatePurchaseDefaults, GetPurchaseDefaults } from "@/@types/purchaseDefaults";
import { showError } from "@/utils/showError";

export const useUpdatePurchaseDefaults = ({ organisationId }: { organisationId?: string }) => {
	return useMutation<
		ApiResult<GetPurchaseDefaults>,
		AxiosError<ApiError>,
		{
			body: UpdatePurchaseDefaults;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<GetPurchaseDefaults>>(
				`/api/organisation/purchase-defaults/${organisationId}`,
				JSON.stringify(body),
			);
			return data;
		},
		onSuccess: () => {
			toast.success("Purchase Defaults were successfully updated");
		},
		onError(error) {
			showError(error);
		},
	});
};
