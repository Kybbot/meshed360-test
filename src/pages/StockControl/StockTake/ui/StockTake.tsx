import { FC, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { Link, useNavigate, useParams } from "react-router";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useGetStockTakeById } from "../api/queries/useGetStockTakeById";
import { useGetProductNames } from "../../StockAdjustment/api/queries/useGetProductNames";
import { useGetWarehousesAccounts } from "../../StockAdjustment/api/queries/useGetWarehousesAccounts";

import { useSaveStockTake } from "../api/mutations/useSaveStockTake";
import { useUndoStockTake } from "../api/mutations/useUndoStockTake";
import { useVoidStockTake } from "../api/mutations/useVoidStockTake";
import { useStartStockTake } from "../api/mutations/useStartStockTake";
import { useCreateStockTake } from "../api/mutations/useCreateStockTake";
import { useCompleteStockTake } from "../api/mutations/useCompleteStockTake";

import { denormalizeStockTakeData, normalizeStockTakeData } from "../utils/getNormalizedStockTakeData";

import { usePageDetails } from "@/hooks/useAddPageDetails";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import {
	StockTakeFormValues,
	StockControlStatuses,
	DefaultStockTakeAdditionLine,
	DefaultStockTakeModificationLine,
} from "@/@types/stockControl";
import { SelectOption } from "@/@types/selects";

import * as Tabs from "@radix-ui/react-tabs";
import StockTakeAdditionLines from "./tabs/StockTakeAdditionLines";
import StockTakeModificationLines from "./tabs/StockTakeModificationLines";

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
import { Checkbox } from "@/components/shared/form/Checkbox";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

import { orgStore } from "@/app/stores/orgStore";

import { useOrganisationError } from "@/hooks/useOrganisationError";

type StockTakeProps = {
	isAdd?: boolean;
};

