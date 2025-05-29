import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useFieldArray, useForm } from "react-hook-form";

import { PickLineRow } from "./ui/PickLineRow";

import { calculateTotalQuantity } from "../Order/utils/calculate";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPageMain,
	CommonPageTitle,
	CommonPageStatus,
	CommonPageHeader,
	CommonPageActions,
	CommonPageWrapper,
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
	TFAddRow,
	TFWrapper,
	TFOverflow,
} from "@/components/widgets/Table";

import {
	useGetAssemblyPick,
	useSaveAssemblyPick,
	useUndoAssemblyPick,
	useVoidAssemblyPick,
	useAuthoriseAssemblyPick,
} from "@/entities/assembly";

import { useGetPrintUrl } from "@/hooks/useGetPrintUrl";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import {
	AssemblyPickType,
	AssemblyPickFormValues,
	DefaultAssemblyPickLine,
	GetAutoPickResponseType,
	AssemblyPickLineFormType,
} from "@/@types/assembly/pick";
import { ProductType } from "@/@types/products";
import { WarehousType } from "@/@types/warehouses";
import { AssemblyByIdType } from "@/@types/assembly/assembly";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

const validateData = (data: AssemblyPickFormValues) => {
	const lines = data.lines;

	const lineStrings = lines.map((item) => {
		const { ...rest } = item;
		return JSON.stringify({ ...rest });
	});

	if (hasDuplicateStrings(lineStrings)) {
		toast.error("There are duplicates in the Lines!");
		return false;
	}

	return true;
};

type Props = {
	products: ProductType[];
	assemblyData: AssemblyByIdType;
};

