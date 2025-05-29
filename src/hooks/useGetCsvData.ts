import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";
import { downloadCsvTemplate, downloadXlsxTemplate } from "@/utils/download";

import { ApiResult } from "@/@types/api";

type RouteType =
	| "CustomersData"
	| "CustomerContactsData"
	| "CustomerAddressesData"
	| "ProductsData"
	| "SuppliersData"
	| "SupplierContactsData"
	| "SupplierAddressesData"
	| "Report";

const Endpoints = {
	CustomersData: "/api/csv/export/customers",
	CustomerContactsData: "/api/csv/export/customers-contacts",
	CustomerAddressesData: "/api/csv/export/customers-addresses",
	ProductsData: "/api/csv/export/products",
	SuppliersData: "/api/csv/export/suppliers",
	SupplierContactsData: "/api/csv/export/suppliers-contacts",
	SupplierAddressesData: "/api/csv/export/suppliers-addresses",
	Report: "",
};

const FileNames = {
	CustomersData: "Customers",
	CustomerContactsData: "Customer_Contacts",
	CustomerAddressesData: "Customer_Addresses",
	ProductsData: "Products",
	SuppliersData: "Suppliers",
	SupplierContactsData: "Supplier_Contacts",
	SupplierAddressesData: "Supplier_Addresses",
	Report: "Report",
};

export const useGetExportData = (
	routeType: RouteType,
	organisationId?: string,
	apiUrl?: string,
	format: "csv" | "xlsx" = "csv",
) => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const getExportData = useCallback(
		async (fileName?: string) => {
			if (!organisationId) return;

			setLoading(true);
			setSuccess(false);

			try {
				if (format === "csv") {
					const { data } = await axiosInstance.get<ApiResult<{ csv: string }>>(
						apiUrl ?? `${Endpoints[routeType]}/${organisationId}`,
					);

					if (data.data.csv) {
						setSuccess(true);
						downloadCsvTemplate(data.data.csv, fileName ?? FileNames[routeType]);
					}
				} else if (format === "xlsx") {
					const response = await axiosInstance.get(apiUrl ?? `${Endpoints[routeType]}/${organisationId}`, {
						responseType: "blob",
					});

					downloadXlsxTemplate(response.data, fileName ?? FileNames[routeType]);
					setSuccess(true);
				}
			} catch (error) {
				if (isAxiosError(error)) showError(error);
				else if (error instanceof Error) toast.error(error.message);
				else toast.error("Something went wrong");
			} finally {
				setLoading(false);
			}
		},
		[organisationId, apiUrl, routeType, format],
	);

	return { isLoadingExportData: loading, isExportDataSuccess: success, getExportData };
};
