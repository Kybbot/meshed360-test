import { FC, useCallback, useEffect, useState } from "react";
import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	FieldArrayWithId,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
} from "react-hook-form";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

import { calculateTotalQuantity } from "../utils/calculate";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableProductSelect } from "@/components/widgets/Selects";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiResult } from "@/@types/api";
import { ProductType } from "@/@types/products";
import { SelectOption } from "@/@types/selects";
import { AssemblyFormValues, DefaultAssemblyLine } from "@/@types/assembly/assembly";

type Props = {
	index: number;
	warehouse: SelectOption;
	disabledStatus: boolean;
	usedProductIds: string[];
	quantityToProduce: string;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<AssemblyFormValues>;
	control: Control<AssemblyFormValues, unknown>;
	register: UseFormRegister<AssemblyFormValues>;
	setValue: UseFormSetValue<AssemblyFormValues>;
	update: UseFieldArrayUpdate<AssemblyFormValues, "lines">;
	fields: FieldArrayWithId<AssemblyFormValues, "lines", "id">[];
};

export const OrderLinesRow: FC<Props> = ({
	index,
	fields,
	errors,
	control,
	warehouse,
	usedProductIds,
	disabledStatus,
	quantityToProduce,
	remove,
	update,
	register,
	setValue,
}) => {
	const disableField = disabledStatus;

	const [loadingPoductAvailability, setLoadingPoductAvailability] = useState(false);

	const lineValues = useWatch({
		name: `lines.${index}`,
		control,
	});

	const { unitCost, quantity, unitOfMeasure, wastagePercentage, wastageQuantity, available } = lineValues;

	const { totalQuantity, totalQuantityError } = calculateTotalQuantity(
		+quantityToProduce,
		+quantity,
		+wastagePercentage,
		+wastageQuantity,
		+available,
	);

	const getPoductAvailability = useCallback(async (productId: string, warehouseId: string) => {
		try {
			const { data } = await axiosInstance.get<ApiResult<{ available: number }>>(
				`/api/assemblies/availability?productId=${productId}&warehouseId=${warehouseId}`,
			);

			if (data.data) {
				return data.data.available;
			}

			return 0;
		} catch (error) {
			if (isAxiosError(error)) {
				showError(error);
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setLoadingPoductAvailability(false);
		}
	}, []);

	useEffect(() => {
		if (totalQuantity) {
			setValue(`lines.${index}.total`, (+totalQuantity * +unitCost).toFixed(2));
		}
	}, [index, unitCost, totalQuantity, setValue]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.product`}
					rules={{
						required: "Required",
						async onChange(event) {
							const value = event.target.value as ProductType;

							setValue(`lines.${index}.unitOfMeasure`, value.unitOfMeasure);
							setValue(`lines.${index}.unitCost`, value.productCost.toString());

							if (warehouse) {
								const available = await getPoductAvailability(value.id, warehouse.id);
								if (typeof available !== "undefined") {
									setValue(`lines.${index}.available`, available.toString());
								} else {
									setValue(`lines.${index}.available`, "0");
								}
							} else {
								setValue(`lines.${index}.available`, "0");
							}
						},
					}}
					render={({ field }) => (
						<FormTableProductSelect
							{...field}
							type="stock"
							value={field.value}
							id="linesProductId"
							onValueChange={field.onChange}
							usedProductIds={usedProductIds}
							error={errors?.lines?.[index]?.product?.message}
							disabled={disableField || loadingPoductAvailability}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<AssemblyFormValues>
					step={0.01}
					type="number"
					register={register}
					id="LinesQuantitytId"
					label="Quantity to use"
					disabled={disableField}
					name={`lines.${index}.quantity`}
					rules={{
						min: 0,
						required: "Required",
						onChange(event) {
							const value = +event.target.value;

							if (value < 0) {
								setValue(`lines.${index}.quantity`, "0");
							}
						},
					}}
					error={errors?.lines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd isText>{unitOfMeasure?.name || ""}</TFTd>
			<TFTd isText>{unitCost}</TFTd>
			<TFTd>
				<TableInputRhf<AssemblyFormValues>
					step={0.01}
					type="number"
					label="Wastage %"
					register={register}
					rules={{
						min: 0,
						required: "Required",
						onChange(event) {
							const value = +event.target.value;

							if (value < 0) {
								setValue(`lines.${index}.wastagePercentage`, "0");
							}

							if (value > 100) {
								setValue(`lines.${index}.wastagePercentage`, "100");
							}

							if (!wastageQuantity || +wastageQuantity > 0) {
								setValue(`lines.${index}.wastageQuantity`, "0");
							}
						},
					}}
					disabled={disableField}
					id="linesWastagePercentageId"
					name={`lines.${index}.wastagePercentage`}
					error={errors?.lines?.[index]?.wastagePercentage?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<AssemblyFormValues>
					step={0.01}
					type="number"
					label="Wastage Quantity"
					register={register}
					rules={{
						min: 0,
						required: "Required",
						onChange(event) {
							const value = +event.target.value;

							if (value < 0) {
								setValue(`lines.${index}.wastageQuantity`, "0");
							}

							if (!wastagePercentage || +wastagePercentage > 0) {
								setValue(`lines.${index}.wastagePercentage`, "0");
							}
						},
					}}
					disabled={disableField}
					id="linesWastageQuantityId"
					name={`lines.${index}.wastageQuantity`}
					error={errors?.lines?.[index]?.wastageQuantity?.message}
				/>
			</TFTd>
			<TFTd isText>{available}</TFTd>
			<TFTd isText error={totalQuantityError}>
				{totalQuantity}
			</TFTd>
			<TFTd isRight>{(+totalQuantity * +unitCost).toFixed(2)}</TFTd>
			<TFTd>
				{!disableField && (
					<TFRemove
						onClick={() => {
							if (fields.length === 1 && index === 0) {
								update(index, DefaultAssemblyLine);
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