export const Pick: FC<Props> = ({ products, assemblyData }) => {
	const assemblyId = assemblyData.id;
	const assemblyStatus = assemblyData.status;
	const defaultWarehouse = assemblyData.warehouse;

	const isFirstResetRef = useRef(true);
	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const [loadingAutoPick, setLoadingAutoPick] = useState(false);

	const { isLoadingPrintUrl, getPrintUrlData } = useGetPrintUrl("AssemblyOrderPick");

	const { mutateAsync } = useSaveAssemblyPick();
	const { mutate: undo } = useUndoAssemblyPick();
	const { mutate: mutateVoid } = useVoidAssemblyPick();
	const { mutate: authorise } = useAuthoriseAssemblyPick();

	const { data, error, isError, isLoading, isSuccess } = useGetAssemblyPick({ assemblyId });

	const currentPickStatus = data?.data.pickStatus;

	const disabledStatus =
		assemblyStatus === "DRAFT" || assemblyStatus === "CLOSED" || currentPickStatus === "AUTHORIZED";
	const disabledActions = assemblyStatus === "DRAFT" || assemblyStatus === "CLOSED";
	const disabledAutoPick =
		assemblyStatus === "DRAFT" || assemblyStatus === "CLOSED" || currentPickStatus === "AUTHORIZED";

	const selectProducts = useMemo(() => {
		if (assemblyData.status !== "DRAFT") {
			return assemblyData.lines.map((line) => {
				const productData = products.find((item) => item.id === line.product.id);

				if (productData) {
					return { ...productData, ...line.product };
				}

				return { ...line.product };
			});
		}

		return [];
	}, [products, assemblyData]);

	const {
		reset,
		control,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<AssemblyPickFormValues>({
		defaultValues: {
			lines: [],
		},
	});

	const { update, remove, append, fields } = useFieldArray({
		name: "lines",
		control,
	});

	const getTotalQuantity = useCallback(
		(productId: string) => {
			const currentProduct = assemblyData.lines.find((line) => line.product.id === productId);

			if (currentProduct) {
				const wastagePercentage = currentProduct.wastageType === "percentage" ? currentProduct.wastage : "0";
				const wastageQuantity = currentProduct.wastageType === "quantity" ? currentProduct.wastage : "0";

				const { totalQuantity } = calculateTotalQuantity(
					+assemblyData.quantity,
					+currentProduct.quantity,
					+wastagePercentage,
					+wastageQuantity,
					+currentProduct.available,
				);

				return totalQuantity;
			}
		},
		[assemblyData],
	);

	const handleAutoPick = useCallback(async () => {
		try {
			setLoadingAutoPick(true);

			const { data } = await axiosInstance.get<GetAutoPickResponseType>(
				`/api/assemblies/pick/${assemblyId}/populate`,
			);

			if (data.length > 0) {
				const newAppendData: AssemblyPickLineFormType[] = data.map((item) => {
					return {
						product: item.product as ProductType,
						warehouse: item.warehouse as WarehousType,
						batchNumber: {
							name: item.batchNumber
								? item.batchNumber
								: item.expiryDate
									? `N/A (${item.expiryDate})`
									: "N/A",
						},
						expiryDate: item.expiryDate || "N/A",
						quantity: (+item.quantity).toFixed(2),
						unitOfMeasure: item.product.unitOfMeasure || undefined,
						available: (+item.available).toFixed(2),
						cost: item.cost,
						batches: item.options.map((batch) => ({
							...batch,
							name: batch.batchNumber
								? batch.batchNumber
								: item.expiryDate
									? `N/A (${item.expiryDate})`
									: "N/A",
							batchNumber: batch.batchNumber,
							expiryDate: batch.expiryDate,
							available: batch.available,
							cost: (+batch.cost).toFixed(2),
						})),
					};
				});

				append(newAppendData);
			}

			// const newResetData: AssemblyPickFormValues =
			// 	data.length > 0
			// 		? {
			// 				lines: data.map((item) => {
			// 					return {
			// 						product: item.product as ProductType,
			// 						warehouse: item.warehouse as WarehousType,
			// 						batchNumber: {
			// 							name: item.batchNumber
			// 								? item.batchNumber
			// 								: item.expiryDate
			// 									? `N/A (${item.expiryDate})`
			// 									: "N/A",
			// 						},
			// 						expiryDate: item.expiryDate || "N/A",
			// 						quantity: (+item.quantity).toFixed(2),
			// 						unitOfMeasure: item.product.unitOfMeasure || undefined,
			// 						available: (+item.available).toFixed(2),
			// 						cost: item.cost,
			// 						batches: item.options.map((batch) => ({
			// 							...batch,
			// 							name: batch.batchNumber
			// 								? batch.batchNumber
			// 								: item.expiryDate
			// 									? `N/A (${item.expiryDate})`
			// 									: "N/A",
			// 							batchNumber: batch.batchNumber,
			// 							expiryDate: batch.expiryDate,
			// 							available: batch.available,
			// 							cost: (+batch.cost).toFixed(2),
			// 						})),
			// 					};
			// 				}),
			// 			}
			// 		: { lines: [DefaultAssemblyPickLine] };

			// reset(newResetData, { keepDefaultValues: true });
		} catch (error) {
			if (isAxiosError(error)) {
				showError(error);
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setLoadingAutoPick(false);
		}
	}, [assemblyId, append]);

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
										lines: [DefaultAssemblyPickLine],
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

	const onSubmit = async (formData: AssemblyPickFormValues) => {
		const isValid = validateData(formData);
		const dataLines = formData.lines.map((line) => {
			const product = line.product!;
			const warehouse = line.warehouse!;
			const unitOfMeasure = line.unitOfMeasure;

			return {
				productId: product.id,
				warehouseId: warehouse.id,
				...(line.batchNumber && !line.batchNumber.name.includes("N/A")
					? { batchNumber: line.batchNumber.name }
					: {}),
				...(line.expiryDate && line.expiryDate !== "N/A" ? { expiryDate: line.expiryDate } : {}),
				...(unitOfMeasure ? { uomId: unitOfMeasure.id } : {}),
				quantity: line.quantity,
			};
		});

		const newData: AssemblyPickType[] = formData.lines.map((line) => {
			const product = line.product!;
			const warehouse = line.warehouse!;
			const unitOfMeasure = line.unitOfMeasure;

			return {
				id: "",
				product: product,
				warehouse: warehouse,
				batchNumber: line.batchNumber?.name || undefined,
				expiryDate: line.expiryDate || undefined,
				quantity: (+line.quantity).toFixed(2),
				uom: unitOfMeasure || undefined,
				available: (+line.available).toFixed(2),
				cost: line.cost,
				batches: line.batches.map((batch) => ({
					productId: product.id,
					batchNumber: batch.batchNumber,
					expiryDate: batch.expiryDate,
					warehouseId: warehouse.id,
					available: batch.available,
				})),
			};
		});

		if (assemblyId && isValid) {
			await mutateAsync({ newData, body: { orderId: assemblyId, lines: dataLines } });

			if (currentStateRef.current === "authorise") {
				authorise({ body: { id: assemblyId } });
			}
		}
	};

	useEffect(() => {
		if (isFirstResetRef.current && isSuccess && data && data.data) {
			reset(
				data.data.lines.length > 0
					? {
							lines: data.data.lines.map((line) => ({
								product: line.product,
								warehouse: line.warehouse,
								batchNumber: { name: line.batchNumber ? line.batchNumber : "N/A" },
								expiryDate: line.expiryDate || "N/A",
								quantity: (+line.quantity).toFixed(2),
								unitOfMeasure: line.uom || undefined,
								available: (+line.available).toFixed(2),
								cost: line.cost,
								batches: line.batches.map((item) => ({
									...item,
									name: item.batchNumber
										? item.batchNumber
										: item.expiryDate
											? `N/A (${item.expiryDate})`
											: "N/A",
								})),
							})),
						}
					: { lines: [] },
				{ keepDefaultValues: true },
			);

			isFirstResetRef.current = false;
		}
	}, [isSuccess, data, reset]);

	return (
		<CommonPageWrapper>
			{isLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess && data.data ? (
				<>
					<CommonPageHeader>
						<CommonPageSubWrapper>
							{currentPickStatus && data.data.lines.length > 0 ? (
								<CommonPageStatus
									isYellow={currentPickStatus === "DRAFT"}
									isGreen={currentPickStatus === "AUTHORIZED"}
								>
									{currentPickStatus.toLocaleLowerCase()}
								</CommonPageStatus>
							) : (
								<CommonPageStatus>New</CommonPageStatus>
							)}
							<CommonPageTitle>Pick</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							{assemblyId && currentPickStatus && data.data.lines.length > 0 && (
								<Button
									isSecondary
									type="button"
									disabled={isLoadingPrintUrl}
									isLoading={isLoadingPrintUrl}
									onClick={() => getPrintUrlData(assemblyId)}
								>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#print" />
									</svg>
									Print
								</Button>
							)}
							{!disabledAutoPick && (
								<Button
									isSecondary
									type="button"
									onClick={handleAutoPick}
									disabled={loadingAutoPick}
									isLoading={loadingAutoPick}
								>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#plus" />
									</svg>
									Auto Pick
								</Button>
							)}
							{!disabledActions && (
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
										{currentPickStatus !== "AUTHORIZED" && (
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
										{currentPickStatus === "DRAFT" && (
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
										{currentPickStatus === "AUTHORIZED" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
												Undo
											</DropdownMenuItem>
										)}
										{data.data.lines.length > 0 && currentPickStatus === "DRAFT" && (
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
						<form ref={formRef} id="pickForm" className="commonPage__main" onSubmit={handleSubmit(onSubmit)}>
							<TF>
								<TFWrapper>
									<TFOverflow>
										<TFTable>
											<TFThead>
												<TFTr>
													<TFTh style={{ width: "12.5%" }}>Product</TFTh>
													<TFTh style={{ width: "12.5%" }}>Location</TFTh>
													<TFTh style={{ width: "12.5%" }}>Batch Number</TFTh>
													<TFTh style={{ width: "12.5%" }}>Expiry Date</TFTh>
													<TFTh style={{ width: "12.5%" }}>Total Quantity</TFTh>
													<TFTh style={{ width: "12.5%" }}>Unit of Measure</TFTh>
													<TFTh style={{ width: "12.5%" }}>Available</TFTh>
													<TFTh style={{ width: "12.5%" }}>Cost</TFTh>
													<TFTh isActions></TFTh>
												</TFTr>
											</TFThead>
											{fields.length > 0 ? (
												<>
													<TFTbody>
														{fields.map((field, index) => (
															<PickLineRow
																index={index}
																key={field.id}
																fields={fields}
																errors={errors}
																update={update}
																remove={remove}
																control={control}
																setValue={setValue}
																products={selectProducts}
																disabledStatus={disabledStatus}
																defaultWarehouse={defaultWarehouse}
																getTotalQuantity={getTotalQuantity}
															/>
														))}
													</TFTbody>
												</>
											) : (
												<TFTbody>
													<TFTr>
														<TFTd isEmpty colSpan={9}>
															Use Auto Pick or Add Row
														</TFTd>
													</TFTr>
												</TFTbody>
											)}
										</TFTable>
									</TFOverflow>
								</TFWrapper>

								{!disabledStatus && (
									<TFAddRow>
										<Button isSecondary type="button" onClick={() => append(DefaultAssemblyPickLine)}>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#plus" />
											</svg>
											Add Row
										</Button>
									</TFAddRow>
								)}
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
