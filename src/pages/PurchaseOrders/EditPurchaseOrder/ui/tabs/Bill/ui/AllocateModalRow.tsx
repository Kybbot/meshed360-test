import { FC } from "react";
import {
	Control,
	useWatch,
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	FieldArrayWithId,
} from "react-hook-form";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import { TFTd, TFTr } from "@/components/widgets/Table";

import { BillModalFormValues } from "@/@types/purchaseOrders";

type Props = {
	index: number;
	amount: string;
	disabledStatus: boolean;
	additionalCostSum: number;
	errors: FieldErrors<BillModalFormValues>;
	control: Control<BillModalFormValues, unknown>;
	setValue: UseFormSetValue<BillModalFormValues>;
	register: UseFormRegister<BillModalFormValues>;
	fields: FieldArrayWithId<BillModalFormValues, "additionalLines", "id">[];
};

export const AllocateModalRow: FC<Props> = ({
	index,
	fields,
	amount,
	errors,
	control,
	disabledStatus,
	additionalCostSum,
	setValue,
	register,
}) => {
	const additionalCost = useWatch({
		name: `additionalLines.${index}.cost`,
		control,
	});

	const maxCost = +amount - additionalCostSum;

	return (
		<TFTr>
			<TFTd isText>{fields[index].product?.name || ""}</TFTd>
			<TFTd isText>{(+fields[index].billTotal).toFixed(2)}</TFTd>
			<TFTd>
				<TableInputRhf<BillModalFormValues>
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
		</TFTr>
	);
};
