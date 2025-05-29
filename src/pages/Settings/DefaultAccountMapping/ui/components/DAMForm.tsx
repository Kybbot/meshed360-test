import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { CustomSelect } from "@/components/shared/CustomSelect";

import { orgStore } from "@/app/stores/orgStore";

import { useGetOrganisationXeroAccountsAllTypes } from "../../api/queries/useGetOrganisationXeroAccountsAllTypes";
import {
	DAMFormSchema,
	DAMFormValues,
	GetOrganisationXeroAccountsAllTypesResponse,
	OrganisationDefaultAccountMappingResponse,
} from "@/@types/defaultAccountMapping";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateDefaultAccountMapping } from "../../api/mutations/useUpdateDefaultAccountMapping";
import { useGetOrganisationDefaultAccountMapping } from "../../api/queries/useGetOrganisationDefaultAccountMapping";

interface Props {
	isCancelClicked: boolean;
}

export const DAMForm: FC<Props> = ({ isCancelClicked }) => {
	const { orgId } = useStore(orgStore);
	const { data, error, isLoading, isError, isSuccess } = useGetOrganisationXeroAccountsAllTypes({
		organisationId: orgId,
	});

	const {
		data: mappingData,
		error: mappingError,
		isSuccess: mappingSuccess,
	} = useGetOrganisationDefaultAccountMapping({
		organisationId: orgId!,
	});
	const { mutate } = useUpdateDefaultAccountMapping();

	const {
		reset,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<DAMFormValues>({
		defaultValues: {
			inventoryAccount: undefined,
			defaultRevenueAccount: undefined,
			workInProgressAccount: undefined,
			customerControlAccount: undefined,
			wastageAccount: undefined,
			roundingAccount: undefined,
			goodsReceivedNotBilled: undefined,
			costOfGoodsSoldAccount: undefined,
			taxLiabilityAccount: undefined,
			inTransitAccount: undefined,
			supplierControlAccount: undefined,
			finishedGoodsAccount: undefined,
			goodsBilledNotShipped: undefined,
			defaultEDAccount: undefined,
		},
		resolver: zodResolver(DAMFormSchema),
	});

	const formatBodyData = (formData: DAMFormValues) => {
		return {
			inventoryControlAccountId: formData.inventoryAccount?.id || null,
			defaultRevenueAccountId: formData.defaultRevenueAccount?.id || null,
			whipAccountId: formData.workInProgressAccount?.id || null,
			customerControlAccountId: formData.customerControlAccount?.id || null,
			wastageAccountId: formData.wastageAccount?.id || null,
			roundingCostAccountId: formData.roundingAccount?.id || null,
			cogsAccountId: formData.costOfGoodsSoldAccount?.id || null,
			taxLiabilityAccountId: formData.taxLiabilityAccount?.id || null,
			inTransitAccountId: formData.inTransitAccount?.id || null,
			supplierAccountId: formData.supplierControlAccount?.id || null,
			finishedGoodsAccountId: formData.finishedGoodsAccount?.id || null,
			defaultExpenseDisbursementAccountId: formData.defaultEDAccount?.id || null,
		};
	};
	const defineMappingData = (
		responseMappingData: OrganisationDefaultAccountMappingResponse,
		responseInputsData: GetOrganisationXeroAccountsAllTypesResponse,
	) => {
		const defineValue = (
			arrKey: keyof GetOrganisationXeroAccountsAllTypesResponse,
			valId: keyof OrganisationDefaultAccountMappingResponse,
		) => {
			return responseInputsData[arrKey].find((el) => el.id === responseMappingData[valId]);
		};

		const presetFormData = {
			inventoryAccount: defineValue("inventoryControlAccounts", "inventoryControlAccountId"),
			defaultRevenueAccount: defineValue("defaultRevenueAccounts", "defaultRevenueAccountId"),
			workInProgressAccount: defineValue("whipAccounts", "whipAccountId"),
			customerControlAccount: defineValue("customerControlAccounts", "customerControlAccountId"),
			wastageAccount: defineValue("wastageAccounts", "wastageAccountId"),
			roundingAccount: defineValue("roundingCostAccounts", "roundingCostAccountId"),
			costOfGoodsSoldAccount: defineValue("cogsAccounts", "cogsAccountId"),
			taxLiabilityAccount: defineValue("taxLiabilityAccounts", "taxLiabilityAccountId"),
			inTransitAccount: defineValue("inTransit", "inTransitAccountId"),
			supplierControlAccount: defineValue("supplier", "supplierAccountId"),
			finishedGoodsAccount: defineValue("finishedGoodsAccounts", "finishedGoodsAccountId"),
			defaultEDAccount: defineValue(
				"defaultExpenseDisbursementAccount",
				"defaultExpenseDisbursementAccountId",
			),
		};

		return presetFormData;
	};

	useEffect(() => {
		reset();
	}, [isCancelClicked, reset]);

	useEffect(() => {
		if (mappingError) {
			reset();
			return;
		}

		if (mappingSuccess && mappingData && data) {
			const orgMappingData = defineMappingData(mappingData.data, data.data);
			reset(orgMappingData);
		}
	}, [mappingSuccess, mappingError, mappingData, reset, data]);

	const onSubmit: SubmitHandler<DAMFormValues> = (formData) => {
		mutate({
			organisationId: orgId!,
			body: formatBodyData(formData),
		});
	};

	return (
		<>
			{isLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess && data ? (
				<form className="dam__form" id="DAMForm" onSubmit={handleSubmit(onSubmit)}>
					<fieldset className="form__fieldset">
						<Controller
							name="inventoryAccount"
							control={control}
							render={({ field }) => {
								return (
									<CustomSelect
										useSearch
										{...field}
										id="inventoryAccountId"
										value={field.value}
										placeholder="Inventory Control Account"
										onValueChange={field.onChange}
										error={errors.inventoryAccount?.message}
										customValues={data.data.inventoryControlAccounts}
									/>
								);
							}}
						/>

						<Controller
							name="defaultRevenueAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="defaultRevenueAccountId"
									value={field.value}
									placeholder="Default Revenue Account"
									onValueChange={field.onChange}
									error={errors.inventoryAccount?.message}
									customValues={data.data.defaultRevenueAccounts}
								/>
							)}
						/>
						<Controller
							name="workInProgressAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="workInProgressAccountId"
									value={field.value}
									placeholder="Work in Progress Account"
									onValueChange={field.onChange}
									error={errors.workInProgressAccount?.message}
									customValues={data.data.whipAccounts}
								/>
							)}
						/>
						<Controller
							name="customerControlAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="customerControlAccountId"
									value={field.value}
									placeholder="Customer Control Account"
									onValueChange={field.onChange}
									error={errors.customerControlAccount?.message}
									customValues={data.data.customerControlAccounts}
								/>
							)}
						/>
						<Controller
							name="wastageAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="wastageAccountId"
									value={field.value}
									placeholder="Wastage Account"
									onValueChange={field.onChange}
									error={errors.wastageAccount?.message}
									customValues={data.data.wastageAccounts}
								/>
							)}
						/>
						<Controller
							name="roundingAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="roundingAccountId"
									value={field.value}
									placeholder="Rounding Account"
									onValueChange={field.onChange}
									error={errors.roundingAccount?.message}
									customValues={data.data.roundingCostAccounts}
								/>
							)}
						/>
					</fieldset>
					<fieldset className="form__fieldset">
						<Controller
							name="costOfGoodsSoldAccount"
							control={control}
							render={({ field }) => {
								return (
									<CustomSelect
										useSearch
										{...field}
										id="costOfGoodsSoldAccountId"
										value={field.value}
										placeholder="Cost of Goods Sold Account"
										onValueChange={field.onChange}
										error={errors.costOfGoodsSoldAccount?.message}
										customValues={data.data.cogsAccounts}
									/>
								);
							}}
						/>
						<Controller
							name="taxLiabilityAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="taxLiabilityAccountId"
									value={field.value}
									placeholder="Tax Liability Account"
									onValueChange={field.onChange}
									error={errors.taxLiabilityAccount?.message}
									customValues={data.data.taxLiabilityAccounts}
								/>
							)}
						/>
						<Controller
							name="inTransitAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="inTransitAccountId"
									value={field.value}
									placeholder="In-Transit Account"
									onValueChange={field.onChange}
									error={errors.inTransitAccount?.message}
									customValues={data.data.inTransit}
								/>
							)}
						/>
						<Controller
							name="supplierControlAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="supplierControlAccountId"
									value={field.value}
									placeholder="Supplier Control Account"
									onValueChange={field.onChange}
									error={errors.supplierControlAccount?.message}
									customValues={data.data.supplier}
								/>
							)}
						/>
						<Controller
							name="finishedGoodsAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="finishedGoodsAccountId"
									value={field.value}
									placeholder="Finished Goods Account"
									onValueChange={field.onChange}
									error={errors.finishedGoodsAccount?.message}
									customValues={data.data.finishedGoodsAccounts}
								/>
							)}
						/>
						<Controller
							name="defaultEDAccount"
							control={control}
							render={({ field }) => (
								<CustomSelect
									useSearch
									{...field}
									id="defaultEDAccountId"
									value={field.value}
									placeholder="Default Expense Disbursement Account"
									onValueChange={field.onChange}
									error={errors.defaultEDAccount?.message}
									customValues={data.data.defaultExpenseDisbursementAccount}
								/>
							)}
						/>
					</fieldset>
				</form>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</>
	);
};
