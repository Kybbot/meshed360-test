import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import { useForm } from "react-hook-form";

import { GetPurchaseDefaults } from "@/@types/purchaseDefaults";
import { useGetPurchaseDefaults } from "../api/queries/useGetPurchaseDefaults";
import { useUpdatePurchaseDefaults } from "../api/mutations/useUpdatePurchaseDefaults";

import {
	normalizePurchaseDefaults,
	denormalizePurchaseDefaults,
} from "../utils/getNormalizedPurchaseDefaultsData";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { SwitchRhf } from "@/components/shared/form/SwitchRhf";
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

const PurchaseDefaults: FC = () => {
	const { orgId } = useStore(orgStore);

	const {
		reset,
		watch,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<GetPurchaseDefaults>({
		defaultValues: {
			allowOverReceive: false,
			billFirst: false,
			isDefaultTaxRateInclusive: false,
			limitProductBySupplier: false,
		},
	});

	const billFirst = watch("billFirst");
	const inclusiveTaxRate = watch("isDefaultTaxRateInclusive");

	const { data, error, isLoading, isError, isSuccess } = useGetPurchaseDefaults({
		organisationId: orgId,
	});

	const { mutate: updatePurchaseDefaults, isPending } = useUpdatePurchaseDefaults({
		organisationId: orgId,
	});

	const onSubmit = (formData: GetPurchaseDefaults) => {
		const data = normalizePurchaseDefaults(formData);

		updatePurchaseDefaults({ body: data });
	};

	useEffect(() => {
		if (isSuccess && data?.data) {
			reset(denormalizePurchaseDefaults(data.data));
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
								<CommonPageTitle>Purchase Default Settings</CommonPageTitle>
								<CommonPageActions>
									<Link to="/settings/general-settings" className="link">
										Back to Settings
									</Link>
									<Button
										type="submit"
										disabled={isPending}
										isLoading={isPending}
										form="purchaseDefaultsForm"
									>
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#save" />
										</svg>
										Save
									</Button>
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain>
								<form id="purchaseDefaultsForm" onSubmit={handleSubmit(onSubmit)}>
									<div className="salesDefaults__cards">
										<div className="salesDefaults__card">
											<div className="salesDefaults__switch">
												<h2 className="salesDefaults__title">Allow over-receive off an order</h2>
												<SwitchRhf<GetPurchaseDefaults>
													hideLabel
													register={register}
													name="allowOverReceive"
													id="allowOverReceiveId"
													label="Allow Over-Receive"
													error={errors.allowOverReceive?.message}
												/>
											</div>
											<p className="salesDefaults__text">
												Enable this option to receive a quantity greater than what was originally ordered,
												allowing for flexibility in managing extra or unexpected stock
											</p>
										</div>

										<div className="salesDefaults__card">
											<h2 className="salesDefaults__title salesDefaults__title--withPadding">
												Purchase Cycle Workflow Options
											</h2>
											<p className="salesDefaults__text">
												Choose your purchase workflow: Start with receiving goods first or create the bill
												upfront before receiving stock.
											</p>
											<div className="salesDefaults__switch">
												<SwitchRhf<GetPurchaseDefaults>
													register={register}
													name="billFirst"
													id="billFirstId"
													label={billFirst ? "Receive First" : "Bill First"}
													error={errors.billFirst?.message}
												/>
											</div>
										</div>
										<div className="salesDefaults__card" style={{ gap: 0 }}>
											<h2 className="salesDefaults__title salesDefaults__title--withPadding">
												Default Tax Rule
											</h2>
											<p className="salesDefaults__text">
												Define whether tax should be applied exclusively (added on top of prices) or
												inclusively (already included in prices).
											</p>
											<div className="salesDefaults__switch">
												<SwitchRhf<GetPurchaseDefaults>
													register={register}
													label={inclusiveTaxRate ? "Inclusive" : "Exclusive"}
													id="defaultTaxRateId"
													name="isDefaultTaxRateInclusive"
													error={errors.isDefaultTaxRateInclusive?.message}
												/>
											</div>
										</div>
										<div className="salesDefaults__card">
											<h2 className="salesDefaults__title salesDefaults__title--withPadding">
												Limit Product Search by Supplier
											</h2>
											<p className="salesDefaults__text">
												Filters product search to display only items linked to the selected supplier.
											</p>
											<div className="salesDefaults__switch">
												<SwitchRhf<GetPurchaseDefaults>
													register={register}
													label="Off"
													name="limitProductBySupplier"
													id="limitProductBySupplierId"
													error={errors.limitProductBySupplier?.message}
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

export default PurchaseDefaults;
