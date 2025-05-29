import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";
import { downloadCsvTemplate } from "@/utils/download";

import { ApiResult } from "@/@types/api";

type RouteType =
	| "CustomerTemplate"
	| "CustomerContactTemplate"
	| "CustomerAddressTemplate"
	| "ProductTemplate"
	| "SupplierTemplate"
	| "SupplierContactTemplate"
	| "SupplierAddressTemplate"
	| "PriceListTemplate";

const Endpoints = {
	CustomerTemplate: "/api/csv/download/customer-template",
	CustomerContactTemplate: "/api/csv/download/contact-template",
	CustomerAddressTemplate: "/api/csv/download/address-template",
	ProductTemplate: "/api/csv/download/products-template",
	SupplierTemplate: "/api/csv/download/supplier-template",
	SupplierContactTemplate: "/api/csv/download/supplier-contact-template",
	SupplierAddressTemplate: "/api/csv/download/supplier-address-template",
	PriceListTemplate: "/api/csv/download/pricelist-template",
};

const FileNames = {
	CustomerTemplate: "Customer_template",
	CustomerContactTemplate: "Customer_Contact_template",
	CustomerAddressTemplate: "Customer_Address_template",
	ProductTemplate: "Product_template",
	SupplierTemplate: "Supplier_template",
	SupplierContactTemplate: "Supplier_Contact_template",
	SupplierAddressTemplate: "Supplier_Address_template",
	PriceListTemplate: "PriceList_template",
};

export const useGetCsvTemplate = (routeType: RouteType, orgId?: string) => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const getCsvTemplate = useCallback(async () => {
		setLoading(true);
		setSuccess(false);

		try {
			const { data } = await axiosInstance.get<ApiResult<string>>(
				`${Endpoints[routeType]}${orgId ? `/${orgId}` : ""}`,
			);

			if (data.data) {
				setSuccess(true);
				downloadCsvTemplate(data.data, FileNames[routeType]);
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
	}, [routeType, orgId]);

	return { isLoadingCsvTemplate: loading, isCsvTemplateSuccess: success, getCsvTemplate };
};
