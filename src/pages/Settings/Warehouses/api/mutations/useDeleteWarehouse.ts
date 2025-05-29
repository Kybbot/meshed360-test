import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { WarehousType } from "@/@types/warehouses";
import { ApiError, ApiResult } from "@/@types/api";

export const useDeleteWarehouse = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<WarehousType>, AxiosError<ApiError>, { warehousesId: string }>({
		mutationFn: async ({ warehousesId }) => {
			const { data } = await axiosInstance.delete<ApiResult<WarehousType>>(`api/warehouses/${warehousesId}`);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-warehouses"],
			});
			toast.success("Warehouse was successfully deleted");
		},
	});
};
