import { FC, useCallback, useState } from "react";
import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormSetValue,
	FieldArrayWithId,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
} from "react-hook-form";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableWarehouseSelect } from "@/components/widgets/Selects";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";
import { getFormDayPickerDate } from "@/utils/date";

import {
	AssemblyPickFormValues,
	DefaultAssemblyPickLine,
	GetPickLineResponseType,
	AssemblyPickLineBatchType,
} from "@/@types/assembly/pick";
import { ApiResult } from "@/@types/api";
import { ProductType } from "@/@types/products";
import { WarehousType } from "@/@types/warehouses";

type Props = {
	index: number;
	products: ProductType[];
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	defaultWarehouse: WarehousType;
	errors: FieldErrors<AssemblyPickFormValues>;
	control: Control<AssemblyPickFormValues, unknown>;
	setValue: UseFormSetValue<AssemblyPickFormValues>;
	getTotalQuantity: (productId: string) => string | undefined;
	update: UseFieldArrayUpdate<AssemblyPickFormValues, "lines">;
	fields: FieldArrayWithId<AssemblyPickFormValues, "lines", "id">[];
};

export const PickLineRow: FC<Props> = ({
	index,
	fields,
	errors,
	control,
	products,
	disabledStatus,
	defaultWarehouse,
	remove,
	update,
	setValue,
	getTotalQuantity,
}) => {
	const [loadingProductAvailability, setLoadingProductAvailability] = useState(false);

	const lineValues = useWatch({
		name: `lines.${index}`,
		control,
	});

	const { product, batchNumber, expiryDate, quantity, unitOfMeasure, available, cost, batches } = lineValues;

	const getProductAvailability = useCallback(async (productId: string, warehouseId: string) => {
		try {
			setLoadingProductAvailability(true);

			const { data } = await axiosInstance.get<ApiResult<GetPickLineResponseType>>(
				`/api/assemblies/pick/options?productId=${productId}&warehouseId=${warehouseId}`,
			);

			return data.data;
		} catch (error) {
			if (isAxiosError(error)) {
				showError(error);
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setLoadingProductAvailability(false);
		}
	}, []);

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					rules={{
						required: "Required",
						async onChange(event) {
							const value = event.target.value as ProductType;

							setValue(`lines.${index}.warehouse`, defaultWarehouse);
							setValue(`lines.${index}.unitOfMeasure`, value.unitOfMeasure);

							if (batchNumber) {
								setValue(`lines.${index}.batchNumber`, undefined);
								setValue(`lines.${index}.expiryDate`, undefined);
								setValue(`lines.${index}.available`, "");
							}

							const totalQuantity = getTotalQuantity(value.id);

							if (totalQuantity) {
								setValue(`lines.${index}.quantity`, totalQuantity);
							}

							const productData = await getProductAvailability(value.id, defaultWarehouse.id);

							if (productData) {
								const batchesData = productData.map((item) => ({
									...item,
									name: item.batchNumber
										? item.batchNumber
										: item.expiryDate
											? `N/A (${item.expiryDate})`
											: "N/A",
								}));

								setValue(`lines.${index}.batches`, batchesData);

								if (batchesData.length === 1) {
									setValue(`lines.${index}.batchNumber`, batchesData[0]);
									setValue(`lines.${index}.available`, (+batchesData[0].available).toFixed(2));
									setValue(`lines.${index}.expiryDate`, batchesData[0].expiryDate || "N/A");
									setValue(`lines.${index}.cost`, (+batchesData[0].cost).toFixed(2) || "0.00");
								}
							}
						},
					}}
					name={`lines.${index}.product`}
					render={({ field }) => (
						<CustomTableSelect
							{...field}
							useSearch
							id="productId"
							value={field.value}
							placeholder="Select"
							customValues={products}
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.product?.message}
							disabled={disabledStatus || loadingProductAvailability}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					rules={{
						required: "Required",
						async onChange(event) {
							const value = event.target.value as WarehousType;

							if (product) {
								update(index, {
									...lineValues,
									warehouse: value,
									batchNumber: undefined,
									available: "",
									expiryDate: "",
									cost: "",
								});

								const productData = await getProductAvailability(product.id, value.id);

								if (productData) {
									const batchesData = productData.map((item) => ({
										...item,
										name: item.batchNumber
											? item.batchNumber
											: item.expiryDate
												? `N/A (${item.expiryDate})`
												: "N/A",
									}));

									setValue(`lines.${index}.batches`, batchesData);
								}
							}
						},
					}}
					name={`lines.${index}.warehouse`}
					render={({ field }) => (
						<FormTableWarehouseSelect
							{...field}
							id="warehouseId"
							value={field.value}
							disabled={disabledStatus}
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.warehouse?.message}
						/>
					)}
				/>
			</TFTd>

			{batches.length > 0 ? (
				<TFTd>
					<Controller
						control={control}
						rules={{
							required: "Required",
							onChange(event) {
								const value = event.target.value as AssemblyPickLineBatchType;

								setValue(`lines.${index}.available`, (+value.available).toFixed(2));
								setValue(`lines.${index}.expiryDate`, value.expiryDate || "N/A");
								setValue(`lines.${index}.cost`, (+value.cost).toFixed(2) || "0.00");
							},
						}}
						name={`lines.${index}.batchNumber`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								useNameAsId
								id="batchNumberId"
								value={field.value}
								placeholder="Select"
								customValues={batches}
								disabled={disabledStatus}
								onValueChange={field.onChange}
								error={errors?.lines?.[index]?.batchNumber?.message}
							/>
						)}
					/>
				</TFTd>
			) : (
				<TFTd isText>N/A</TFTd>
			)}
			{batches.length > 0 && batchNumber ? (
				<TFTd isText>{expiryDate !== "N/A" ? getFormDayPickerDate(expiryDate, true) : expiryDate} </TFTd>
			) : (
				<TFTd isText>N/A</TFTd>
			)}
			<TFTd isText>{quantity}</TFTd>
			<TFTd isText>{unitOfMeasure?.name || ""}</TFTd>
			<TFTd isText>{available}</TFTd>
			<TFTd isText>{cost}</TFTd>
			<TFTd>
				{!disabledStatus && (
					<TFRemove
						onClick={() => {
							if (fields.length === 1 && index === 0) {
								update(index, DefaultAssemblyPickLine);
							} else {
								remove(index);
							}
						}}
					/>
				)}
			</TFTd>
		</TFTr>
	);
};