const StockTake: FC<StockTakeProps> = ({ isAdd = false }) => {
	const navigate = useNavigate();
	const firstRender = useRef(true);
	const { orgId } = useStore(orgStore);
	const { stockTakeId } = useParams();
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const currentStateRef = useRef<"save" | "complete">();

	const [activeTab, setActiveTab] = useState("modificationLines");
	const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([]);
	const [brandsOptions, setBrandsOptions] = useState<SelectOption[]>([]);
	const [includeOnHand, setIncludeOnHand] = useState(
		() => localStorage.getItem("stockTakeIncludeOnHand") !== "false",
	);

	const formRef = useRef<HTMLFormElement>(null);

	const tabsNames = {
		additionLines: "additionLines",
		modificationLines: "modificationLines",
	};

	const tabsNav = [
		{ content: "Adjust Current Stock", name: tabsNames.modificationLines },
		{ content: "Add New Stock", name: tabsNames.additionLines },
	];

	const { data, error, isError, isLoading, isSuccess } = useGetStockTakeById({
		organisationId: orgId,
		stockTakeId,
	});

	useOrganisationError(isError, error);

	const {
		data: warehousesAccountsData,
		error: warehousesAccountsError,
		isError: isWarehousesAccountsError,
		isSuccess: isWarehousesAccountsSuccess,
		isLoading: isWarehousesAccountsLoading,
	} = useGetWarehousesAccounts({ organisationId: orgId });

	const {
		isPending,
		data: createData,
		isSuccess: isCreateSuccess,
		mutate: createStockTake,
	} = useCreateStockTake();

	const {
		isPending: isCompletePending,
		mutate: completeStockTake,
		isSuccess: isCompleteSuccess,
		data: completeData,
	} = useCompleteStockTake();
	const { mutate: undoStockTake } = useUndoStockTake();
	const { mutate: saveStockTake } = useSaveStockTake();
	const { isPending: isStartPending, mutate: startStockTake } = useStartStockTake();
	const { mutate: voidStockTake, isSuccess: isVoidSuccess, data: voidData } = useVoidStockTake();

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<StockTakeFormValues>({
		defaultValues: {
			account: undefined,
			warehouse: undefined,
			brand: undefined,
			category: undefined,
			effectiveDate: new Date(),
			reference: "",
			additionLines: [DefaultStockTakeAdditionLine],
			modificationLines: [DefaultStockTakeModificationLine],
		},
	});

	const locationId = useWatch({ control, name: "warehouse.id" });

	const { data: productsData } = useGetProductNames({
		organisationId: orgId,
		locationId,
	});

	useEffect(() => {
		if (isAdd || !productsData?.data || brandsOptions.length > 0 || categoriesOptions.length > 0) return;
		const brandsMap = new Map<string, SelectOption>();
		const categoriesMap = new Map<string, SelectOption>();

		for (const product of productsData.data) {
			if (product.brand?.id) {
				brandsMap.set(product.brand.id, {
					id: product.brand.id,
					name: product.brand.name,
				});
			}
			if (product.category?.id) {
				categoriesMap.set(product.category.id, {
					id: product.category.id,
					name: product.category.name,
				});
			}
		}

		setBrandsOptions(Array.from(brandsMap.values()));
		setCategoriesOptions(Array.from(categoriesMap.values()));
	}, [brandsOptions.length, categoriesOptions.length, isAdd, productsData]);

	const onSubmit = (formData: StockTakeFormValues) => {
		if (!orgId) return;

		const data = normalizeStockTakeData(formData);

		if (isAdd) {
			createStockTake({
				organisationId: orgId,
				body: data,
			});
		} else if (stockTakeId) {
			if (currentStateRef.current === "complete") {
				saveStockTake(
					{
						organisationId: orgId,
						stockTakeId,
						body: data,
						options: { showSuccessToast: false },
					},
					{
						onSuccess: (res) => {
							if (res.data.stockTake.id) {
								completeStockTake({ organisationId: orgId, stockTakeId });
							}
							currentStateRef.current = undefined;
						},
						onError: () => {
							currentStateRef.current = undefined;
						},
					},
				);
			} else {
				saveStockTake({
					organisationId: orgId,
					stockTakeId,
					body: data,
				});
				currentStateRef.current = undefined;
			}
		}
	};

	const handleActions = (type: "undo" | "void" | "start" | "complete") => {
		if (!orgId || !stockTakeId) return;

		switch (type) {
			case "undo":
				undoStockTake({ organisationId: orgId, stockTakeId });
				break;
			case "void":
				voidStockTake({ organisationId: orgId, stockTakeId });
				break;
			case "start":
				startStockTake({ organisationId: orgId, stockTakeId });
				break;
		}
	};

	const handleIncludeOnHandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		setIncludeOnHand(checked);
		localStorage.setItem("stockTakeIncludeOnHand", String(checked));
	};

	useEffect(() => {
		if (isSuccess && data.data && firstRender.current) {
			const trackingCategoryAOptions = userAndOrgInfo?.trackingCategoryAFiltered?.categories ?? [];
			const trackingCategoryBOptions = userAndOrgInfo?.trackingCategoryBFiltered?.categories ?? [];
			reset(
				denormalizeStockTakeData(data.data.stockTake, trackingCategoryAOptions, trackingCategoryBOptions),
				{ keepDefaultValues: true },
			);
			firstRender.current = false;
		}
	}, [isSuccess, data, reset, userAndOrgInfo]);

	useEffect(() => {
		if ((isVoidSuccess && voidData?.data) || (isCompleteSuccess && completeData?.data)) {
			navigate("/inventory/stockControl");
		}
	}, [isVoidSuccess, voidData, navigate, isCompleteSuccess, completeData]);

	useEffect(() => {
		if (isCreateSuccess && createData?.data.stockTake.id) {
			navigate(`/inventory/stockTake/edit/${createData.data.stockTake.id}`);
		}
	}, [isCreateSuccess, createData, navigate]);

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");

	return (
		<form ref={formRef} className="main__sections" onSubmit={handleSubmit(onSubmit)}>
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader withoutDec>
						<CommonPageSubWrapper>
							{data?.data.stockTake.status && (
								<CommonPageStatus
									isYellow={
										data.data.stockTake.status === "DRAFT" || data.data.stockTake.status === "IN_PROGRESS"
									}
									isGreen={data.data.stockTake.status === "COMPLETED"}
									isRed={data.data.stockTake.status === "VOID"}
								>
									{StockControlStatuses[data.data.stockTake.status]}
								</CommonPageStatus>
							)}
							<CommonPageTitle>Stock Take</CommonPageTitle>
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
								<>
									{data?.data.stockTake.status === "DRAFT" && (
										<Button
											type="button"
											isSecondary
											isLoading={isStartPending}
											disabled={isStartPending}
											onClick={() => handleActions("start")}
										>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#start" />
											</svg>
											Start
										</Button>
									)}
									{data?.data.stockTake.status === "IN_PROGRESS" && (
										<Button
											type="button"
											isSecondary
											isLoading={isCompletePending}
											disabled={isCompletePending}
											onClick={() => {
												if (formRef.current) {
													currentStateRef.current = "complete";
													formRef.current.requestSubmit();
												}
											}}
										>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#complete" />
											</svg>
											Complete
										</Button>
									)}
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
											{data?.data.stockTake.status === "IN_PROGRESS" && (
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
											{data?.data.stockTake.status === "DRAFT" && (
												<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
													Void
												</DropdownMenuItem>
											)}
											{(data?.data.stockTake.status === "COMPLETED" ||
												data?.data.stockTake.status === "IN_PROGRESS") && (
												<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
													Undo
												</DropdownMenuItem>
											)}
										</DropdownMenu>
									</DropdownMenuRoot>
								</>
							)}
							<CommonPageLine />
							<CommonPageArrow type="button" isOpen={isOpen} onClick={handleOpenClose} />
						</CommonPageActions>
					</CommonPageHeader>
					<CommonPageMain ref={contentRef} isActive height={height} isOpen={isOpen}>
						{isWarehousesAccountsLoading || isLoading ? (
							<Loader isFullWidth />
						) : isError && error ? (
							<ErrorMessage error={error} />
						) : isWarehousesAccountsError && warehousesAccountsError ? (
							<ErrorMessage error={warehousesAccountsError} />
						) : (isAdd && isWarehousesAccountsSuccess && warehousesAccountsData?.data) ||
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
													value={field.value}
													placeholder="Effective Date*"
													onValueChange={field.onChange}
													disabled={!isAdd}
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
												value={field.value}
												id="accountSelector"
												placeholder="Expense account*"
												onValueChange={field.onChange}
												error={errors.account?.message}
												disabled={!isAdd}
												customValues={warehousesAccountsData?.data.accounts}
											/>
										)}
									/>
									<InputRhf<StockTakeFormValues>
										type="text"
										name="reference"
										id="referenceId"
										label="Reference"
										register={register}
										disabled={!isAdd}
										error={errors.reference?.message}
									/>
								</fieldset>
								<fieldset className="form__fieldset">
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
												value={field.value}
												id="warehouseSelector"
												placeholder="Location*"
												onValueChange={field.onChange}
												disabled={!isAdd}
												error={errors.warehouse?.message}
												customValues={warehousesAccountsData?.data.warehouses}
											/>
										)}
									/>
									{activeTab !== "additionLines" && (
										<>
											<Controller
												name="brand"
												control={control}
												render={({ field }) => (
													<CustomSelect
														useSearch
														{...field}
														value={field.value}
														id="brandSelector"
														placeholder="Brand"
														error={errors.brand?.message}
														onValueChange={field.onChange}
														customValues={brandsOptions}
														disabled={data?.data.stockTake.status !== "IN_PROGRESS"}
													/>
												)}
											/>
											<Controller
												name="category"
												control={control}
												render={({ field }) => (
													<CustomSelect
														useSearch
														{...field}
														value={field.value}
														id="categorySelector"
														placeholder="Category"
														onValueChange={field.onChange}
														error={errors.category?.message}
														customValues={categoriesOptions}
														disabled={data?.data.stockTake.status !== "IN_PROGRESS"}
													/>
												)}
											/>
										</>
									)}
								</fieldset>
								{activeTab !== "additionLines" && data?.data.stockTake.status !== "IN_PROGRESS" && (
									<Checkbox
										id="includeOnHandCheckbox"
										label="Include Quantity On Hand"
										checked={includeOnHand}
										onChange={handleIncludeOnHandChange}
									/>
								)}
							</div>
						) : (
							<p className="empty_list">No data available</p>
						)}
					</CommonPageMain>
				</div>
			</CommonPage>

			<CommonPage>
				<div className="main__container">
					<Tabs.Root className="tabs" value={activeTab} onValueChange={setActiveTab}>
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
								<StockTakeModificationLines
									watch={watch}
									errors={errors}
									control={control}
									setValue={setValue}
									register={register}
									productsData={productsData?.data}
									status={data?.data.stockTake.status}
									includeOnHand={includeOnHand}
								/>
							</Tabs.Content>
						)}
						<Tabs.Content value={tabsNames.additionLines}>
							<StockTakeAdditionLines
								watch={watch}
								errors={errors}
								control={control}
								setValue={setValue}
								register={register}
								status={data?.data.stockTake.status}
								isDisabled={data?.data.stockTake.status !== "IN_PROGRESS"}
							/>
						</Tabs.Content>
					</Tabs.Root>
				</div>
			</CommonPage>
		</form>
	);
};

export default StockTake;
