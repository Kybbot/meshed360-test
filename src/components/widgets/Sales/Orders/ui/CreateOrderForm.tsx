import { FC, useEffect, useState } from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router";
import { Controller, UseFormReturn } from "react-hook-form";

import { getNormalizedOrderData } from "../../utils/getNormalizedOrderData";

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
import { useCreateOrder, useGetOrderSettings } from "@/entities/orders";

import { showError } from "@/utils/showError";

import { SelectOption, SelectOptionOnlyWithName, TaxRateType } from "@/@types/selects";
import { OrderFormValues, templates } from "@/@types/salesOrders/local.ts";

interface Props {
	form: UseFormReturn<OrderFormValues>;
}

export const CreateOrderForm: FC<Props> = ({ form }) => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);
	const { setTaxInclusive, setSkipQuote } = useStore(orderStore);

	const [customer, setCustomer] = useState<SelectOption>();

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

	const { mutate: createOrder } = useCreateOrder((orderId) => navigate(`/sales/orders/edit/${orderId}`));

	const billingAddress = form.watch("billingAddress");
	const shippingAddress = form.watch("shippingAddress");
	const shippingAddressText = form.watch("shippingAddressText");
	const shipToDifferentCompany = form.watch("shipToDifferentCompany");

	const handleContact = (value?: SelectOptionOnlyWithName) => {
		if (isOrderSettingsSuccess && orderSettingsData.data && value) {
			const contactData = orderSettingsData.data.contacts?.find((contact) => contact.name === value.name);

			if (contactData) {
				form.setValue("email", contactData.email);
				form.setValue("phone", contactData.phone);
			}
		}
	};

	const handleTaxChange = (value?: TaxRateType) => {
		if (value) {
			const updatedDefaultQuoteLines = form.getValues("defaultQuoteLines").map((line) => ({
				...line,
				taxType: line.taxType || value,
			}));

			const updatedMeatQuoteLines = form.getValues("meatQuoteLines").map((line) => ({
				...line,
				taxType: line.taxType || value,
			}));

			const updatedWoolworthsQuoteLines = form.getValues("woolworthsQuoteLines").map((line) => ({
				...line,
				taxType: line.taxType || value,
			}));

			const updatedServiceLines = form.getValues("serviceLines").map((line) => ({
				...line,
				taxType: line.taxType || value,
			}));

			form.setValue("defaultQuoteLines", updatedDefaultQuoteLines);
			form.setValue("meatQuoteLines", updatedMeatQuoteLines);
			form.setValue("woolworthsQuoteLines", updatedWoolworthsQuoteLines);
			form.setValue("serviceLines", updatedServiceLines);
		}
	};

	const onSubmit = async (formData: OrderFormValues) => {
		const data = getNormalizedOrderData(formData);
		createOrder({ organisationId: orgId!, body: data });
	};

	useEffect(() => {
		if (isOrderSettingsSuccess && orderSettingsData) {
			const defaultContact = orderSettingsData.data.contacts?.find((contact) => contact.isDefault);

			const customerDiscount = orderSettingsData.data.customerDiscount ?? "";

			const updatedDefaultQuoteLines = form
				.getValues("defaultQuoteLines")
				.map((line) => (line.product?.id ? { ...line, discount: customerDiscount } : line));

			const updatedMeatQuoteLines = form
				.getValues("meatQuoteLines")
				.map((line) => (line.product?.id ? { ...line, discount: customerDiscount } : line));

			const updatedWoolworthsQuoteLines = form
				.getValues("woolworthsQuoteLines")
				.map((line) => (line.product?.id ? { ...line, discount: customerDiscount } : line));

			const updatedServiceLines = form
				.getValues("serviceLines")
				.map((line) => (line.product?.id ? { ...line, discount: customerDiscount } : line));

			form.reset({
				...form.getValues(),
				customer: customer,
				contact: defaultContact,
				email: orderSettingsData.data.email ?? "",
				phone: orderSettingsData.data.phone ?? "",
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
				defaultQuoteLines: updatedDefaultQuoteLines,
				meatQuoteLines: updatedMeatQuoteLines,
				woolworthsQuoteLines: updatedWoolworthsQuoteLines,
				serviceLines: updatedServiceLines,
			});
		}
	}, [customer, isOrderSettingsSuccess, orderSettingsData, form.reset]);

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
				<form className="newCustomer__form" id="newOrderForm" onSubmit={form.handleSubmit(onSubmit)}>
					<fieldset className="form__fieldset">
						<legend className="form__legend">Customer Details</legend>
						<Controller
							name="customer"
							control={form.control}
							rules={{
								required: "Required",
								onChange(event) {
									const target = event.target.value as SelectOption;
									if (target) setCustomer(target);
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
									error={form.formState.errors.customer?.message}
									customValues={customersData.data.customers}
								/>
							)}
						/>
						<Controller
							name="contact"
							control={form.control}
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
									error={form.formState.errors.contact?.message}
									isLoading={isOrderSettingsLoading}
									customValues={orderSettingsData?.data.contacts}
									disabled={isOrderSettingsLoading || isOrderSettingsError}
								/>
							)}
						/>
						<InputRhf<OrderFormValues>
							type="text"
							name="phone"
							id="phoneId"
							label="Phone"
							register={form.register}
							error={form.formState.errors.phone?.message}
						/>
						<InputRhf<OrderFormValues>
							type="email"
							name="email"
							id="emailId"
							label="Email"
							register={form.register}
							autoComplete="email"
							error={form.formState.errors.email?.message}
						/>
						<Controller
							name="billingAddress"
							control={form.control}
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
											form.setValue("billingAddressLine2", selectedItem?.addressLine2 || "");
										}}
										isLoading={isOrderSettingsLoading}
										placeholder="Billing Address Line 1"
										error={form.formState.errors.billingAddress?.message}
										customValues={
											orderSettingsData?.data.billingAddresses.map((addr) => ({
												name: addr.addressLine1 ?? "",
											})) ?? []
										}
										disabled={isOrderSettingsLoading || isOrderSettingsError}
									/>
								);
							}}
						/>
						<InputRhf<OrderFormValues>
							type="text"
							register={form.register}
							name="billingAddressLine2"
							id="billingAddressLine2Id"
							label="Billing Address Line 2"
							disabled={!billingAddress}
							error={form.formState.errors.billingAddressLine2?.message}
						/>
						<Controller
							name="priceList"
							control={form.control}
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
										error={form.formState.errors.priceList?.message}
										isLoading={isOrderSettingsLoading}
										customValues={orderSettingsData?.data.priceList}
										disabled={isOrderSettingsLoading || isOrderSettingsError}
									/>
								);
							}}
						/>
						<InputRhf<OrderFormValues>
							type="text"
							name="reference"
							id="referenceId"
							label="Reference"
							register={form.register}
							error={form.formState.errors.reference?.message}
						/>
						<Controller
							name="template"
							control={form.control}
							render={({ field }) => {
								return (
									<CustomSelect
										{...field}
										id="templateId"
										value={field.value}
										allowUnselect={false}
										placeholder="Template"
										customValues={templates}
										onValueChange={field.onChange}
										error={form.formState.errors.template?.message}
									/>
								);
							}}
						/>
					</fieldset>
					<fieldset className="form__fieldset">
						<legend className="form__legend">Accounting Details</legend>
						<Controller
							name="paymentTerm"
							control={form.control}
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
										error={form.formState.errors.paymentTerm?.message}
										customValues={orderSettingsData?.data.paymentTerms}
										disabled={isOrderSettingsLoading || isOrderSettingsError}
									/>
								);
							}}
						/>
						<Controller
							name="salesRep"
							control={form.control}
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
										error={form.formState.errors.salesRep?.message}
										isLoading={isOrderSettingsLoading}
										customValues={orderSettingsData?.data.salesReps}
										disabled={isOrderSettingsLoading || isOrderSettingsError}
									/>
								);
							}}
						/>
						<Controller
							name="account"
							control={form.control}
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
										error={form.formState.errors.account?.message}
										isLoading={isOrderSettingsLoading}
										customValues={orderSettingsData?.data.accounts}
										disabled={isOrderSettingsLoading || isOrderSettingsError}
									/>
								);
							}}
						/>
						<Controller
							name="taxRate"
							control={form.control}
							rules={{
								required: "Required",
								onChange(event) {
									const value = event.target.value as TaxRateType;
									handleTaxChange(value);
								},
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
										error={form.formState.errors.taxRate?.message}
										isLoading={isOrderSettingsLoading}
										customValues={orderSettingsData?.data.taxRates}
										disabled={isOrderSettingsLoading || isOrderSettingsError}
									/>
								);
							}}
						/>
						<CheckboxRhf<OrderFormValues>
							register={form.register}
							name="taxInclusive"
							id="taxInclusiveId"
							label="Tax Inclusive"
							error={form.formState.errors.taxInclusive?.message}
							rules={{
								onChange(event) {
									setTaxInclusive(event.target.checked);
								},
							}}
						/>
						<CheckboxRhf<OrderFormValues>
							name="skipQuote"
							id="skipQuoteId"
							label="Skip Quote"
							register={form.register}
							error={form.formState.errors.skipQuote?.message}
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
							control={form.control}
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
										error={form.formState.errors.warehouse?.message}
										customValues={orderSettingsData?.data.warehouses}
										disabled={isOrderSettingsLoading || isOrderSettingsError}
									/>
								);
							}}
						/>
						<Controller
							name="date"
							control={form.control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => {
								return (
									<FormDayPickerRhf
										{...field}
										placeholder="Date*"
										value={field.value}
										error={form.formState.errors.date?.message}
										onValueChange={field.onChange}
									/>
								);
							}}
						/>
						<Controller
							name="dueDate"
							control={form.control}
							render={({ field }) => {
								return (
									<FormDayPickerRhf
										{...field}
										value={field.value}
										placeholder="Ship By"
										onValueChange={field.onChange}
										error={form.formState.errors.dueDate?.message}
									/>
								);
							}}
						/>
						<CheckboxRhf<OrderFormValues>
							register={form.register}
							name="shipToDifferentCompany"
							id="shipToDifferentCompanyId"
							label="Ship to Different Company"
							rules={{
								onChange() {
									form.setValue("shippingAddress", undefined);
								},
							}}
							error={form.formState.errors.shipToDifferentCompany?.message}
						/>
						{shipToDifferentCompany ? (
							<InputRhf<OrderFormValues>
								type="text"
								register={form.register}
								name="shippingAddressText"
								id="shippingAddressTextId"
								label="Shipping Address Line 1"
								error={form.formState.errors.shippingAddressText?.message}
							/>
						) : (
							<Controller
								name="shippingAddress"
								control={form.control}
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
												form.setValue("shippingAddressLine2", selectedItem?.addressLine2 || "");
											}}
											placeholder="Shipping Address Line 1"
											isLoading={isOrderSettingsLoading}
											error={form.formState.errors.shippingAddress?.message}
											customValues={
												orderSettingsData?.data.shippingAddresses.map((addr) => ({
													name: addr.addressLine1 ?? "",
												})) ?? []
											}
											disabled={isOrderSettingsLoading || isOrderSettingsError}
										/>
									);
								}}
							/>
						)}
						<InputRhf<OrderFormValues>
							type="text"
							register={form.register}
							name="shippingAddressLine2"
							id="shippingAddressLine2Id"
							label="Shipping Address Line 2"
							error={form.formState.errors.shippingAddressLine2?.message}
							disabled={shipToDifferentCompany ? !shippingAddressText : !shippingAddress}
						/>
						<TextareaRhf<OrderFormValues>
							register={form.register}
							name="shippingNotes"
							id="shippingNotesId"
							label="Shipping Notes"
							error={form.formState.errors.shippingNotes?.message}
						/>
						<InputRhf<OrderFormValues>
							type="text"
							register={form.register}
							name="deliveryMethod"
							id="deliveryMethodId"
							label="Delivery Method"
							error={form.formState.errors.deliveryMethod?.message}
						/>
					</fieldset>
					<div className="newCustomer__comments">
						<TextareaRhf<OrderFormValues>
							name="comments"
							id="commentsId"
							label="Comments"
							register={form.register}
							error={form.formState.errors.comments?.message}
						/>
					</div>
				</form>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</>
	);
};
