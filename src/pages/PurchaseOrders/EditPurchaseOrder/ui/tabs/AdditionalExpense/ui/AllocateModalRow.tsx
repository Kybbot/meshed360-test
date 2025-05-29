import { FC } from "react";
import {
	Control,
	useWatch,
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	FieldArrayWithId,
	UseFieldArrayUpdate,
	UseFieldArrayRemove,
	Controller,
} from "react-hook-form";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";

import {
	AdditionalExpenseAllocate,
	AdditionalExpenseModalFormValues,
} from "@/@types/purchaseOrder/additionalExpense";

type Props = {
	index: number;
	amount: string;
	disabledStatus: boolean;
	additionalCostSum: number;
	remove: UseFieldArrayRemove;
	currentLines: AdditionalExpenseAllocate[];
	errors: FieldErrors<AdditionalExpenseModalFormValues>;
	control: Control<AdditionalExpenseModalFormValues, unknown>;
	setValue: UseFormSetValue<AdditionalExpenseModalFormValues>;
	register: UseFormRegister<AdditionalExpenseModalFormValues>;
	update: UseFieldArrayUpdate<AdditionalExpenseModalFormValues, "additionalLines">;
	fields: FieldArrayWithId<AdditionalExpenseModalFormValues, "additionalLines", "id">[];
};

export const AllocateModalRow: FC<Props> = ({
	index,
	fields,
	amount,
	errors,
	control,
	currentLines,
	disabledStatus,
	additionalCostSum,
	remove,
	update,
	setValue,
	register,
}) => {
	const additionalCost = useWatch({
		name: `additionalLines.${index}.allocateAdditionalCost`,
		control,
	});

	const maxCost = +amount - additionalCostSum;

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					rules={{
						required: "Required",
						onChange(event) {
							const value = event.target.value as AdditionalExpenseAllocate;

							const newValue: AdditionalExpenseAllocate = {
								id: value.id,
								name: value.name,
								billId: value.billId,
								billLineId: value.billLineId,
								product: value.product,
								reference: value.reference,
								billTotal: value.billTotal,
								allocateAdditionalCost: "",
							};

							update(index, newValue);
						},
					}}
					name={`additionalLines.${index}.product`}
					render={({ field }) => (
						<CustomTableSelect
							id="productId"
							placeholder="Select"
							value={field.value}
							disabled={disabledStatus}
							customValues={currentLines}
							onValueChange={field.onChange}
							error={errors?.additionalLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd isText>{fields[index].reference || ""}</TFTd>
			<TFTd isText>{(+fields[index].billTotal).toFixed(2)}</TFTd>
			<TFTd>
				<TableInputRhf<AdditionalExpenseModalFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Amount"
					register={register}
					disabled={disabledStatus}
					rules={{
						min: 0,
						max: {
							value: +additionalCost + maxCost,
							message: `Max cost is ${+additionalCost + maxCost}`,
						},
						onChange(event) {
							const value = +event.target.value;

							if (value < 0) {
								setValue(`additionalLines.${index}.allocateAdditionalCost`, "0");
							}
							if (value > +additionalCost + maxCost) {
								setValue(
									`additionalLines.${index}.allocateAdditionalCost`,
									(+additionalCost + maxCost).toString(),
								);
							}
						},
					}}
					id="orderLinesquantityId"
					name={`additionalLines.${index}.allocateAdditionalCost`}
					error={errors?.additionalLines?.[index]?.allocateAdditionalCost?.message}
				/>
			</TFTd>
			<TFTd>
				<TFRemove
					onClick={() => {
						remove(index);
					}}
				/>
			</TFTd>
		</TFTr>
	);
};
