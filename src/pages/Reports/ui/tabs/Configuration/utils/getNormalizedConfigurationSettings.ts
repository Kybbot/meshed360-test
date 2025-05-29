import {
	autoPickByKey,
	xeroInvoiceStatusByKey,
	ConfigurationSettingsFormValues,
	GetConfigurationSettingsResponseType,
	UpdateConfigurationSettingsRequestBody,
} from "@/@types/configurationSettings";

export const normalizeConfigurationSettings = (
	data: ConfigurationSettingsFormValues,
): UpdateConfigurationSettingsRequestBody => ({
	xeroInvoiceStatus: data.xeroInvoiceStatus.id,
	importPurchaseOrderFromXero: data.importPurchaseOrderFromXero,
	exportPurchaseOrderToXero: data.exportPurchaseOrderToXero,
	enableTrackingCategories: data.enableTrackingCategories,
	categories: data.categories.map(({ id, isActive }) => ({ id, isActive })),
	loadItemsFromXero: data.loadItemsFromXero,
	loadInvoicesFromXero: data.loadInvoicesFromXero,
	autoPick: data.autoPick.id,
	defaultLocationId: data.defaultLocation?.id ?? null,
	loadBillsFromXero: data.loadBillsFromXero,
	autoReceiveStockFromXero: data.autoReceiveStockFromXero,
});

export const denormalizeConfigurationSettings = (
	data: GetConfigurationSettingsResponseType,
): ConfigurationSettingsFormValues => ({
	xeroInvoiceStatus:
		xeroInvoiceStatusByKey[data.xeroInvoiceStatus] ?? xeroInvoiceStatusByKey["AWAITING_PAYMENT"],
	importPurchaseOrderFromXero: data.importPurchaseOrderFromXero,
	exportPurchaseOrderToXero: data.exportPurchaseOrderToXero,
	enableTrackingCategories: data.enableTrackingCategories,
	categories: data.trackingCategories,
	loadItemsFromXero: data.loadItemsFromXero,
	loadInvoicesFromXero: data.loadInvoicesFromXero,
	defaultLocation: data.defaultLocation,
	autoPick: autoPickByKey[data.autoPick] ?? autoPickByKey["NO_PICKING"],
	loadBillsFromXero: data.loadBillsFromXero,
	autoReceiveStockFromXero: data.autoReceiveStockFromXero,
});
