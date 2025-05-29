import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { UnitOfMeasureType } from "@/@types/unitsOfMeasure";

export const useDeleteUnitOfMeasure = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UnitOfMeasureType>,
		AxiosError<ApiError>,
		{ unitOfMeasureId: string; organisationId: string }
	>({
		mutationFn: async ({ unitOfMeasureId, organisationId }) => {
			const { data } = await axiosInstance.delete<ApiResult<UnitOfMeasureType>>(
				`api/organisation/unit-of-measure/${unitOfMeasureId}/${organisationId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-units-of-measure"],
			});
			toast.success("Unit of Measure was successfully deleted");
		},
	});
};
