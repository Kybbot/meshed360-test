import { FC } from "react";
import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
} from "react-hook-form";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";

import { BillAllocate, BillModalFormValues } from "@/@types/purchaseOrders";

type Props = {
	index: number;
	amount: string;
	disabledStatus: boolean;
	additionalCostSum: number;
	remove: UseFieldArrayRemove;
	currentLines: BillAllocate[];
	errors: FieldErrors<BillModalFormValues>;
	control: Control<BillModalFormValues, unknown>;
	setValue: UseFormSetValue<BillModalFormValues>;
	register: UseFormRegister<BillModalFormValues>;
	update: UseFieldArrayUpdate<BillModalFormValues, "additionalLines">;
};

export const MultipleAllocateModalRow: FC<Props> = ({
	index,
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
	const {
		product,
		billTotal,
		reference,
		cost: additionalCost,
	} = useWatch({
		name: `additionalLines.${index}`,
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
							const value = event.target.value as BillAllocate;

							const newValue: BillAllocate = {
								id: value.id,
								name: value.name,
								billId: value.billId,
								billLineId: value.billLineId,
								product: value.product,
								reference: value.reference,
								billTotal: value.billTotal,
								cost: "",
							};

							update(index, newValue);
						},
					}}
					name={`additionalLines.${index}.product`}
					render={({ field }) => (
						<CustomTableSelect
							id="productId"
							value={field.value}
							placeholder="Select"
							disabled={disabledStatus}
							customValues={currentLines}
							onValueChange={field.onChange}
							error={errors?.additionalLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd isText uncapitalize>
				{reference}
			</TFTd>
			<TFTd isText>{(+billTotal).toFixed(2)}</TFTd>
			<TFTd>
				<TableInputRhf<BillModalFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Amount"
					register={register}
					disabled={disabledStatus || !product}
					rules={{
						min: 0,
						max: {
							value: +additionalCost + maxCost,
							message: `Max cost is ${+additionalCost + maxCost}`,
						},
						onChange(event) {
							const value = +event.target.value;

							if (value < 0) {
								setValue(`additionalLines.${index}.cost`, "0");
							}
							if (value > +additionalCost + maxCost) {
								setValue(`additionalLines.${index}.cost`, (+additionalCost + maxCost).toString());
							}
						},
					}}
					id="orderLinesquantityId"
					name={`additionalLines.${index}.cost`}
					error={errors?.additionalLines?.[index]?.cost?.message}
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
