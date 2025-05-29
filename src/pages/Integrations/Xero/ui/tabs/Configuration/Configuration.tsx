import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { Controller, useForm } from "react-hook-form";

import Info from "./Info";

import { useGetConfigurationSettings } from "./api/queries/useGetConfigurationSettings";
import { useUpdateConfigurationSettings } from "./api/mutations/useUpdateConfigurationSettings";

import {
	normalizeConfigurationSettings,
	denormalizeConfigurationSettings,
} from "./utils/getNormalizedConfigurationSettings";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { SwitchRhf } from "@/components/shared/form/SwitchRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { CustomSelect } from "@/components/shared/CustomSelect";

import { CommonPageMain, CommonPageWrapper } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import {
	autoPickByKey,
	autoPickOptions,
	xeroInvoiceStatusOptions,
	ConfigurationSettingsFormValues,
} from "@/@types/configurationSettings";

type Props = {
	connectionStatus: boolean;
};

export const Configuration: FC<Props> = ({ connectionStatus }) => {
	const { orgId } = useStore(orgStore);

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<ConfigurationSettingsFormValues>({
		defaultValues: {
			xeroInvoiceStatus: undefined,
			importPurchaseOrderFromXero: false,
			exportPurchaseOrderToXero: false,
			enableTrackingCategories: false,
			categories: [],
			loadItemsFromXero: false,
			loadInvoicesFromXero: false,
			defaultLocation: undefined,
			autoPick: undefined,
			loadBillsFromXero: false,
			autoReceiveStockFromXero: false,
		},
	});

	const categories = watch("categories");
	const loadBillsFromXero = watch("loadBillsFromXero");
	const defaultLocation = watch("defaultLocation");
	const loadInvoicesFromXero = watch("loadInvoicesFromXero");
	const enableTrackingCategories = watch("enableTrackingCategories");

	const { data, error, isLoading, isError, isSuccess } = useGetConfigurationSettings({
		organisationId: orgId,
	});

	const { mutate: updateConfigurationSettings, isPending } = useUpdateConfigurationSettings({
		organisationId: orgId,
	});

	const onSubmit = (formData: ConfigurationSettingsFormValues) => {
		const data = normalizeConfigurationSettings(formData);
		updateConfigurationSettings({ body: data });
	};

	useEffect(() => {
		if (isSuccess && data.data) {
			reset(denormalizeConfigurationSettings(data.data), { keepDefaultValues: true });
		}
	}, [isSuccess, data, reset]);

	return (
		<CommonPageWrapper>
			<CommonPageMain>
				{isLoading ? (
					<Loader isFullWidth />
				) : isError ? (
					<ErrorMessage error={error} />
				) : (
					<div className={`xeroConfig__cards ${!connectionStatus ? "xeroConfig__cards--empty" : ""}`}>
						<Info />
						{!connectionStatus ? (
							<img
								width={613}
								height={298}
								alt="Decoration"
								aria-hidden="true"
								src="/imgs/xeroConfig.png"
								className="xeroConfig__img"
								srcSet="/imgs/xeroConfig@2x.png"
							/>
						) : (
							<form id="configurationForm" onSubmit={handleSubmit(onSubmit)} className="xeroConfig__card">
								<div className="xeroConfig__header">
									<h2 className="xeroConfig__title">Integration Settings</h2>
								</div>
								{isSuccess && data.data ? (
									<>
										<div className="xeroConfig__select">
											<h3 className="xeroConfig__subTitle">Xero Invoice Status</h3>
											<div className="xeroConfig__selector">
												<Controller
													rules={{
														required: "Required",
													}}
													name="xeroInvoiceStatus"
													control={control}
													render={({ field }) => (
														<CustomSelect
															isSmall
															{...field}
															value={field.value}
															placeholder="Select"
															id="xeroInvoiceStatus"
															allowUnselect={false}
															onValueChange={field.onChange}
															customValues={xeroInvoiceStatusOptions}
														/>
													)}
												/>
											</div>
										</div>
										<div className="xeroConfig__switch">
											<h3 className="xeroConfig__subTitle">Import Purchase Order from Xero</h3>
											<SwitchRhf<ConfigurationSettingsFormValues>
												hideLabel
												register={register}
												name="importPurchaseOrderFromXero"
												id="importPurchaseOrderFromXeroId"
												label="Import Purchase Order from Xero"
												error={errors.importPurchaseOrderFromXero?.message}
											/>
										</div>
										<div className="xeroConfig__switch">
											<h3 className="xeroConfig__subTitle">Export Purchase Order to Xero</h3>
											<SwitchRhf<ConfigurationSettingsFormValues>
												hideLabel
												register={register}
												name="exportPurchaseOrderToXero"
												id="exportPurchaseOrderToXeroId"
												label="Export Purchase Order to Xero"
												error={errors.exportPurchaseOrderToXero?.message}
											/>
										</div>
										<div className="xeroConfig__switch">
											<h3 className="xeroConfig__subTitle">Enable Tracking Categories</h3>
											<SwitchRhf<ConfigurationSettingsFormValues>
												hideLabel
												register={register}
												name="enableTrackingCategories"
												id="enableTrackingCategoriesId"
												label="Enable Tracking Categories"
												error={errors.enableTrackingCategories?.message}
												rules={{
													onChange: ({ target }) => {
														const checked = target.checked;
														if (!checked) {
															const updated = data.data.trackingCategories.map((category) => ({
																...category,
																isActive: false,
															}));
															setValue("categories", updated);
														}
													},
												}}
											/>
										</div>
										{enableTrackingCategories &&
											categories.length > 0 &&
											categories.map((category, index) => (
												<div key={category.id} className="xeroConfig__switch xeroConfig__switch--options">
													<h3 className="xeroConfig__subTitle xeroConfig__subTitle--options">
														{category.name}
													</h3>
													<SwitchRhf<ConfigurationSettingsFormValues>
														hideLabel
														register={register}
														label={category.name}
														name={`categories.${index}.isActive`}
														id={`category-${category.id}`}
														error={errors.categories?.[index]?.isActive?.message}
													/>
												</div>
											))}

										<div className="xeroConfig__switch">
											<h3 className="xeroConfig__subTitle">Load Items from Xero</h3>
											<SwitchRhf<ConfigurationSettingsFormValues>
												hideLabel
												register={register}
												name="loadItemsFromXero"
												id="loadItemsFromXeroId"
												label="Load Items from Xero"
												error={errors.loadItemsFromXero?.message}
											/>
										</div>
										<div className="xeroConfig__switch">
											<h3 className="xeroConfig__subTitle">Load Invoices from Xero</h3>
											<SwitchRhf<ConfigurationSettingsFormValues>
												hideLabel
												register={register}
												name="loadInvoicesFromXero"
												id="loadInvoicesFromXeroId"
												label="Load Invoices from Xero"
												error={errors.loadInvoicesFromXero?.message}
												rules={{
													onChange: ({ target }) => {
														const checked = target.checked;

														if (!checked) {
															setValue("defaultLocation", undefined);
															setValue("autoPick", autoPickByKey["NO_PICKING"]);
														}
													},
												}}
											/>
										</div>
										<p className="xeroConfig__text">
											<span className="xeroConfig__text xeroConfig__text--bold">IMPORTANT: </span> If you plan
											to enable invoice imports from Xero, please remember to update the invoice prefix/suffix
											settings in Meshed360 to avoid any Invoice number conflicts.
										</p>
										{loadInvoicesFromXero && (
											<>
												<div className="xeroConfig__select">
													<h3 className="xeroConfig__subTitle">
														Default location to be used for invoices loaded from Xero
													</h3>
													<div className="xeroConfig__selector">
														<Controller
															name="defaultLocation"
															control={control}
															rules={{
																required: loadInvoicesFromXero ? "Required" : false,
															}}
															render={({ field }) => (
																<CustomSelect
																	isSmall
																	useSearch
																	{...field}
																	placeholder="Select"
																	id="defaultLocationId"
																	value={defaultLocation}
																	onValueChange={field.onChange}
																	error={errors.defaultLocation?.message}
																	customValues={data.data.defaultLocations}
																/>
															)}
														/>
													</div>
												</div>
												<div className="xeroConfig__select">
													<h3 className="xeroConfig__subTitle">
														Fulfillment mode when loading sales invoices from Xero
													</h3>
													<div className="xeroConfig__selector">
														<Controller
															name="autoPick"
															control={control}
															render={({ field }) => (
																<CustomSelect
																	isSmall
																	{...field}
																	id="autoPickId"
																	placeholder="Select"
																	allowUnselect={false}
																	value={field.value}
																	onValueChange={field.onChange}
																	customValues={autoPickOptions}
																/>
															)}
														/>
													</div>
												</div>
											</>
										)}
										<div className="xeroConfig__switch">
											<h3 className="xeroConfig__subTitle">Load Bills from Xero</h3>
											<SwitchRhf<ConfigurationSettingsFormValues>
												hideLabel
												register={register}
												name="loadBillsFromXero"
												id="loadBillsFromXeroId"
												label="Load Bills from Xero"
												error={errors.loadBillsFromXero?.message}
												rules={{
													onChange: ({ target }) => {
														const checked = target.checked;

														if (!checked) {
															setValue("autoReceiveStockFromXero", false);
														}
													},
												}}
											/>
										</div>
										{loadBillsFromXero && (
											<div className="xeroConfig__switch xeroConfig__switch--options">
												<h3 className="xeroConfig__subTitle xeroConfig__subTitle--options">
													Auto-receive stock when loading bills from Xero
												</h3>
												<SwitchRhf<ConfigurationSettingsFormValues>
													hideLabel
													register={register}
													id="autoReceiveStockFromXero"
													name="autoReceiveStockFromXero"
													label="Auto-Receive Stock from Xero"
													error={errors.autoReceiveStockFromXero?.message}
												/>
											</div>
										)}
										<div className="xeroConfig__formBtn">
											<Button
												type="submit"
												form="configurationForm"
												isLoading={isPending}
												disabled={isPending}
											>
												<svg width="18" height="18" focusable="false" aria-hidden="true">
													<use xlinkHref="/icons/icons.svg#save" />
												</svg>
												Save
											</Button>
										</div>
									</>
								) : (
									<p className="empty_list">No data available</p>
								)}
							</form>
						)}
					</div>
				)}
			</CommonPageMain>
		</CommonPageWrapper>
	);
};
