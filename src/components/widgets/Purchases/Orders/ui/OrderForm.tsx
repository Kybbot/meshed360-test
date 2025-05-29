import { FC, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { ChangesDialog } from "./ChangesDialog";

import { getNormalizedOrderData } from "../utils/getNormalizedOrderData";

import { Loader } from "@/components/shared/Loader";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { CheckboxRhf } from "@/components/shared/form/CheckboxRhf";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

import { orgStore } from "@/app/stores/orgStore";

import {
	useCreatePurchaseOrder,
	useUpdatePurchaseOrder,
	useGetPurchaseOrderSettings,
} from "@/entities/purchaseOrders";
import { useGetSuppliers } from "@/entities/suppliers";

import { showError } from "@/utils/showError";
import { getDateFromDayPickerDate } from "@/utils/date";

import { SelectOption, SelectOptionOnlyWithName } from "@/@types/selects";
import { GetPurchaseOrderByIdResponseType, PurchaseOrderFormValues } from "@/@types/purchaseOrder/order";

type OrderFormProps =
	| { isEdit?: false; orderData?: never }
	| { isEdit: true; orderData: GetPurchaseOrderByIdResponseType };

export const OrderForm: FC<OrderFormProps> = ({ isEdit = false, orderData }) => {
	const navigate = useNavigate();
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);

	const formRef = useRef<HTMLFormElement>(null);

	const [supplier, setSupplier] = useState<SelectOption>();
	const [changeSettingsData, setChangeSettingsData] = useState(false);

	const [changesDiaglog, setChangesDiaglog] = useState(false);
	const [changesDiaglogType, setChangesDiaglogType] = useState<
		"Stok/Bill" | "BlindBill" | "TaxInclusive" | "OnlyAdditionalCost" | null
	>(null);

	const disableField = !supplier;
	const disableSupplierField = orderData && orderData?.status !== "DRAFT";
	const disableCheckbox = (orderData && orderData.status !== "DRAFT") || !supplier;

	const {
		data: suppliersData,
		error: suppliersError,
		isError: isSuppliersError,
		isSuccess: isSuppliersSuccess,
		isLoading: isSuppliersLoading,
	} = useGetSuppliers({ organisationId: orgId, searchValue: "" });

	const {
		data: settingsData,
		error: settingsError,
		isError: isSettingsError,
		isLoading: isSettingsLoading,
		isSuccess: isSettingsSuccess,
	} = useGetPurchaseOrderSettings({ supplierId: supplier?.id });

	const {
		mutate: createOrder,
		data: createOrderData,
		isSuccess: isCreateOrderSuccess,
	} = useCreatePurchaseOrder();
	const { mutate: updateOrder } = useUpdatePurchaseOrder();

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<PurchaseOrderFormValues>({
		defaultValues: {
			supplier: undefined,
			contact: undefined,
			phone: "",
			vendorAddress: undefined,
			vendorAddressLine2: "",
			reference: "",
			stockFirst: true,
			billFirst: false,
			blindBill: false,
			additionalExpense: false,
			paymentTerm: undefined,
			expectedDeliveryDate: new Date(),
			inventoryAccount: undefined,
			taxInclusive: false,
			taxRule: undefined,
			shippingDate: new Date(),
			warehouse: undefined,
			shipToDifferentCompany: false,
			shippingAddress: undefined,
			shippingAddressText: "",
			shippingAddressLine2: "",
			comments: "",
		},
	});

	const vendorAddress = watch("vendorAddress");
	const shippingAddress = watch("shippingAddress");
	const additionalExpense = watch("additionalExpense");
	const shippingAddressText = watch("shippingAddressText");
	const shipToDifferentCompany = watch("shipToDifferentCompany");

	const handleContact = (value?: SelectOptionOnlyWithName) => {
		if (isSettingsSuccess && settingsData.data && value) {
			const contactData = settingsData.data.contacts?.find((contact) => contact.name === value.name);

			if (contactData) {
				setValue("phone", contactData.phone);
			}
		}
	};

	const handleCancleChanges = () => {
		const formValue = getValues();
		if (changesDiaglogType === "Stok/Bill") {
			setValue("billFirst", !formValue.billFirst);
			setValue("stockFirst", !formValue.stockFirst);
		}

		if (changesDiaglogType === "BlindBill") {
			setValue("blindBill", !formValue.blindBill);
		}

		if (changesDiaglogType === "TaxInclusive") {
			setValue("taxInclusive", !formValue.taxInclusive);
		}

		if (changesDiaglogType === "OnlyAdditionalCost") {
			if (orderData) {
				setValue("billFirst", orderData.billFirst);
				setValue("blindBill", orderData.blindBill);
				setValue("stockFirst", orderData.stockFirst);
			}
			setValue("additionalExpense", !formValue.additionalExpense);
		}
	};

	const handleSubmitChanges = () => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	};

	const onSubmit = async (formData: PurchaseOrderFormValues) => {
		const data = getNormalizedOrderData(formData);

		if (isEdit) {
			if (orgId && orderId) {
				updateOrder(
					{ body: { id: orderId, ...data } },
					{
						onSuccess() {
							if (changesDiaglog) {
								setChangesDiaglog(false);
								setChangesDiaglogType(null);
							}
						},
					},
				);
			}
		} else {
			if (orgId) {
				createOrder({ body: { organisationId: orgId, ...data } });
			}
		}
	};

	useEffect(() => {
		if (isEdit && orderData) {
			setSupplier(orderData.supplier);

			reset(
				{
					supplier: orderData.supplier,
					contact: { name: orderData.contactDetails?.name },
					phone: orderData.contactDetails?.phone,
					vendorAddress: { name: orderData.vendorAddressLine?.addressLine1 },
					vendorAddressLine2: orderData.vendorAddressLine?.addressLine2,
					reference: orderData.reference,
					stockFirst: orderData.stockFirst,
					billFirst: orderData.billFirst,
					blindBill: orderData.blindBill,
					additionalExpense: orderData.additionalExpense,
					paymentTerm: orderData.paymentTerm,
					expectedDeliveryDate: getDateFromDayPickerDate(orderData.expectedDeliveryDate),
					inventoryAccount: orderData.inventoryAccount,
					taxInclusive: orderData.taxInclusive,
					taxRule: orderData.taxRule,

					shippingDate: getDateFromDayPickerDate(orderData.shippingDate),
					warehouse: orderData.warehouse,
					shipToDifferentCompany: orderData.shipToDifferentCompany,
					shippingAddress: !orderData.shipToDifferentCompany
						? { name: orderData.shippingAddress?.addressLine1 }
						: undefined,
					shippingAddressText: orderData.shipToDifferentCompany
						? orderData.shippingAddress?.addressLine1
						: "",
					shippingAddressLine2: orderData.shippingAddress?.addressLine2,
					comments: orderData.comments,
				},
				{ keepDefaultValues: true },
			);
		}
	}, [isEdit, orderData, reset]);

	useEffect(() => {
		if (isSettingsSuccess && settingsData && !isEdit) {
			reset(
				{
					supplier: supplier,
					contact: settingsData.data.defaultContact,
					phone: settingsData.data.defaultContact?.phone ?? "",
					vendorAddress: settingsData.data.defaultVendorAddress
						? { name: settingsData.data.defaultVendorAddress.addressLine1 }
						: undefined,
					vendorAddressLine2: settingsData.data.defaultVendorAddress?.addressLine2 ?? "",
					shippingAddress: settingsData.data.defaultShippingAddress
						? { name: settingsData.data.defaultShippingAddress.addressLine1 }
						: undefined,
					shippingAddressLine2: settingsData.data.defaultShippingAddress?.addressLine2 ?? "",
					inventoryAccount: settingsData.data.defaultInventoryAccount,
					paymentTerm: settingsData.data.defaultPaymentTerm,
					taxRule: settingsData.data.defaultTaxRule,

					reference: "",
					stockFirst: true,
					billFirst: false,
					blindBill: false,
					additionalExpense: false,
					expectedDeliveryDate: new Date(),
					taxInclusive: false,
					shippingDate: new Date(),
					warehouse: undefined,
					shipToDifferentCompany: false,
					shippingAddressText: "",
					comments: "",
				},
				{ keepDefaultValues: true },
			);
		}
	}, [supplier, isSettingsSuccess, settingsData, isEdit, reset]);

	useEffect(() => {
		if (isEdit && changeSettingsData && isSettingsSuccess && settingsData) {
			reset(
				{
					supplier: supplier,
					contact: settingsData.data.defaultContact,
					phone: settingsData.data.defaultContact?.phone ?? "",
					vendorAddress: settingsData.data.defaultVendorAddress
						? { name: settingsData.data.defaultVendorAddress.addressLine1 }
						: undefined,
					vendorAddressLine2: settingsData.data.defaultVendorAddress?.addressLine2 ?? "",
					shippingAddress: settingsData.data.defaultShippingAddress
						? { name: settingsData.data.defaultShippingAddress.addressLine1 }
						: undefined,
					shippingAddressLine2: settingsData.data.defaultShippingAddress?.addressLine2 ?? "",
					paymentTerm: settingsData.data.defaultPaymentTerm,
					taxRule: settingsData.data.defaultTaxRule,

					reference: "",
					stockFirst: true,
					billFirst: false,
					blindBill: false,
					additionalExpense: false,
					expectedDeliveryDate: new Date(),
					inventoryAccount: undefined,
					taxInclusive: false,
					shippingDate: new Date(),
					warehouse: undefined,
					shipToDifferentCompany: false,
					shippingAddressText: "",
					comments: "",
				},
				{ keepDefaultValues: true },
			);
		}
	}, [isEdit, supplier, changeSettingsData, isSettingsSuccess, settingsData, reset]);

	useEffect(() => {
		if (isCreateOrderSuccess && createOrderData.data) {
			navigate(`/purchases/orders/edit/${createOrderData.data.id}`);
		}
	}, [isCreateOrderSuccess, createOrderData, navigate]);

	useEffect(() => {
		if (isSettingsError && settingsError) {
			showError(settingsError);
		}
	}, [isSettingsError, settingsError]);

	return (
		<>
			{isSuppliersLoading ? (
				<Loader isFullWidth />
			) : isSuppliersError && suppliersError ? (
				<ErrorMessage error={suppliersError} />
			) : isSuppliersSuccess && suppliersData.data ? (
				<>
					{changesDiaglog && !!changesDiaglogType && (
						<ChangesDialog
							type={changesDiaglogType}
							dialogState={changesDiaglog}
							setDialogState={setChangesDiaglog}
							handleSubmitChanges={handleSubmitChanges}
							handleCancleChanges={handleCancleChanges}
						/>
					)}
					<form
						ref={formRef}
						id="newPurchaseOrderForm"
						className="newCustomer__form"
						onSubmit={handleSubmit(onSubmit)}
					>
						<fieldset className="form__fieldset">
							<legend className="form__legend">Supplier Details</legend>
							<Controller
								name="supplier"
								control={control}
								rules={{
									required: "Required",
									onChange(event) {
										const target = event.target.value as SelectOption;
										if (target) setSupplier(target);
										if (isEdit) setChangeSettingsData(true);
									},
								}}
								render={({ field }) => (
									<CustomSelect
										useSearch
										{...field}
										id="supplierId"
										value={field.value}
										placeholder="Supplier*"
										onValueChange={field.onChange}
										disabled={disableSupplierField}
										error={errors.supplier?.message}
										customValues={suppliersData.data.suppliers}
									/>
								)}
							/>
							<Controller
								name="contact"
								control={control}
								render={({ field }) => (
									<CustomSelect
										useSearch
										{...field}
										useNameAsId
										id="contactId"
										value={field.value}
										placeholder="Contact"
										onValueChange={(e) => {
											field.onChange(e);
											handleContact(e);
										}}
										error={errors.contact?.message}
										isLoading={isSettingsLoading}
										customValues={settingsData?.data.contacts}
										disabled={isSettingsLoading || isSettingsError || disableField}
									/>
								)}
							/>
							<InputRhf<PurchaseOrderFormValues>
								type="text"
								name="phone"
								id="phoneId"
								label="Phone"
								register={register}
								disabled={disableField}
								error={errors.phone?.message}
							/>
							<Controller
								name="vendorAddress"
								control={control}
								render={({ field }) => {
									return (
										<CustomSelect
											useSearch
											{...field}
											useNameAsId
											value={field.value}
											id="vendorAddressId"
											onValueChange={(selected) => {
												field.onChange(selected);

												const selectedItem = settingsData?.data.vendorAddresses.find(
													(item) => item.name === selected?.name,
												);

												setValue(
													"vendorAddressLine2",
													(selectedItem as { addressLine2?: string })?.addressLine2 || "",
												);
											}}
											isLoading={isSettingsLoading}
											placeholder="Vendor Address Line 1"
											error={errors.vendorAddress?.message}
											customValues={settingsData?.data.vendorAddresses}
											disabled={isSettingsLoading || isSettingsError || disableField}
										/>
									);
								}}
							/>
							<InputRhf<PurchaseOrderFormValues>
								type="text"
								register={register}
								name="vendorAddressLine2"
								id="vendorAddressLine2Id"
								label="Vendor Address Line 2"
								disabled={!vendorAddress || disableField}
								error={errors.vendorAddressLine2?.message}
							/>
							<InputRhf<PurchaseOrderFormValues>
								type="text"
								name="reference"
								id="referenceId"
								label="Reference"
								register={register}
								disabled={disableField}
								error={errors.reference?.message}
							/>
						</fieldset>
						<fieldset className="form__fieldset">
							<legend className="form__legend">Accounting Details</legend>
							<div className="form__checkboxes">
								<CheckboxRhf<PurchaseOrderFormValues>
									register={register}
									name="stockFirst"
									id="stockFirstId"
									label="Stock First"
									error={errors.stockFirst?.message}
									disabled={disableCheckbox || additionalExpense}
									rules={{
										onChange(event) {
											if (event.target.checked) {
												setValue("billFirst", false);
											} else {
												setValue("billFirst", true);
											}
											if (isEdit) {
												setChangesDiaglog(true);
												setChangesDiaglogType("Stok/Bill");
											}
										},
									}}
								/>
								<CheckboxRhf<PurchaseOrderFormValues>
									register={register}
									name="billFirst"
									id="billFirstId"
									label="Bill First"
									error={errors.billFirst?.message}
									disabled={disableCheckbox || additionalExpense}
									rules={{
										onChange(event) {
											if (event.target.checked) {
												setValue("stockFirst", false);
											} else {
												setValue("stockFirst", true);
											}
											if (isEdit) {
												setChangesDiaglog(true);
												setChangesDiaglogType("Stok/Bill");
											}
										},
									}}
								/>
								<CheckboxRhf<PurchaseOrderFormValues>
									register={register}
									name="blindBill"
									id="blindBillId"
									label="Blind Bill"
									error={errors.blindBill?.message}
									disabled={disableCheckbox || additionalExpense}
									rules={{
										onChange() {
											if (isEdit) {
												setChangesDiaglog(true);
												setChangesDiaglogType("BlindBill");
											}
										},
									}}
								/>
							</div>
							<Controller
								name="paymentTerm"
								control={control}
								rules={{
									required: "Required",
								}}
								render={({ field }) => {
									return (
										<CustomSelect
											useSearch
											{...field}
											id="paymentTermId"
											value={field.value}
											placeholder="Terms*"
											onValueChange={field.onChange}
											isLoading={isSettingsLoading}
											error={errors.paymentTerm?.message}
											customValues={settingsData?.data.paymentTerms}
											disabled={isSettingsLoading || isSettingsError || disableField}
										/>
									);
								}}
							/>
							<Controller
								name="expectedDeliveryDate"
								control={control}
								rules={{
									required: "Required",
								}}
								render={({ field }) => {
									return (
										<FormDayPickerRhf
											{...field}
											value={field.value}
											disabled={disableField}
											onValueChange={field.onChange}
											placeholder="Expected Deliver Date*"
											error={errors.expectedDeliveryDate?.message}
										/>
									);
								}}
							/>
							<Controller
								name="inventoryAccount"
								control={control}
								rules={{
									required: "Required",
								}}
								render={({ field }) => {
									return (
										<CustomSelect
											useSearch
											{...field}
											value={field.value}
											id="inventoryAccountId"
											placeholder="Inventory Account*"
											isLoading={isSettingsLoading}
											onValueChange={field.onChange}
											error={errors.inventoryAccount?.message}
											customValues={settingsData?.data.inventoryAccounts}
											disabled={isSettingsLoading || isSettingsError || disableField}
										/>
									);
								}}
							/>
							<CheckboxRhf<PurchaseOrderFormValues>
								register={register}
								name="taxInclusive"
								id="taxInclusiveId"
								label="Tax Inclusive"
								disabled={disableCheckbox}
								error={errors.taxInclusive?.message}
								rules={{
									onChange() {
										if (isEdit) {
											setChangesDiaglog(true);
											setChangesDiaglogType("TaxInclusive");
										}
									},
								}}
							/>
							<Controller
								name="taxRule"
								control={control}
								rules={{
									required: "Required",
								}}
								render={({ field }) => {
									return (
										<CustomSelect
											useSearch
											{...field}
											id="taxRuleId"
											value={field.value}
											placeholder="Tax Rule*"
											isLoading={isSettingsLoading}
											onValueChange={field.onChange}
											error={errors.taxRule?.message}
											customValues={settingsData?.data.taxRules}
											disabled={isSettingsLoading || isSettingsError || disableField}
										/>
									);
								}}
							/>
							<CheckboxRhf<PurchaseOrderFormValues>
								register={register}
								name="additionalExpense"
								id="additionalExpenseId"
								disabled={disableCheckbox}
								label="Only Additional Cost"
								error={errors.additionalExpense?.message}
								rules={{
									onChange(event) {
										if (event.target.checked) {
											setValue("stockFirst", false);
											setValue("billFirst", false);
											setValue("blindBill", false);
										} else {
											setValue("stockFirst", true);
										}

										if (isEdit) {
											setChangesDiaglog(true);
											setChangesDiaglogType("OnlyAdditionalCost");
										}
									},
								}}
							/>
						</fieldset>
						<fieldset className="form__fieldset">
							<legend className="form__legend">Shipping Details</legend>
							<Controller
								name="shippingDate"
								control={control}
								rules={{
									required: "Required",
								}}
								render={({ field }) => {
									return (
										<FormDayPickerRhf
											{...field}
											placeholder="Date*"
											value={field.value}
											disabled={disableField}
											onValueChange={field.onChange}
											error={errors.shippingDate?.message}
										/>
									);
								}}
							/>
							<Controller
								name="warehouse"
								control={control}
								rules={{
									required: "Required",
								}}
								render={({ field }) => {
									return (
										<CustomSelect
											{...field}
											useSearch
											id="warehouseId"
											value={field.value}
											placeholder="Select Warehouse Location*"
											onValueChange={field.onChange}
											isLoading={isSettingsLoading}
											error={errors.warehouse?.message}
											customValues={settingsData?.data.warehouses}
											disabled={isSettingsLoading || isSettingsError || disableField}
										/>
									);
								}}
							/>
							<CheckboxRhf<PurchaseOrderFormValues>
								register={register}
								disabled={disableField}
								name="shipToDifferentCompany"
								id="shipToDifferentCompanyId"
								label="Ship to Different Company"
								rules={{
									onChange() {
										setValue("shippingAddress", undefined);
									},
								}}
								error={errors.shipToDifferentCompany?.message}
							/>
							{shipToDifferentCompany ? (
								<InputRhf<PurchaseOrderFormValues>
									type="text"
									register={register}
									disabled={disableField}
									name="shippingAddressText"
									id="shippingAddressTextId"
									label="Shipping Address Line 1"
									error={errors.shippingAddressText?.message}
								/>
							) : (
								<Controller
									name="shippingAddress"
									control={control}
									render={({ field }) => {
										return (
											<CustomSelect
												useSearch
												{...field}
												useNameAsId
												value={field.value}
												id="shippingAddressId"
												onValueChange={(selected) => {
													field.onChange(selected);

													const selectedItem = settingsData?.data.shippingAddresses.find(
														(item) => item.name === selected?.name,
													);

													setValue(
														"shippingAddressLine2",
														(selectedItem as { addressLine2?: string })?.addressLine2 || "",
													);
												}}
												placeholder="Shipping Address Line 1"
												isLoading={isSettingsLoading}
												error={errors.shippingAddress?.message}
												customValues={settingsData?.data.shippingAddresses}
												disabled={isSettingsLoading || isSettingsError || disableField}
											/>
										);
									}}
								/>
							)}
							<InputRhf<PurchaseOrderFormValues>
								type="text"
								register={register}
								name="shippingAddressLine2"
								id="shippingAddressLine2Id"
								label="Shipping Address Line 2"
								error={errors.shippingAddressLine2?.message}
								disabled={(shipToDifferentCompany ? !shippingAddressText : !shippingAddress) || disableField}
							/>
						</fieldset>
						<div className="newCustomer__comments">
							<TextareaRhf<PurchaseOrderFormValues>
								name="comments"
								id="commentsId"
								label="Comments"
								register={register}
								disabled={disableField}
								error={errors.comments?.message}
							/>
						</div>
					</form>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</>
	);
};
