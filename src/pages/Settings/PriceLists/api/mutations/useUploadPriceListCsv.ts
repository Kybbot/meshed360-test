import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { axiosInstanceForFiles } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";

export const useUploadPriceListCsv = () => {
	return useMutation<
		ApiResult<{ message: string }>,
		AxiosError<ApiError>,
		{
			organisationId?: string;
			body: FormData;
		}
	>({
		mutationFn: async ({ organisationId, body }) => {
			const { data } = await axiosInstanceForFiles.post<ApiResult<{ message: string }>>(
				`/api/csv/import/pricelist/${organisationId}`,
				body,
			);

			return data;
		},
		onSuccess: async () => {
			toast.success("Price List CSV was successfully uploaded");
		},
	});
};
