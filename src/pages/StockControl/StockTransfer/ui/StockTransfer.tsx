import { FC, useEffect, useRef } from "react";
import { useStore } from "zustand";
import { Link, useNavigate, useParams } from "react-router";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useGetStockTransferById } from "../api/queries/useGetStockTransferById";
import { useGetWarehousesAccounts } from "../../StockAdjustment/api/queries/useGetWarehousesAccounts";

import { useSaveStockTransfer } from "../api/mutations/useSaveStockTransfer";
import { useUndoStockTransfer } from "../api/mutations/useUndoStockTransfer";
import { useVoidStockTransfer } from "../api/mutations/useVoidStockTransfer";
import { useCreateStockTransfer } from "../api/mutations/useCreateStockTransfer";
import { useAuthorizeStockTransfer } from "../api/mutations/useAuthorizeStockTransfer";

import {
	normalizeStockTransferData,
	denormalizeStockTransferData,
} from "../utils/getNormalizedStockTransferData";

import { usePageDetails } from "@/hooks/useAddPageDetails";

import {
	StockControlStatuses,
	StockTransferFormValues,
	DefaultStockTransferLine,
} from "@/@types/stockControl";

import StockTransferLines from "./StockTransferLines";

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

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { orgStore } from "@/app/stores/orgStore";

import { useOrganisationError } from "@/hooks/useOrganisationError";

type StockTransferProps = {
	isAdd?: boolean;
};

const StockTransfer: FC<StockTransferProps> = ({ isAdd = false }) => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);
	const firstRender = useRef(true);
	const { stockTransferId } = useParams();
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const currentStateRef = useRef<"save" | "authorize">();

	const formRef = useRef<HTMLFormElement>(null);

	const { data, error, isError, isLoading, isSuccess } = useGetStockTransferById({
		organisationId: orgId,
		stockTransferId,
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
		mutate: createStockTransfer,
	} = useCreateStockTransfer();

	const {
		mutate: authorize,
		isSuccess: isAuthorizeSuccess,
		data: authorizeData,
	} = useAuthorizeStockTransfer();
	const { mutate: undo } = useUndoStockTransfer();
	const { mutate: saveStockTransfer } = useSaveStockTransfer();
	const { mutate: voidTransfer, isSuccess: isVoidSuccess, data: voidData } = useVoidStockTransfer();

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<StockTransferFormValues>({
		defaultValues: {
			sourceLocation: undefined,
			destinationLocation: undefined,
			effectiveDate: new Date(),
			reference: "",
			lines: [DefaultStockTransferLine],
		},
	});

	const sourceLocation = useWatch({ control, name: "sourceLocation" });
	const destinationLocation = useWatch({ control, name: "destinationLocation" });
	const isDisabled = data?.data.stockTransfer.status === "COMPLETED";

	const onSubmit = (formData: StockTransferFormValues) => {
		if (!orgId) return;

		const data = normalizeStockTransferData(formData);

		if (isAdd) {
			createStockTransfer({
				organisationId: orgId,
				body: data,
			});
		} else if (stockTransferId) {
			if (currentStateRef.current === "authorize") {
				saveStockTransfer(
					{
						organisationId: orgId,
						stockTransferId,
						body: data,
						options: { showSuccessToast: false },
					},
					{
						onSuccess: () => {
							authorize({ organisationId: orgId, stockTransferId });
							currentStateRef.current = undefined;
						},
						onError: () => {
							currentStateRef.current = undefined;
						},
					},
				);
			} else {
				saveStockTransfer({
					organisationId: orgId,
					stockTransferId,
					body: data,
				});
				currentStateRef.current = undefined;
			}
		}
	};

	const handleActions = (type: "undo" | "void" | "authorize") => {
		if (!orgId || !stockTransferId) return;

		switch (type) {
			case "undo":
				undo({ organisationId: orgId, stockTransferId });
				break;
			case "void":
				voidTransfer({ organisationId: orgId, stockTransferId });
				break;
		}
	};

	useEffect(() => {
		if (isSuccess && data.data && firstRender.current) {
			const trackingCategoryAOptions = userAndOrgInfo?.trackingCategoryAFiltered?.categories ?? [];
			const trackingCategoryBOptions = userAndOrgInfo?.trackingCategoryBFiltered?.categories ?? [];
			reset(
				denormalizeStockTransferData(
					data.data.stockTransfer,
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
		if (isCreateSuccess && createData?.data.stockTransfer.id) {
			navigate(`/inventory/stockTransfer/edit/${createData.data.stockTransfer.id}`);
		}
	}, [isCreateSuccess, createData, navigate]);

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");

	return (
		<form ref={formRef} className="main__sections" onSubmit={handleSubmit(onSubmit)}>
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader withoutDec>
						<CommonPageSubWrapper>
							{data?.data.stockTransfer.status && (
								<CommonPageStatus
									isYellow={data.data.stockTransfer.status === "DRAFT"}
									isGreen={data.data.stockTransfer.status === "COMPLETED"}
									isRed={data.data.stockTransfer.status === "VOID"}
								>
									{StockControlStatuses[data.data.stockTransfer.status]}
								</CommonPageStatus>
							)}
							<CommonPageTitle>Transfer Stock</CommonPageTitle>
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
										{data?.data.stockTransfer.status === "DRAFT" && (
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
										{data?.data.stockTransfer.status === "DRAFT" && (
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
										{data?.data.stockTransfer.status === "DRAFT" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
												Void
											</DropdownMenuItem>
										)}
										{data?.data.stockTransfer.status === "COMPLETED" && (
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
										name="sourceLocation"
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
												placeholder="From*"
												onValueChange={field.onChange}
												error={errors.sourceLocation?.message}
												customValues={selectorsData?.data.warehouses.filter(
													(warehouse) => warehouse.id !== destinationLocation?.id,
												)}
											/>
										)}
									/>
									<Controller
										name="destinationLocation"
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
												id="destinationWarehouseSelector"
												placeholder="To*"
												onValueChange={field.onChange}
												error={errors.destinationLocation?.message}
												customValues={selectorsData?.data.warehouses.filter(
													(warehouse) => warehouse.id !== sourceLocation?.id,
												)}
											/>
										)}
									/>
								</fieldset>
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
													placeholder="Effective Date*"
													onValueChange={field.onChange}
													error={errors.effectiveDate?.message}
												/>
											);
										}}
									/>
									<InputRhf<StockTransferFormValues>
										type="text"
										name="reference"
										id="referenceId"
										label="Reference"
										disabled={!isAdd || isDisabled}
										register={register}
										error={errors.reference?.message}
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
					{isLoading ? (
						<Loader isFullWidth />
					) : isError ? (
						<ErrorMessage error={error} />
					) : (
						<StockTransferLines
							watch={watch}
							isAdd={isAdd}
							errors={errors}
							control={control}
							setValue={setValue}
							register={register}
							isDisabled={isDisabled}
						/>
					)}
				</div>
			</CommonPage>
		</form>
	);
};

export default StockTransfer;
