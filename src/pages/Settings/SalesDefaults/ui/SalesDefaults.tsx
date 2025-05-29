import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { useGetSalesDefaults } from "../api/queries/useGetSalesDefaults";
import { useUpdateSalesDefaults } from "../api/mutations/useUpdateSalesDefaults";

import { denormalizeSalesDefaults, normalizeSalesDefaults } from "../utils/getNormalizedSalesDefaultsData";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { SwitchRhf } from "@/components/shared/form/SwitchRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { marginThresholdBasedOnOptions, SalesDefaultsFormValues } from "@/@types/salesDefaults";

const SalesDefaults: FC = () => {
	const { orgId } = useStore(orgStore);

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<SalesDefaultsFormValues>({
		defaultValues: {
			automatedServiceFee: false,
			automatedServiceFeePercentage: "0",
			account: undefined,
			accounts: [],
			taxType: undefined,
			taxTypes: [],
			pickingIsAutomatic: false,
			packingIsManual: false,
			shippingIsManual: false,
			marginThreshold: false,
			marginThresholdPercentage: "0",
			marginThresholdBasedOn: undefined,
			quoteFirst: false,
			isDefaultTaxRateInclusive: false,
		},
	});

	const { data, error, isLoading, isError, isSuccess } = useGetSalesDefaults({
		organisationId: orgId,
	});

	const { mutate: updateSalesDefaults, isPending } = useUpdateSalesDefaults({
		organisationId: orgId,
	});

	const quoteFirstValue = watch("quoteFirst");
	const marginThreshold = watch("marginThreshold");
	const automatedServiceFee = watch("automatedServiceFee");

	const onSubmit = (formData: SalesDefaultsFormValues) => {
		const data = normalizeSalesDefaults(formData);

		updateSalesDefaults({ body: data });
	};

	useEffect(() => {
		if (isSuccess && data?.data) {
			reset(denormalizeSalesDefaults(data.data));
		}
	}, [isSuccess, data, reset]);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageWrapper>
					{isLoading ? (
						<Loader isFullWidth />
					) : isError && error ? (
						<ErrorMessage error={error} />
					) : isSuccess && data.data ? (
						<>
							<CommonPageHeader>
								<CommonPageTitle>Sales Default Settings</CommonPageTitle>
								<CommonPageActions>
									<Link to="/settings/general-settings" className="link">
										Back to Settings
									</Link>
									<Button type="submit" disabled={isPending} isLoading={isPending} form="salesDefaultsForm">
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#save" />
										</svg>
										Save
									</Button>
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain>
								<form id="salesDefaultsForm" onSubmit={handleSubmit(onSubmit)}>
									<div className="salesDefaults__cards">
										<div className="salesDefaults__card">
											<div className="salesDefaults__switch">
												<h2 className="salesDefaults__title">Automated Service Fee</h2>
												<SwitchRhf<SalesDefaultsFormValues>
													hideLabel
													register={register}
													name="automatedServiceFee"
													id="automatedServiceFeeId"
													label="Automated Service Fee"
													error={errors.automatedServiceFee?.message}
													rules={{
														onChange: ({ target }) => {
															const checked = target.checked;

															if (!checked) {
																setValue("automatedServiceFeePercentage", "0");
																setValue("account", undefined);
																setValue("taxType", undefined);
															}
														},
													}}
												/>
											</div>
											<p className="salesDefaults__text">
												Automatically apply a service fee under additional charges based on a predefined
												percentage of the product subtotal.
											</p>
											<InputRhf<SalesDefaultsFormValues>
												step={0.01}
												type="number"
												label="Percentage"
												register={register}
												disabled={!automatedServiceFee}
												name="automatedServiceFeePercentage"
												id="automatedServiceFeePercentageId"
												rules={{
													required: automatedServiceFee ? "Required" : false,
													min: { value: 0, message: "Number must be greater than or equal to 0" },
													max: { value: 100, message: "Number must be less than or equal to 100" },
												}}
												error={errors.automatedServiceFeePercentage?.message}
											/>

											<Controller
												name="account"
												control={control}
												rules={{
													required: automatedServiceFee ? "Required" : false,
												}}
												render={({ field }) => (
													<CustomSelect
														useSearch
														{...field}
														id="accountSelector"
														placeholder="Account"
														value={field.value}
														onValueChange={field.onChange}
														disabled={!automatedServiceFee}
														error={errors.account?.message}
														customValues={data.data.accounts}
													/>
												)}
											/>

											<Controller
												name="taxType"
												control={control}
												rules={{
													required: automatedServiceFee ? "Required" : false,
												}}
												render={({ field }) => (
													<CustomSelect
														useSearch
														{...field}
														id="taxTypeSelector"
														value={field.value}
														placeholder="Tax Types"
														onValueChange={field.onChange}
														disabled={!automatedServiceFee}
														error={errors.taxType?.message}
														customValues={data.data.taxTypes}
													/>
												)}
											/>
										</div>

										<div className="salesDefaults__card">
											<h2 className="salesDefaults__title salesDefaults__title--withPadding">
												Fulfillment Customisation
											</h2>
											<div className="salesDefaults__switch">
												<h3 className="salesDefaults__subTitle">Picking is</h3>
												<SwitchRhf<SalesDefaultsFormValues>
													label="Automatic"
													register={register}
													name="pickingIsAutomatic"
													id="pickingIsAutomaticId"
													className="salesDefaults__switch--automatic-label"
													error={errors.pickingIsAutomatic?.message}
												/>
											</div>
											<p className="salesDefaults__text">
												Pick will be auto-completed for sale tasks upon order authorisation if there is
												sufficient quantity on hand, if 'Automatic' is selected. Otherwise, pick must be
												filled and authorised manually.
											</p>
											<div className="salesDefaults__switch">
												<h3 className="salesDefaults__subTitle">Packing is</h3>
												<SwitchRhf<SalesDefaultsFormValues>
													label="Manual"
													register={register}
													name="packingIsManual"
													id="packingIsManualId"
													className="salesDefaults__switch--automatic-label"
													error={errors.packingIsManual?.message}
												/>
											</div>
											<p className="salesDefaults__text">
												Pack will be auto-completed for upon pick authorisation, if 'Automatic' is selected.
												Otherwise, pack must be filled and authorised manually.
											</p>
											<div className="salesDefaults__switch">
												<h3 className="salesDefaults__subTitle">Shipping is</h3>
												<SwitchRhf<SalesDefaultsFormValues>
													label="Manual"
													register={register}
													name="shippingIsManual"
													id="shippingIsManualId"
													className="salesDefaults__switch--automatic-label"
													error={errors.shippingIsManual?.message}
												/>
											</div>
											<p className="salesDefaults__text">
												Ship will be auto-completed upon authorisation, if 'Automatic' is selected. Otherwise,
												ship must be filled and authorised manually.
											</p>
										</div>

										<div className="salesDefaults__card">
											<div className="salesDefaults__switch">
												<h2 className="salesDefaults__title">Margin Threshold</h2>
												<SwitchRhf<SalesDefaultsFormValues>
													hideLabel
													register={register}
													name="marginThreshold"
													id="marginThresholdId"
													label="Margin Threshold"
													error={errors.marginThreshold?.message}
													rules={{
														onChange: ({ target }) => {
															const checked = target.checked;

															if (!checked) {
																setValue("marginThresholdPercentage", "0");
																setValue("marginThresholdBasedOn", marginThresholdBasedOnOptions[0]);
															}
														},
													}}
												/>
											</div>
											<p className="salesDefaults__text">
												Set a minimum profit margin percentage to prevent sales below acceptable limits,
												ensuring profitability and cost control.
											</p>
											<InputRhf<SalesDefaultsFormValues>
												step={0.01}
												type="number"
												label="Percentage"
												name="marginThresholdPercentage"
												id="marginThresholdPercentageId"
												register={register}
												rules={{
													required: marginThreshold ? "Required" : false,
													min: { value: 0, message: "Number must be greater than or equal to 0" },
													max: { value: 100, message: "Number must be less than or equal to 100" },
												}}
												error={errors.marginThresholdPercentage?.message}
												disabled={!marginThreshold}
											/>
											<Controller
												name="marginThresholdBasedOn"
												control={control}
												rules={{ required: marginThreshold ? "Required" : false }}
												render={({ field }) => (
													<CustomSelect
														{...field}
														value={field.value}
														placeholder="Based On"
														allowUnselect={false}
														disabled={!marginThreshold}
														onValueChange={field.onChange}
														id="marginThresholdBasedOnSelector"
														customValues={marginThresholdBasedOnOptions}
														error={errors.marginThresholdBasedOn?.message}
													/>
												)}
											/>
										</div>

										<div className="salesDefaults__card">
											<h2 className="salesDefaults__title salesDefaults__title--withPadding">
												Sale Cycle Workflow Options
											</h2>
											<p className="salesDefaults__text">
												Start with quotes or skip to sales orders by default
											</p>
											<div className="salesDefaults__switch">
												<SwitchRhf<SalesDefaultsFormValues>
													register={register}
													name="quoteFirst"
													id="quoteFirstId"
													error={errors.quoteFirst?.message}
													label={quoteFirstValue ? "Sales Order First" : "Quote First"}
												/>
											</div>
										</div>

										<div className="salesDefaults__card">
											<h2 className="salesDefaults__title salesDefaults__title--withPadding">
												Default Tax Rule
											</h2>
											<p className="salesDefaults__text">
												Define whether tax should be applied exclusively (added on top of prices) or
												inclusively (already included in prices).
											</p>
											<div className="salesDefaults__switch">
												<SwitchRhf<SalesDefaultsFormValues>
													register={register}
													label="Exclusive"
													id="defaultTaxRateId"
													name="isDefaultTaxRateInclusive"
													error={errors.isDefaultTaxRateInclusive?.message}
												/>
											</div>
										</div>
									</div>
								</form>
							</CommonPageMain>
						</>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</CommonPageWrapper>
			</div>
		</CommonPage>
	);
};

export default SalesDefaults;
