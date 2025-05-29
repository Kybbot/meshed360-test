import { ChangeEvent, FC, useEffect } from "react";
import { useStore } from "zustand";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { getNormalizedCustomerData } from "../../utils/getNormalizedCustomerData";

import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";

import { orgStore } from "@/app/stores/orgStore";

import { generateAccountNumber } from "@/utils/generateAccountNumber";
import { useCreateCustomer, useUpdateCustomer } from "@/entities/customers";

import {
	statuses,
	statusesByKey,
	EditCustomerType,
	CustomerFormValues,
	GetCustomerSettingsResponseType,
} from "@/@types/customers";

type CustomerFormProps = {
	customerSettingsData: GetCustomerSettingsResponseType;
} & ({ isEdit?: false; customerData?: never } | { isEdit: true; customerData: EditCustomerType });

export const CustomerForm: FC<CustomerFormProps> = ({
	customerData,
	isEdit = false,
	customerSettingsData,
}) => {
	const navigate = useNavigate();
	const { customerId } = useParams();
	const orgId = useStore(orgStore, (selector) => selector.orgId);

	const {
		mutate: createCustomer,
		data: createCustomerData,
		isSuccess: isCreateCustomerSuccess,
	} = useCreateCustomer();

	const { mutate: updateCustomer } = useUpdateCustomer({ customerId });

	const {
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<CustomerFormValues>({
		defaultValues: {
			name: "",
			accountNumber: "",
			status: { id: "ACTIVE", name: "Active" },
			vatNumber: "",
			creditLimit: "",
			discount: "",
			salesRep: undefined,
			paymentTerm: undefined,
			priceList: undefined,
			taxRule: undefined,
			salesAccount: undefined,
			comments: "",
		},
	});

	const onSubmit = async (formData: CustomerFormValues) => {
		const normalizedData = getNormalizedCustomerData(formData);

		if (isEdit) {
			if (orgId && customerId) {
				const { name: _name, ...data } = normalizedData;
				updateCustomer({ body: { ...data, organisationId: orgId } });
			}
		} else {
			if (orgId) {
				createCustomer({ body: { ...normalizedData, organisationId: orgId } });
			}
		}
	};

	useEffect(() => {
		if (isEdit && customerData) {
			reset({
				name: customerData.name,
				accountNumber: customerData.accountNumber,
				status: statusesByKey[customerData.status],
				vatNumber: customerData.vatNumber,
				creditLimit: customerData.creditLimit,
				discount: customerData.discount,
				salesRep: customerData.salesRep || undefined,
				paymentTerm: customerData.paymentTerm
					? { id: customerData.paymentTerm.id, name: customerData.paymentTerm.paymentTerm }
					: undefined,
				priceList: customerData.priceList || undefined,
				taxRule: customerData.taxRule || undefined,
				salesAccount: customerData.saleAccount || undefined,
				comments: customerData.comments,
			});
		}
	}, [isEdit, customerData, reset]);

	useEffect(() => {
		if (isCreateCustomerSuccess && createCustomerData.data) {
			navigate(`/sales/customers/edit/${createCustomerData.data.id}`);
		}
	}, [isCreateCustomerSuccess, createCustomerData, navigate]);

	return (
		<form className="newCustomer__form" id="newCustomerForm" onSubmit={handleSubmit(onSubmit)}>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Customer Details</legend>
				<InputRhf<CustomerFormValues>
					type="text"
					name="name"
					id="nameId"
					label="Name*"
					disabled={isEdit}
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
				<InputRhf<CustomerFormValues>
					type="text"
					name="accountNumber"
					id="accountNumberId"
					label="Account Number"
					register={register}
					rules={{ required: "Required" }}
					error={errors.accountNumber?.message}
				/>
				<Controller
					name="status"
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => {
						return (
							<CustomSelect
								{...field}
								id="statusId"
								value={field.value}
								placeholder="Status*"
								allowUnselect={false}
								customValues={statuses}
								error={errors.status?.message}
								onValueChange={field.onChange}
							/>
						);
					}}
				/>
				<InputRhf<CustomerFormValues>
					type="text"
					name="vatNumber"
					id="vatNumberId"
					label="VAT Number"
					register={register}
					error={errors.vatNumber?.message}
				/>
				<InputRhf<CustomerFormValues>
					type="text"
					name="creditLimit"
					id="creditLimitId"
					label="Credit Limit"
					register={register}
					error={errors.creditLimit?.message}
				/>
				<InputRhf<CustomerFormValues>
					type="text"
					name="discount"
					id="discountId"
					label="Discount%"
					register={register}
					error={errors.discount?.message}
				/>
			</fieldset>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Customer Settings</legend>
				<Controller
					name="salesRep"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="salesRepId"
							value={field.value}
							placeholder="Sales Rep"
							onValueChange={field.onChange}
							error={errors.salesRep?.message}
							customValues={customerSettingsData.salesReps}
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
							customValues={customerSettingsData.paymentTerms}
						/>
					)}
				/>
				<Controller
					name="priceList"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="priceListId"
							value={field.value}
							placeholder="Price List"
							onValueChange={field.onChange}
							error={errors.priceList?.message}
							customValues={customerSettingsData.priceList}
						/>
					)}
				/>
			</fieldset>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Financial Mappings</legend>
				<Controller
					name="taxRule"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="taxRuleId"
							value={field.value}
							placeholder="Tax Rule"
							onValueChange={field.onChange}
							error={errors.taxRule?.message}
							customValues={customerSettingsData.xeroTaxRate}
						/>
					)}
				/>
				<Controller
					name="salesAccount"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="saleAccountId"
							value={field.value}
							placeholder="Sale Account"
							onValueChange={field.onChange}
							error={errors.salesAccount?.message}
							customValues={customerSettingsData.xeroAccounts}
						/>
					)}
				/>
			</fieldset>
			<div className="newCustomer__comments">
				<TextareaRhf<CustomerFormValues>
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
