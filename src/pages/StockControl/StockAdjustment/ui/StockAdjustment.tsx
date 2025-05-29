import { FC, useEffect, useRef } from "react";
import { useStore } from "zustand";
import { Link, useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { useGetWarehousesAccounts } from "../api/queries/useGetWarehousesAccounts";
import { useGetStockAdjustmentById } from "../api/queries/useGetStockAdjustmentById";

import { useVoidStockAdjustment } from "../api/mutations/useVoidStockAdjustment";
import { useUndoStockAdjustment } from "../api/mutations/useUndoStockAdjustment";
import { useSaveStockAdjustment } from "../api/mutations/useSaveStockAdjustment";
import { useCreateStockAdjustment } from "../api/mutations/useCreateStockAdjustment";
import { useAuthorizeStockAdjustment } from "../api/mutations/useAuthorizeStockAdjustment";

import {
	normalizeStockAdjustmentData,
	denormalizeStockAdjustmentData,
} from "../utils/getNormalizedStockAdjustmentData";

import { usePageDetails } from "@/hooks/useAddPageDetails";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import {
	StockControlStatuses,
	DefaultModificationLine,
	StockAdjustmentFormValues,
	DefaultAdditionLine,
} from "@/@types/stockControl";

import * as Tabs from "@radix-ui/react-tabs";
import StockAdjustmentAdditionLines from "./tabs/StockAdjustmentAdditionLines";
import StockAdjustmentModificationLines from "./tabs/StockAdjustmentModificationLines";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import {
	CommonPage,
	CommonPageLine,
	CommonPageMain,
	CommonPageTitle,
	CommonPageArrow,
	CommonPageStatus,
	CommonPageHeader,
	CommonPageActions,
	CommonPageSubWrapper,
} from "@/components/widgets/Page";

import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

import { orgStore } from "@/app/stores/orgStore";

import { useOrganisationError } from "@/hooks/useOrganisationError";

type StockAdjustmentProps = {
	isAdd?: boolean;
};

const StockAdjustment: FC<StockAdjustmentProps> = ({ isAdd = false }) => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);
	const firstRender = useRef(true);
	const { stockAdjustmentId } = useParams();
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const currentStateRef = useRef<"save" | "authorize">();

	const formRef = useRef<HTMLFormElement>(null);

	const tabsNames = {
		additionLines: "additionLines",
		modificationLines: "modificationLines",
	};

	const tabsNav = [
		{ content: "Adjust Current Stock", name: tabsNames.modificationLines },
		{ content: "Add New Stock", name: tabsNames.additionLines },
	];

	const { data, error, isError, isLoading, isSuccess } = useGetStockAdjustmentById({
		organisationId: orgId,
		stockAdjustmentId,
	});

	useOrganisationError(isError, error);

	const {
		data: selectorsData,
		error: selectorsError,
		isError: isSelectorsError,
		isSuccess: isSelectorsSuccess,
		isLoading: isSelectorsLoading,
	} = useGetWarehousesAccounts({ organisationId: orgId });

	const {
		isPending,
		data: createData,
		isSuccess: isCreateSuccess,
		mutate: createStockAdjustment,
	} = useCreateStockAdjustment();

	const {
		mutate: authorize,
		isSuccess: isAuthorizeSuccess,
		data: authorizeData,
	} = useAuthorizeStockAdjustment();
	const { mutate: undo } = useUndoStockAdjustment();
	const { mutate: saveStockAdjustment } = useSaveStockAdjustment();
	const { mutate: voidAdjustment, isSuccess: isVoidSuccess, data: voidData } = useVoidStockAdjustment();

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<StockAdjustmentFormValues>({
		defaultValues: {
			account: undefined,
			warehouse: undefined,
			effectiveDate: new Date(),
			reference: "",
			additionLines: [DefaultAdditionLine],
			modificationLines: [DefaultModificationLine],
		},
	});

	const isDisabled = data?.data.stockAdjustment.status === "COMPLETED";

	const onSubmit = (formData: StockAdjustmentFormValues) => {
		if (!orgId) return;

		const data = normalizeStockAdjustmentData(formData);

		if (isAdd) {
			createStockAdjustment({
				organisationId: orgId,
				body: data,
			});
		} else if (stockAdjustmentId) {
			if (currentStateRef.current === "authorize") {
				saveStockAdjustment(
					{
						organisationId: orgId,
						stockAdjustmentId,
						body: data,
						options: { showSuccessToast: false },
					},
					{
						onSuccess: () => {
							authorize({ organisationId: orgId, stockAdjustmentId });
							currentStateRef.current = undefined;
						},
						onError: () => {
							currentStateRef.current = undefined;
						},
					},
				);
			} else {
				saveStockAdjustment({
					organisationId: orgId,
					stockAdjustmentId,
					body: data,
				});
				currentStateRef.current = undefined;
			}
		}
	};

	const handleActions = (type: "undo" | "void" | "authorize") => {
		if (!orgId || !stockAdjustmentId) return;

		switch (type) {
			case "undo":
				undo({ organisationId: orgId, stockAdjustmentId });
				break;
			case "void":
				voidAdjustment({ organisationId: orgId, stockAdjustmentId });
				break;
		}
	};

	useEffect(() => {
		if (isSuccess && data.data && firstRender.current) {
			const trackingCategoryAOptions = userAndOrgInfo?.trackingCategoryAFiltered?.categories ?? [];
			const trackingCategoryBOptions = userAndOrgInfo?.trackingCategoryBFiltered?.categories ?? [];
			reset(
				denormalizeStockAdjustmentData(
					data.data.stockAdjustment,
					trackingCategoryAOptions,
					trackingCategoryBOptions,
				),
				{ keepDefaultValues: true },
			);
			firstRender.current = false;
		}
	}, [isSuccess, data, reset, userAndOrgInfo]);

	useEffect(() => {
		if ((isVoidSuccess && voidData?.data) || (isAuthorizeSuccess && authorizeData?.data)) {
			navigate("/inventory/stockControl");
		}
	}, [isVoidSuccess, voidData, isAuthorizeSuccess, authorizeData, navigate]);

	useEffect(() => {
		if (isCreateSuccess && createData?.data.stockAdjustment.id) {
			navigate(`/inventory/stockAdjustment/edit/${createData.data.stockAdjustment.id}`);
		}
	}, [isCreateSuccess, createData, navigate]);

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");

	return (
		<form ref={formRef} className="main__sections" onSubmit={handleSubmit(onSubmit)}>
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader withoutDec>
						<CommonPageSubWrapper>
							{data?.data.stockAdjustment.status && (
								<CommonPageStatus
									isYellow={data.data.stockAdjustment.status === "DRAFT"}
									isGreen={data.data.stockAdjustment.status === "COMPLETED"}
									isRed={data.data.stockAdjustment.status === "VOID"}
								>
									{StockControlStatuses[data.data.stockAdjustment.status]}
								</CommonPageStatus>
							)}
							<CommonPageTitle>Stock Adjustments</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							<Link to="/inventory/stockControl" className="link link--secondary">
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#list" />
								</svg>
								Back to List
							</Link>
							{isAdd ? (
								<Button type="submit" isLoading={isPending} disabled={isPending}>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#plus" />
									</svg>
									Create
								</Button>
							) : (
								<DropdownMenuRoot modal={false}>
									<DropdownMenuTrigger asChild>
										<Button type="button">
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#dotsInCicle" />
											</svg>
											Actions
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
										{data?.data.stockAdjustment.status === "DRAFT" && (
											<DropdownMenuItem
												className="dropDown__item"
												onSelect={() => {
													if (formRef.current) {
														currentStateRef.current = "authorize";
														formRef.current.requestSubmit();
													}
												}}
											>
												Authorise
											</DropdownMenuItem>
										)}
										{data?.data.stockAdjustment.status === "DRAFT" && (
											<DropdownMenuItem
												className="dropDown__item"
												onSelect={() => {
													if (formRef.current) {
														currentStateRef.current = "save";
														formRef.current.requestSubmit();
													}
												}}
											>
												Save
											</DropdownMenuItem>
										)}
										{data?.data.stockAdjustment.status === "DRAFT" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
												Void
											</DropdownMenuItem>
										)}
										{data?.data.stockAdjustment.status === "COMPLETED" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
												Undo
											</DropdownMenuItem>
										)}
									</DropdownMenu>
								</DropdownMenuRoot>
							)}
							<CommonPageLine />
							<CommonPageArrow type="button" isOpen={isOpen} onClick={handleOpenClose} />
						</CommonPageActions>
					</CommonPageHeader>
					<CommonPageMain ref={contentRef} isActive height={height} isOpen={isOpen}>
						{isSelectorsLoading || isLoading ? (
							<Loader isFullWidth />
						) : isError && error ? (
							<ErrorMessage error={error} />
						) : isSelectorsError && selectorsError ? (
							<ErrorMessage error={selectorsError} />
						) : (isAdd && isSelectorsSuccess && selectorsData?.data) ||
						  (!isAdd && isSuccess && data?.data) ? (
							<div className="stockAdjustment__mainForm ">
								<fieldset className="form__fieldset">
									<Controller
										name="effectiveDate"
										control={control}
										rules={{
											required: "Required",
										}}
										render={({ field }) => {
											return (
												<FormDayPickerRhf
													{...field}
													disabled={!isAdd || isDisabled}
													value={field.value}
													disableBefore={new Date()}
													placeholder="Effective Date*"
													onValueChange={field.onChange}
													error={errors.effectiveDate?.message}
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
										render={({ field }) => (
											<CustomSelect
												useSearch
												{...field}
												disabled={!isAdd || isDisabled}
												value={field.value}
												id="accountSelector"
												placeholder="Expense account*"
												onValueChange={field.onChange}
												error={errors.account?.message}
												customValues={selectorsData?.data.accounts}
											/>
										)}
									/>
								</fieldset>
								<fieldset className="form__fieldset">
									<InputRhf<StockAdjustmentFormValues>
										type="text"
										name="reference"
										id="referenceId"
										label="Reference"
										disabled={!isAdd || isDisabled}
										register={register}
										error={errors.reference?.message}
									/>
									<Controller
										name="warehouse"
										control={control}
										rules={{
											required: "Required",
										}}
										render={({ field }) => (
											<CustomSelect
												useSearch
												{...field}
												disabled={!isAdd || isDisabled}
												value={field.value}
												id="warehouseSelector"
												placeholder="Location*"
												onValueChange={field.onChange}
												error={errors.warehouse?.message}
												customValues={selectorsData?.data.warehouses}
											/>
										)}
									/>
								</fieldset>
							</div>
						) : (
							<p className="empty_list">No data available</p>
						)}
					</CommonPageMain>
				</div>
			</CommonPage>

			<CommonPage>
				<div className="main__container">
					<Tabs.Root className="tabs" defaultValue={tabsNav[0].name}>
						<div className="tabs__header">
							<Tabs.List className="tabs__nav" aria-label="Additional Info">
								{tabsNav.map((item) => (
									<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
										{item.content}
									</Tabs.Trigger>
								))}
							</Tabs.List>
						</div>
						{isLoading ? (
							<Loader isFullWidth />
						) : isError ? (
							<ErrorMessage error={error} />
						) : (
							<Tabs.Content value={tabsNames.modificationLines}>
								<StockAdjustmentModificationLines
									watch={watch}
									isAdd={isAdd}
									errors={errors}
									control={control}
									setValue={setValue}
									register={register}
									isDisabled={isDisabled}
								/>
							</Tabs.Content>
						)}
						<Tabs.Content value={tabsNames.additionLines}>
							<StockAdjustmentAdditionLines
								watch={watch}
								isAdd={isAdd}
								errors={errors}
								control={control}
								setValue={setValue}
								register={register}
								isDisabled={isDisabled}
							/>
						</Tabs.Content>
					</Tabs.Root>
				</div>
			</CommonPage>
		</form>
	);
};

export default StockAdjustment;
