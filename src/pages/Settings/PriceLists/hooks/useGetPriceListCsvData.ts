import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";
import { downloadCsvTemplate } from "@/utils/download";

import { ApiResult } from "@/@types/api";

export const useGetPriceListCsvData = (
	organisationId?: string,
	priceListId?: string,
	priceListName?: string,
) => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const getCsvData = useCallback(async () => {
		if (organisationId) {
			setLoading(true);
			setSuccess(false);

			try {
				const { data } = await axiosInstance.get<ApiResult<{ csv: string }>>(
					`/api/csv/export/pricelist/${organisationId}/${priceListId}`,
				);

				if (data.data.csv) {
					setSuccess(true);
					const name = priceListName?.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") || "PriceList";
					downloadCsvTemplate(data.data.csv, name);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					showError(error);
				} else if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Something went wrong");
				}
			} finally {
				setLoading(false);
			}
		}
	}, [organisationId, priceListId, priceListName]);

	return { isLoadingCsvData: loading, isCsvDataSuccess: success, getCsvData };
};
