import { ChangeEvent, FC, useEffect } from "react";
import { useStore } from "zustand";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { getNormalizedSupplierData } from "../utils/getNormalizedSupplierData";

import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";

import { orgStore } from "@/app/stores/orgStore";

import { useCreateSupplier, useUpdateSupplier } from "@/entities/suppliers";

import { generateAccountNumber } from "@/utils/generateAccountNumber";

import {
	statuses,
	statusesByKey,
	EditSupplierType,
	SupplierFormValues,
	GetSupplierSettingsResponseType,
} from "@/@types/suppliers";

type SupplierFormProps = {
	settingsData: GetSupplierSettingsResponseType;
} & ({ isEdit: false; supplierData?: never } | { isEdit: true; supplierData: EditSupplierType });

export const SupplierForm: FC<SupplierFormProps> = ({ isEdit = false, supplierData, settingsData }) => {
	const navigate = useNavigate();
	const { supplierId } = useParams();
	const { orgId } = useStore(orgStore);

	const {
		mutate: createCustomer,
		data: createSupplierData,
		isSuccess: isCreateSupplierSuccess,
	} = useCreateSupplier();

	const { mutate: updateSupplier } = useUpdateSupplier();

	const {
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<SupplierFormValues>({
		defaultValues: {
			name: "",
			accountNumber: "",
			isActive: { id: "active", name: "Active" },
			taxNumber: "",
			creditLimit: "",
			discount: "",
			currency: undefined,
			paymentTerm: undefined,
			purchaseTax: undefined,
			purchaseAccount: undefined,
			comments: "",
		},
	});

	const onSubmit = async (formData: SupplierFormValues) => {
		const data = getNormalizedSupplierData(formData);

		if (isEdit) {
			if (orgId && supplierId) {
				updateSupplier({
					supplierId,
					body: { ...data, organisationId: orgId },
				});
			}
		} else {
			if (orgId) {
				createCustomer({
					body: { ...data, organisationId: orgId },
				});
			}
		}
	};

	useEffect(() => {
		if (isEdit && supplierData) {
			reset({
				name: supplierData.name,
				accountNumber: supplierData.accountNumber,
				isActive: supplierData.isActive ? statusesByKey["active"] : statusesByKey["inactive"],
				taxNumber: supplierData.taxNumber,
				creditLimit: supplierData.creditLimit,
				discount: supplierData.discount,
				currency: supplierData.currency,
				paymentTerm: supplierData.paymentTerm,
				purchaseTax: supplierData.purchaseTax,
				purchaseAccount: supplierData.defaultPurchaseAccount,
				comments: supplierData.comments,
			});
		}
	}, [isEdit, supplierData, reset]);

	useEffect(() => {
		if (isCreateSupplierSuccess && createSupplierData.data) {
			navigate(`/purchases/suppliers/edit/${createSupplierData.data.id}`);
		}
	}, [isCreateSupplierSuccess, createSupplierData, navigate]);

	return (
		<form className="newCustomer__form" id="newSupplierForm" onSubmit={handleSubmit(onSubmit)}>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Supplier Details</legend>
				<InputRhf<SupplierFormValues>
					type="text"
					name="name"
					id="nameId"
					label="Name*"
					register={register}
					rules={{
						required: "Required",
						onChange(event: ChangeEvent<HTMLInputElement>) {
							if (!isEdit) {
								const value = event.target.value;
								const accountNumberValue = generateAccountNumber(value);
								setValue("accountNumber", accountNumberValue);
							}
						},
					}}
					error={errors.name?.message}
				/>
				<InputRhf<SupplierFormValues>
					type="text"
					name="accountNumber"
					id="accountNumberId"
					label="Account Number"
					register={register}
					rules={{ required: "Required" }}
					error={errors.accountNumber?.message}
				/>
				<Controller
					name="isActive"
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => {
						return (
							<CustomSelect
								{...field}
								id="isActiveId"
								value={field.value}
								placeholder="Status*"
								allowUnselect={false}
								customValues={statuses}
								error={errors.isActive?.message}
								onValueChange={field.onChange}
							/>
						);
					}}
				/>
				<InputRhf<SupplierFormValues>
					type="text"
					name="taxNumber"
					id="taxNumberId"
					label="VAT Number"
					register={register}
					error={errors.taxNumber?.message}
				/>
				<InputRhf<SupplierFormValues>
					type="text"
					name="creditLimit"
					id="creditLimitId"
					label="Credit Limit"
					register={register}
					error={errors.creditLimit?.message}
				/>
				<InputRhf<SupplierFormValues>
					type="text"
					name="discount"
					id="discountId"
					label="Discount%"
					register={register}
					error={errors.discount?.message}
				/>
			</fieldset>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Financial Details</legend>
				<Controller
					name="currency"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="currencyId"
							value={field.value}
							placeholder="Currency"
							onValueChange={field.onChange}
							error={errors.currency?.message}
							customValues={settingsData.currencies}
						/>
					)}
				/>
				<Controller
					name="paymentTerm"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="paymentTermId"
							value={field.value}
							placeholder="Payment Term"
							onValueChange={field.onChange}
							error={errors.paymentTerm?.message}
							customValues={settingsData.paymentTerms}
						/>
					)}
				/>
			</fieldset>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Financial Mappings</legend>
				<Controller
					name="purchaseTax"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="purchaseTaxId"
							value={field.value}
							placeholder="Tax Rule"
							onValueChange={field.onChange}
							error={errors.purchaseTax?.message}
							customValues={settingsData.taxRates}
						/>
					)}
				/>
				<Controller
					name="purchaseAccount"
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="purchaseAccountId"
							value={field.value}
							placeholder="Purchase Account*"
							onValueChange={field.onChange}
							error={errors.purchaseAccount?.message}
							customValues={settingsData.purchaseAccounts}
						/>
					)}
				/>
			</fieldset>
			<div className="newCustomer__comments">
				<TextareaRhf<SupplierFormValues>
					name="comments"
					id="commentsId"
					label="Comments"
					register={register}
					error={errors.comments?.message}
				/>
			</div>
		</form>
	);
};
