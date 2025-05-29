import { FC, useEffect } from "react";
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

import { calculateTotalCost } from "../../../utils/calculate";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableProductSelect } from "@/components/widgets/Selects";

import { DefaultProductBOMLineFormValues, ProductBomFormValues, ProductType } from "@/@types/products";

type Props = {
	index: number;
	isAssembly: boolean;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<ProductBomFormValues>;
	control: Control<ProductBomFormValues, unknown>;
	register: UseFormRegister<ProductBomFormValues>;
	setValue: UseFormSetValue<ProductBomFormValues>;
	update: UseFieldArrayUpdate<ProductBomFormValues, "lines">;
	fields: FieldArrayWithId<ProductBomFormValues, "lines", "id">[];
};

export const ProductBomLinesRow: FC<Props> = ({
	index,
	fields,
	errors,
	remove,
	update,
	control,
	register,
	setValue,
	isAssembly,
}) => {
	const lineValues = useWatch({
		name: `lines.${index}`,
		control,
	});

	const serviceLines = useWatch({
		name: "serviceLines",
		control,
	});

	const { unitCost, quantity, wastagePercentage, wastageQuantity, disassemblyCostPercentage } = lineValues;

	const totalServiceCost = serviceLines.reduce((sum, line) => {
		const quantity = parseFloat(line.quantity) || 0;
		const unitCost = parseFloat(line.unitCost) || 0;
		return sum + quantity * unitCost;
	}, 0);

	const { totalCost } = calculateTotalCost(
		isAssembly,
		+quantity,
		+wastagePercentage,
		+wastageQuantity,
		+unitCost,
		+disassemblyCostPercentage,
		totalServiceCost,
	);

	useEffect(() => {
		if (totalCost) {
			setValue(`lines.${index}.totalCost`, totalCost);
		}
	}, [index, totalCost, setValue]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.material`}
					rules={{
						required: "Required",
						async onChange(event) {
							const value = event.target.value as ProductType;
							setValue(`lines.${index}.unitCost`, value.productCost.toString());
						},
					}}
					render={({ field }) => (
						<FormTableProductSelect
							{...field}
							type="stock"
							value={field.value}
							id={`LinesProductId-${index}`}
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.material?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<ProductBomFormValues>
					step={0.01}
					type="number"
					register={register}
					id={`LinesQuantity-${index}`}
					label="Quantity"
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
			{isAssembly ? (
				<>
					<TFTd>
						<TableInputRhf<ProductBomFormValues>
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

									if (!wastageQuantity || +wastageQuantity > 0) {
										setValue(`lines.${index}.wastageQuantity`, "0");
									}
								},
							}}
							id={`LinesWastagePercentage-${index}`}
							name={`lines.${index}.wastagePercentage`}
							error={errors?.lines?.[index]?.wastagePercentage?.message}
						/>
					</TFTd>
					<TFTd>
						<TableInputRhf<ProductBomFormValues>
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
							id={`LinesWastageQuantity-${index}`}
							name={`lines.${index}.wastageQuantity`}
							error={errors?.lines?.[index]?.wastageQuantity?.message}
						/>
					</TFTd>
				</>
			) : (
				<TFTd>
					<TableInputRhf<ProductBomFormValues>
						step={0.01}
						type="number"
						label="Disassembly Cost Distribution %"
						register={register}
						rules={{
							min: 0,
							required: "Required",
							onChange(event) {
								if (+event.target.value < 0) {
									setValue(`lines.${index}.disassemblyCostPercentage`, "0");
								}
							},
						}}
						id={`LinesDisassemblyCost-${index}`}
						name={`lines.${index}.disassemblyCostPercentage`}
						error={errors?.lines?.[index]?.disassemblyCostPercentage?.message}
					/>
				</TFTd>
			)}
			<TFTd isText>{unitCost}</TFTd>
			<TFTd isRight>{totalCost}</TFTd>
			<TFTd>
				<TFRemove
					onClick={() => {
						if (fields.length === 1 && index === 0) {
							update(index, DefaultProductBOMLineFormValues);
						} else {
							remove(index);
						}
					}}
				/>
			</TFTd>
		</TFTr>
	);
};
