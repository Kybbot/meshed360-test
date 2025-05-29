import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { AutomationFormValues, automationVendorOptions, purchaseTypeOptions } from "@/@types/automations";
import { useCreateAutomation } from "../../AutomationsList/api/mutations/useCreateAutomation";

import { Button } from "@/components/shared/Button";

import { CommonPage, CommonPageActions, CommonPageHeader, CommonPageTitle } from "@/components/widgets/Page";

import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";

import { orgStore } from "@/app/stores/orgStore";

type AutomationProps = {
	isAdd?: boolean;
};

const Automation: FC<AutomationProps> = ({ isAdd = false }) => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);

	const {
		isPending,
		mutate: createAutomation,
		data: createAutomationData,
		isSuccess: isCreateAutomationSuccess,
	} = useCreateAutomation();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AutomationFormValues>({
		defaultValues: {
			provider: { id: "AGRIMARK", name: "Agrimark" },
			purchaseType: { id: "ALL_PURCHASES", name: "All Purchases" },
			accountHolder: "",
			accountNumber: "",
			subaccountNumber: "",
			username: "",
			password: "",
		},
	});

	const onSubmit = async (formData: AutomationFormValues) => {
		if (orgId) {
			createAutomation({
				organisationId: orgId,
				body: {
					provider: formData.provider.id as "AGRIMARK" | "BKB" | "OVK",
					accountNumber: formData.accountNumber,
					username: formData.username,
					password: formData.password,
					purchaseType: formData.purchaseType.id as "ALL_PURCHASES" | "DIESEL_PURCHASE",
					accountHolder: formData.accountHolder,
					subaccountNumber: formData.subaccountNumber,
				},
			});
		}
	};

	useEffect(() => {
		if (isCreateAutomationSuccess && createAutomationData.data) {
			navigate(`/purchases/automations`);
		}
	}, [navigate, isCreateAutomationSuccess, createAutomationData]);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>New Automation</CommonPageTitle>
					<CommonPageActions>
						<Button type="button" isSecondary onClick={() => navigate(-1)}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#cancel" />
							</svg>
							Cancel
						</Button>
						{isAdd && (
							<Button type="submit" form="newAutomationForm" isLoading={isPending} disabled={isPending}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#plus" />
								</svg>
								Create
							</Button>
						)}
					</CommonPageActions>
				</CommonPageHeader>
				<form id="newAutomationForm" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
					<div
						className="stockAdjustment__mainForm"
						style={{ borderBottom: "1px solid #e6e9f4", marginBottom: "16px" }}
					>
						<div style={{ marginBottom: "32px" }}>
							<Controller
								name="provider"
								control={control}
								rules={{
									required: "Required",
								}}
								render={({ field }) => (
									<CustomSelect
										{...field}
										value={field.value}
										allowUnselect={false}
										placeholder="Vendor Name*"
										onValueChange={field.onChange}
										id="providerSelectId"
										customValues={automationVendorOptions}
										error={errors.provider?.message}
									/>
								)}
							/>
						</div>
					</div>
					<div className="stockAdjustment__mainForm">
						<fieldset className="form__fieldset">
							<Controller
								name="purchaseType"
								control={control}
								rules={{
									required: "Required",
								}}
								render={({ field }) => (
									<CustomSelect
										{...field}
										value={field.value}
										allowUnselect={false}
										placeholder="Purchase Type*"
										onValueChange={field.onChange}
										id="purchaseTypeSelectId"
										customValues={purchaseTypeOptions}
										error={errors.purchaseType?.message}
									/>
								)}
							/>
							<InputRhf<AutomationFormValues>
								rules={{
									required: "Required",
								}}
								type="text"
								name="accountHolder"
								id="accountHolderId"
								label="Account Holder*"
								register={register}
								error={errors.accountHolder?.message}
							/>
							<InputRhf<AutomationFormValues>
								rules={{
									required: "Required",
								}}
								type="text"
								name="accountNumber"
								id="accountNumberId"
								label="Account Number*"
								register={register}
								error={errors.accountNumber?.message}
							/>
						</fieldset>
						<fieldset className="form__fieldset">
							<InputRhf<AutomationFormValues>
								rules={{
									required: "Required",
								}}
								type="text"
								name="subaccountNumber"
								id="subaccountNumberId"
								label="Subaccount Number*"
								register={register}
								error={errors.subaccountNumber?.message}
							/>
							<InputRhf<AutomationFormValues>
								rules={{
									required: "Required",
								}}
								type="email"
								name="username"
								id="usernameId"
								autoComplete="off"
								label="Username*"
								register={register}
								error={errors.username?.message}
							/>
							<InputRhf<AutomationFormValues>
								rules={{
									required: "Required",
								}}
								type="text"
								name="password"
								id="textId"
								label="Password*"
								autoComplete="new-password"
								isShowPasswordBtn
								register={register}
								error={errors.password?.message}
							/>
						</fieldset>
					</div>
				</form>
			</div>
		</CommonPage>
	);
};

export default Automation;
