import { FC, useState } from "react";

import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormRegister,
	FieldArrayWithId,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
} from "react-hook-form";

import { AllocateModal } from "./AllocateModal";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { TableDayPickerRhf } from "@/components/shared/form/TableDayPickerRhf";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableAccountSelect } from "@/components/widgets/Selects";

import {
	AdditionalExpenseAllocate,
	AdditionalExpenseFormValues,
	DefaultAdditionalExpenseLine,
} from "@/@types/purchaseOrder/additionalExpense";
import { BillType } from "@/@types/purchaseOrders";

type Props = {
	index: number;
	bills: BillType[];
	taxInclusive: boolean;
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<AdditionalExpenseFormValues>;
	control: Control<AdditionalExpenseFormValues, unknown>;
	register: UseFormRegister<AdditionalExpenseFormValues>;
	update: UseFieldArrayUpdate<AdditionalExpenseFormValues, "lines">;
	fields: FieldArrayWithId<AdditionalExpenseFormValues, "lines", "id">[];
	handleAddAllocation: (index: number, data: AdditionalExpenseAllocate[]) => void;
};

export const LinesRow: FC<Props> = ({
	index,
	bills,
	fields,
	errors,
	control,
	taxInclusive,
	disabledStatus,
	remove,
	update,
	register,
	handleAddAllocation,
}) => {
	const disableField = disabledStatus;

	const [allocateModal, setAllocateModal] = useState(false);

	const account = useWatch({
		name: `lines.${index}.expenseAccount`,
		control,
	});

	const amount = useWatch({
		name: `lines.${index}.amount`,
		control,
	});

	const allocation = useWatch({
		name: `lines.${index}.allocation`,
		control,
	});

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.expenseAccount`}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableAccountSelect
							{...field}
							value={field.value}
							type="expenseAccounts"
							disabled={disableField}
							id="orderLinesExpenseAccountId"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.expenseAccount?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<AdditionalExpenseFormValues>
					type="text"
					label="Reference"
					register={register}
					disabled={disableField}
					id="serviceLinesreferenceId"
					name={`lines.${index}.reference`}
					error={errors?.lines?.[index]?.reference?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.date`}
					rules={{ required: "Required" }}
					render={({ field }) => {
						return (
							<TableDayPickerRhf
								{...field}
								value={field.value}
								disabled={disableField}
								placeholder="dd/mm/yyyy"
								onValueChange={field.onChange}
								error={errors?.lines?.[index]?.date?.message}
							/>
						);
					}}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<AdditionalExpenseFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Amount"
					register={register}
					rules={{
						min: 0,
						required: "Required",
					}}
					disabled={disableField}
					id="orderLinesquantityId"
					name={`lines.${index}.amount`}
					error={errors?.lines?.[index]?.amount?.message}
				/>
			</TFTd>
			<TFTd>
				<button
					type="button"
					className="formTable__btn"
					onClick={() => setAllocateModal(true)}
					disabled={disableField || !account || !amount || +amount <= 0}
				>
					Allocate
				</button>
			</TFTd>
			<TFTd>
				{!disableField && (
					<TFRemove
						onClick={() => {
							if (fields.length === 1 && index === 0) {
								update(index, DefaultAdditionalExpenseLine);
							} else {
								remove(index);
							}
						}}
					/>
				)}
			</TFTd>

			<AllocateModal
				bills={bills}
				amount={amount}
				linesIndex={index}
				open={allocateModal}
				allocation={allocation}
				taxInclusive={taxInclusive}
				onOpenChange={setAllocateModal}
				handleAddAllocation={handleAddAllocation}
				disabled={disableField || !account || !amount || +amount <= 0}
			/>
		</TFTr>
	);
};
