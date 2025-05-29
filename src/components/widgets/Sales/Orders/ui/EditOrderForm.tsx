import { FC, useEffect, useState } from "react";
import { useStore } from "zustand";
import { useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { Loader } from "@/components/shared/Loader";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { CheckboxRhf } from "@/components/shared/form/CheckboxRhf";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

import { orgStore } from "@/app/stores/orgStore";
import { orderStore } from "@/app/stores/orderStore";

import { useGetCustomers } from "@/entities/customers";
import { useGetOrderSettings, useUpdateOrder } from "@/entities/orders";

import { showError } from "@/utils/showError";
import { getDateFromDayPickerDate } from "@/utils/date";

import { SelectOption, SelectOptionOnlyWithName } from "@/@types/selects";
import { EditOrderFormValues, templates, templateDictionary } from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";
import { getNormalizedUpdateOrderData } from "@/components/widgets/Sales/utils/getNormalizedUpdateOrderData.ts";

type OrderFormProps = { orderData: ExtendedSalesOrder };

export const EditOrderForm: FC<OrderFormProps> = ({ orderData }) => {
	const { orderId } = useParams();
	const { orgId } = useStore(orgStore);
	const { setTaxInclusive, setSkipQuote } = useStore(orderStore);

	const [customer, setCustomer] = useState<SelectOption>();
	const [changeSettingsData, setChangeSettingsData] = useState(false);

	const {
		data: customersData,
		error: customersError,
		isError: isCustomersError,
		isSuccess: isCustomersSuccess,
		isLoading: isCustomersLoading,
	} = useGetCustomers({ organisationId: orgId, searchValue: "" });

	const {
		data: orderSettingsData,
		error: orderSettingsError,
		isError: isOrderSettingsError,
		isLoading: isOrderSettingsLoading,
		isSuccess: isOrderSettingsSuccess,
	} = useGetOrderSettings({ organisationId: orgId, customerId: customer?.id });

	const { mutate: updateOrder } = useUpdateOrder();

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<EditOrderFormValues>({
		defaultValues: {
			customer: undefined,
			contact: undefined,
			phone: "",
			email: "",
			billingAddress: undefined,
			billingAddressLine2: "",
			priceList: undefined,
			reference: "",
			template: { id: "DEFAULT", name: "Default" },
			paymentTerm: undefined,
			salesRep: undefined,
			account: undefined,
			taxRate: undefined,
			taxInclusive: false,
			skipQuote: false,
			warehouse: undefined,
			date: new Date(),
			dueDate: undefined,
			shipToDifferentCompany: false,
			shippingAddress: undefined,
			shippingAddressText: "",
			shippingAddressLine2: "",
			shippingNotes: "",
			deliveryMethod: "",
			comments: "",
		},
		disabled: orderData.status !== "DRAFT" && orderData.status !== "ORDERING",
	});

	const billingAddress = watch("billingAddress");
	const shippingAddress = watch("shippingAddress");
	const shippingAddressText = watch("shippingAddressText");
	const shipToDifferentCompany = watch("shipToDifferentCompany");

	const handleContact = (value?: SelectOptionOnlyWithName) => {
		if (isOrderSettingsSuccess && orderSettingsData.data && value) {
			const contactData = orderSettingsData.data.contacts?.find((contact) => contact.name === value.name);

			if (contactData) {
				setValue("email", contactData.email);
				setValue("phone", contactData.phone);
			}
		}
	};

	const onSubmit = async (formData: EditOrderFormValues) => {
		const data = getNormalizedUpdateOrderData(formData);

		if (orgId && orderId) {
			updateOrder({ orderId: orderId, organisationId: orgId, body: { ...data } });
		}
	};

	useEffect(() => {
		if (orderData) {
			setCustomer(orderData.customer);

			setTaxInclusive(orderData.taxInclusive);
			setSkipQuote(orderData.skipQuote);

			reset({
				...getValues(),
				customer: orderData.customer,
				phone: orderData.contactDetails?.phone || "",
				email: orderData.contactDetails?.email || "",
				billingAddress: { name: orderData.billingAddress?.addressLine1 || undefined },
				billingAddressLine2: orderData.billingAddress?.addressLine2 || undefined,
				priceList: orderData.priceList,
				reference: orderData.reference || undefined,
				paymentTerm: orderData.paymentTerm,
				template: { id: orderData.template, name: templateDictionary[orderData.template] },
				salesRep: orderData.salesRep || undefined,
				account: orderData.account,
				taxRate: orderData.taxRate,
				taxInclusive: orderData.taxInclusive,
				skipQuote: orderData.skipQuote,
				warehouse: orderData.warehouse,
				date: getDateFromDayPickerDate(orderData.shippingDate),
				dueDate: orderData.shippingDueDate ? getDateFromDayPickerDate(orderData.shippingDueDate) : undefined,
				shipToDifferentCompany: orderData.shipToDifferentCompany,
				shippingAddress: !orderData.shipToDifferentCompany
					? { name: orderData.shippingAddress?.addressLine1 || undefined }
					: undefined,
				shippingAddressText: orderData.shipToDifferentCompany
					? orderData.shippingAddress?.addressLine1 || ""
					: "",
				shippingAddressLine2: orderData.shippingAddress?.addressLine2 || "",
				shippingNotes: orderData.shippingNotes || "",
				deliveryMethod: orderData.deliveryMethod || "",
				comments: orderData.comment || "",
			});
		}
	}, [orderData, reset, setTaxInclusive, setSkipQuote, getValues]);

	useEffect(() => {
		if (changeSettingsData && isOrderSettingsSuccess && orderSettingsData) {
			const defaultContact = orderSettingsData.data.contacts?.find((contact) => contact.isDefault);

			reset({
				...getValues(),
				customer: customer,
				contact: defaultContact,
				billingAddress: orderSettingsData.data.defaultBillingAddress
					? { name: orderSettingsData.data.defaultBillingAddress.addressLine1 }
					: undefined,
				billingAddressLine2: orderSettingsData.data.defaultBillingAddress?.addressLine2 ?? "",
				shippingAddress: orderSettingsData.data.defaultShippingAddress
					? { name: orderSettingsData.data.defaultShippingAddress.addressLine1 }
					: undefined,
				shippingAddressLine2: orderSettingsData.data.defaultShippingAddress?.addressLine2 ?? "",
				priceList: orderSettingsData.data.defaultPriceList,
				paymentTerm: orderSettingsData.data.defaultPaymentTerm,
				salesRep: orderSettingsData.data.defaultSalesRep,
				account: orderSettingsData.data.defaultAccount,
				taxRate: orderSettingsData.data.defaultTaxRate,
			});
		}
	}, [customer, changeSettingsData, isOrderSettingsSuccess, orderSettingsData, reset, getValues]);

	useEffect(() => {
		if (customer && orderSettingsData) {
			const сontact = orderSettingsData.data.contacts?.find(
				(contact) => contact.name === orderData.contactDetails?.name,
			);
			const values = getValues();

			reset({
				...values,
				priceList: orderSettingsData.data.priceList.find(({ id }) => id === values.priceList.id),
				contact: сontact,
			});
		}
	}, [customer, getValues, orderData.contactDetails?.name, orderSettingsData, reset]);

	useEffect(() => {
		if (isOrderSettingsError && orderSettingsError) {
			showError(orderSettingsError);
		}
	}, [isOrderSettingsError, orderSettingsError]);

	return (
		<>
			{isCustomersLoading ? (
				<Loader isFullWidth />
			) : isCustomersError && customersError ? (
				<ErrorMessage error={customersError} />
			) : isCustomersSuccess && customersData.data ? (
				<form className="newCustomer__form" id="newOrderForm" onSubmit={handleSubmit(onSubmit)}>
					<fieldset className="form__fieldset">
						<legend className="form__legend">Customer Details</legend>
						<Controller
							name="customer"
							control={control}
							rules={{
								required: "Required",
								onChange(event) {
									const target = event.target.value as SelectOption;
									if (target) setCustomer(target);
									setChangeSettingsData(true);
								},
							}}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="customerId"
									value={field.value}
									placeholder="Customer*"
									onValueChange={field.onChange}
									error={errors.customer?.message}
									customValues={customersData.data.customers}
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
									isLoading={isOrderSettingsLoading}
									customValues={orderSettingsData?.data.contacts}
									disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
								/>
							)}
						/>
						<InputRhf<EditOrderFormValues>
							type="text"
							name="phone"
							id="phoneId"
							label="Phone"
							register={register}
							error={errors.phone?.message}
						/>
						<InputRhf<EditOrderFormValues>
							type="email"
							name="email"
							id="emailId"
							label="Email"
							register={register}
							autoComplete="email"
							error={errors.email?.message}
						/>
						<Controller
							name="billingAddress"
							control={control}
							render={({ field }) => {
								return (
									<CustomSelect
										useSearch
										{...field}
										useNameAsId
										value={field.value}
										id="billingAddressId"
										onValueChange={(selected) => {
											field.onChange(selected);
											const selectedItem = orderSettingsData?.data.billingAddresses.find(
												(addr) => addr.addressLine1 === selected?.name,
											);
											setValue("billingAddressLine2", selectedItem?.addressLine2 || "");
										}}
										isLoading={isOrderSettingsLoading}
										placeholder="Billing Address Line 1"
										error={errors.billingAddress?.message}
										customValues={
											orderSettingsData?.data.billingAddresses.map((addr) => ({
												name: addr.addressLine1 ?? "",
											})) ?? []
										}
										disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
									/>
								);
							}}
						/>
						<InputRhf<EditOrderFormValues>
							type="text"
							register={register}
							name="billingAddressLine2"
							id="billingAddressLine2Id"
							label="Billing Address Line 2"
							disabled={!billingAddress}
							error={errors.billingAddressLine2?.message}
						/>
						<Controller
							name="priceList"
							control={control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => {
								return (
									<CustomSelect
										useSearch
										{...field}
										id="priceListId"
										value={field.value}
										placeholder="Price List*"
										onValueChange={field.onChange}
										error={errors.priceList?.message}
										isLoading={isOrderSettingsLoading}
										customValues={orderSettingsData?.data.priceList}
										disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
									/>
								);
							}}
						/>
						<InputRhf<EditOrderFormValues>
							type="text"
							name="reference"
							id="referenceId"
							label="Reference"
							register={register}
							error={errors.reference?.message}
						/>
						<Controller
							name="template"
							control={control}
							render={({ field }) => {
								return (
									<CustomSelect
										{...field}
										id="templateId"
										disabled
										value={field.value}
										placeholder="Template"
										customValues={templates}
										onValueChange={field.onChange}
										error={errors.template?.message}
									/>
								);
							}}
						/>
					</fieldset>
					<fieldset className="form__fieldset">
						<legend className="form__legend">Accounting Details</legend>
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
										isLoading={isOrderSettingsLoading}
										error={errors.paymentTerm?.message}
										customValues={orderSettingsData?.data.paymentTerms}
										disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
									/>
								);
							}}
						/>
						<Controller
							name="salesRep"
							control={control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => {
								return (
									<CustomSelect
										useSearch
										{...field}
										id="salesRepId"
										value={field.value}
										placeholder="Sales Rep*"
										onValueChange={field.onChange}
										error={errors.salesRep?.message}
										isLoading={isOrderSettingsLoading}
										customValues={orderSettingsData?.data.salesReps}
										disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
									/>
								);
							}}
						/>
						<Controller
							name="account"
							control={control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => {
								return (
									<CustomSelect
										useSearch
										{...field}
										id="accountId"
										value={field.value}
										placeholder="Account*"
										onValueChange={field.onChange}
										error={errors.account?.message}
										isLoading={isOrderSettingsLoading}
										customValues={orderSettingsData?.data.accounts}
										disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
									/>
								);
							}}
						/>
						<Controller
							name="taxRate"
							control={control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => {
								return (
									<CustomSelect
										useSearch
										{...field}
										id="taxRateId"
										placeholder="Tax*"
										value={field.value}
										onValueChange={field.onChange}
										error={errors.taxRate?.message}
										isLoading={isOrderSettingsLoading}
										customValues={orderSettingsData?.data.taxRates}
										disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
									/>
								);
							}}
						/>
						<CheckboxRhf<EditOrderFormValues>
							register={register}
							name="taxInclusive"
							id="taxInclusiveId"
							label="Tax Inclusive"
							error={errors.taxInclusive?.message}
							rules={{
								onChange(event) {
									setTaxInclusive(event.target.checked);
								},
							}}
						/>
						<CheckboxRhf<EditOrderFormValues>
							name="skipQuote"
							id="skipQuoteId"
							label="Skip Quote"
							register={register}
							error={errors.skipQuote?.message}
							rules={{
								onChange(event) {
									setSkipQuote(event.target.checked);
								},
							}}
						/>
					</fieldset>
					<fieldset className="form__fieldset">
						<legend className="form__legend">Shipping Details</legend>
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
										placeholder="Location*"
										onValueChange={field.onChange}
										isLoading={isOrderSettingsLoading}
										error={errors.warehouse?.message}
										customValues={orderSettingsData?.data.warehouses}
										disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
									/>
								);
							}}
						/>
						<Controller
							name="date"
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
										error={errors.date?.message}
										onValueChange={field.onChange}
									/>
								);
							}}
						/>
						<Controller
							name="dueDate"
							control={control}
							render={({ field }) => {
								return (
									<FormDayPickerRhf
										{...field}
										value={field.value}
										placeholder="Ship By"
										onValueChange={field.onChange}
										error={errors.dueDate?.message}
									/>
								);
							}}
						/>
						<CheckboxRhf<EditOrderFormValues>
							register={register}
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
							<InputRhf<EditOrderFormValues>
								type="text"
								register={register}
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
												const selectedItem = orderSettingsData?.data.shippingAddresses.find(
													(addr) => addr.addressLine1 === selected?.name,
												);
												setValue("shippingAddressLine2", selectedItem?.addressLine2 || "");
											}}
											placeholder="Shipping Address Line 1"
											isLoading={isOrderSettingsLoading}
											error={errors.shippingAddress?.message}
											customValues={
												orderSettingsData?.data.shippingAddresses.map((addr) => ({
													name: addr.addressLine1 ?? "",
												})) ?? []
											}
											disabled={isOrderSettingsLoading || isOrderSettingsError || field.disabled}
										/>
									);
								}}
							/>
						)}
						<InputRhf<EditOrderFormValues>
							type="text"
							register={register}
							name="shippingAddressLine2"
							id="shippingAddressLine2Id"
							label="Shipping Address Line 2"
							error={errors.shippingAddressLine2?.message}
							disabled={shipToDifferentCompany ? !shippingAddressText : !shippingAddress}
						/>
						<TextareaRhf<EditOrderFormValues>
							register={register}
							name="shippingNotes"
							id="shippingNotesId"
							label="Shipping Notes"
							error={errors.shippingNotes?.message}
						/>
						<InputRhf<EditOrderFormValues>
							type="text"
							register={register}
							name="deliveryMethod"
							id="deliveryMethodId"
							label="Delivery Method"
							error={errors.deliveryMethod?.message}
						/>
					</fieldset>
					<div className="newCustomer__comments">
						<TextareaRhf<EditOrderFormValues>
							name="comments"
							id="commentsId"
							label="Comments"
							register={register}
							error={errors.comments?.message}
						/>
					</div>
				</form>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</>
	);
};
