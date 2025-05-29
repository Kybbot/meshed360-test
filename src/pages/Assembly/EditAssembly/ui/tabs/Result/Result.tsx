import { FC, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { TableDayPickerRhf } from "@/components/shared/form/TableDayPickerRhf";

import {
	CommonPageMain,
	CommonPageTitle,
	CommonPageHeader,
	CommonPageStatus,
	CommonPageWrapper,
	CommonPageActions,
	CommonPageSubWrapper,
} from "@/components/widgets/Page";
import {
	TF,
	TFTr,
	TFTh,
	TFTd,
	TFTable,
	TFThead,
	TFTbody,
	TFWrapper,
	TFOverflow,
} from "@/components/widgets/Table";

import {
	useGetAssemblyResult,
	useSaveAssemblyResult,
	useUndoAssemblyResult,
	useVoidAssemblyResult,
	useAuthoriseAssemblyResult,
	useGetAssemblyPick,
} from "@/entities/assembly";

import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";
import { getDateFromDayPickerDate, getFormDayPickerDate } from "@/utils/date";

import { ProductType } from "@/@types/products";
import { AssemblyByIdType } from "@/@types/assembly/assembly";
import { AssemblyResultFormValues, AssemblyResultLineType } from "@/@types/assembly/result";

type Props = {
	products: ProductType[];
	assemblyData: AssemblyByIdType;
};

export const Result: FC<Props> = ({ products, assemblyData }) => {
	const assemblyId = assemblyData.id;
	const assemblyStatus = assemblyData.status;

	const isFirstResetRef = useRef(true);
	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const { mutate: undo, isPending: isUndoPending } = useUndoAssemblyResult();
	const { mutateAsync: save, isPending: isSavePending } = useSaveAssemblyResult();
	const { mutate: mutateVoid, isPending: isVoidPending } = useVoidAssemblyResult();
	const { mutate: authorise, isPending: isAuthorisePending } = useAuthoriseAssemblyResult();

	const {
		data: pickData,
		error: pickError,
		isError: isPickError,
		isLoading: isPickLoading,
		isSuccess: isPickSuccess,
	} = useGetAssemblyPick({ assemblyId: assemblyStatus === "PICKED" ? assemblyId : undefined });
	const { data, error, isError, isLoading, isSuccess } = useGetAssemblyResult({ assemblyId });

	const assemblyResultStatus = data?.data.resultStatus;
	const isActionLoading = isSavePending || isUndoPending || isAuthorisePending || isVoidPending;

	const disableField = assemblyStatus !== "PICKED" || assemblyResultStatus === "AUTHORIZED";
	const disabledActions =
		assemblyStatus === "DRAFT" || assemblyStatus === "AUTHORISED" || assemblyStatus === "PICKING";

	const productData = useMemo(() => {
		if (products.length > 0) {
			return products.find((product) => product.id === assemblyData.product.id);
		}
	}, [products, assemblyData]);

	const totalCost = useMemo(() => {
		if (isPickSuccess && pickData.data) {
			let sum = 0;

			for (const line of pickData.data.lines) {
				sum += +line.quantity * +line.cost;
			}

			for (const line of assemblyData.serviceLines) {
				sum += +line.totalCost;
			}

			return sum;
		}

		return 0;
	}, [isPickSuccess, pickData, assemblyData]);

	const {
		reset,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AssemblyResultFormValues>({
		defaultValues: {
			batchNumber: "",
			expiryDate: undefined,
			actualYield: assemblyData.quantity,
		},
	});

	const handleActions = async (type: "undo" | "void") => {
		if (assemblyId) {
			switch (type) {
				case "undo":
					undo({ body: { id: assemblyId } });
					break;
				case "void":
					mutateVoid(
						{ body: { id: assemblyId } },
						{
							onSuccess() {
								reset(
									{
										batchNumber: "",
										expiryDate: undefined,
										actualYield: assemblyData.quantity,
									},
									{ keepDefaultValues: true },
								);
							},
						},
					);
					break;
			}
		}
	};

	const onSubmit = async (formData: AssemblyResultFormValues) => {
		if (assemblyId) {
			const newData: AssemblyResultLineType = {
				id: "",
				product: { id: assemblyData.product.id, name: assemblyData.product.name },
				uom:
					productData && productData.unitOfMeasure
						? { id: productData.unitOfMeasure.id, name: productData.unitOfMeasure.name }
						: null,
				batchNumber: formData.batchNumber || null,
				expiryDate: formData.expiryDate ? getFormDayPickerDate(formData.expiryDate, true) : null,
				actualYield: formData.actualYield,
				totalCost: totalCost.toFixed(2),
			};

			await save({
				newData,
				body: {
					orderId: assemblyId,
					...(formData.batchNumber ? { batchNumber: formData.batchNumber } : {}),
					...(formData.expiryDate ? { expiryDate: getFormDayPickerDate(formData.expiryDate, true) } : {}),
					actualYield: formData.actualYield,
				},
			});

			if (currentStateRef.current === "authorise") {
				authorise({ body: { id: assemblyId } });
			}
		}
	};

	useEffect(() => {
		if (isFirstResetRef.current && isSuccess && data) {
			reset(
				{
					batchNumber: data.data.lines?.[0]?.batchNumber || "",
					expiryDate: data.data.lines?.[0]?.expiryDate
						? getDateFromDayPickerDate(data.data.lines[0].expiryDate)
						: undefined,
					actualYield: data.data.lines?.[0]?.actualYield || assemblyData.quantity,
				},
				{ keepDefaultValues: true },
			);

			isFirstResetRef.current = false;
		}
	}, [isSuccess, data, assemblyData, reset]);

	return (
		<CommonPageWrapper>
			{isLoading || isPickLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isPickError && pickError ? (
				<ErrorMessage error={pickError} />
			) : isSuccess && data.data ? (
				<>
					<CommonPageHeader>
						<CommonPageSubWrapper>
							{data.data.resultStatus && data.data.lines.length > 0 ? (
								<CommonPageStatus
									isYellow={data.data.resultStatus === "DRAFT"}
									isGreen={data.data.resultStatus === "AUTHORIZED"}
								>
									{data.data.resultStatus.toLowerCase()}
								</CommonPageStatus>
							) : (
								<CommonPageStatus>New</CommonPageStatus>
							)}
							<CommonPageTitle>Result</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							{!disabledActions && (
								<DropdownMenuRoot modal={false}>
									<DropdownMenuTrigger asChild>
										<Button type="button" isLoading={isActionLoading} disabled={isActionLoading}>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#dotsInCicle" />
											</svg>
											Actions
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
										{assemblyResultStatus !== "AUTHORIZED" && (
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
										{assemblyResultStatus && assemblyResultStatus !== "AUTHORIZED" && (
											<DropdownMenuItem
												className="dropDown__item"
												onSelect={() => {
													if (formRef.current) {
														currentStateRef.current = "authorise";
														formRef.current.requestSubmit();
													}
												}}
											>
												Authorise
											</DropdownMenuItem>
										)}
										{assemblyResultStatus === "AUTHORIZED" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
												Undo
											</DropdownMenuItem>
										)}
										{data.data.lines.length > 0 && assemblyResultStatus === "DRAFT" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
												Void
											</DropdownMenuItem>
										)}
									</DropdownMenu>
								</DropdownMenuRoot>
							)}
						</CommonPageActions>
					</CommonPageHeader>
					<CommonPageMain>
						<form
							ref={formRef}
							id="assemblyResultOrderForm"
							className="commonPage__main"
							onSubmit={handleSubmit(onSubmit)}
						>
							<TF>
								<TFWrapper>
									<TFOverflow>
										<TFTable>
											<TFThead>
												<TFTr>
													<TFTh style={{ width: "16.6%" }}>Product</TFTh>
													<TFTh style={{ width: "16.6%" }}>Unit of Measure</TFTh>
													<TFTh style={{ width: "16.6%" }}>Batch</TFTh>
													<TFTh style={{ width: "16.6%" }}>Expiry Date</TFTh>
													<TFTh style={{ width: "16.6%" }}>Actual Yield</TFTh>
													<TFTh style={{ width: "16.6%" }}>Total Cost</TFTh>
												</TFTr>
											</TFThead>
											<TFTbody>
												<TFTr>
													<TFTd isText>
														{data.data.lines?.[0]?.product?.name || assemblyData.product.name}
													</TFTd>
													<TFTd isText>
														{data.data.lines?.[0]?.uom?.name || productData?.unitOfMeasure?.name || "-"}
													</TFTd>
													<TFTd>
														<TableInputRhf<AssemblyResultFormValues>
															type="text"
															label="Batch"
															name="batchNumber"
															id="batchNumberId"
															register={register}
															disabled={disableField}
															error={errors?.batchNumber?.message}
															rules={{
																required: {
																	message: "Required",
																	value: productData?.costingMethod?.includes("BATCH") || false,
																},
															}}
														/>
													</TFTd>
													<TFTd>
														<Controller
															control={control}
															name="expiryDate"
															render={({ field }) => {
																return (
																	<TableDayPickerRhf
																		{...field}
																		value={field.value}
																		disabled={disableField}
																		placeholder="dd/mm/yyyy"
																		onValueChange={field.onChange}
																		error={errors?.expiryDate?.message}
																	/>
																);
															}}
														/>
													</TFTd>
													<TFTd>
														<TableInputRhf<AssemblyResultFormValues>
															step={0.01}
															type="number"
															register={register}
															label="Actual Yield"
															disabled={disableField}
															rules={{
																min: 0,
																required: "Required",
																onChange(event) {
																	const value = +event.target.value;

																	if (value < 0) {
																		setValue("actualYield", "0");
																	}
																},
															}}
															id="actualYieldId"
															name="actualYield"
															error={errors?.actualYield?.message}
														/>
													</TFTd>
													<TFTd isText>
														{formatNumberToCurrency(data.data.lines?.[0]?.totalCost || totalCost)}
													</TFTd>
												</TFTr>
											</TFTbody>
										</TFTable>
									</TFOverflow>
								</TFWrapper>
							</TF>
						</form>
					</CommonPageMain>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
