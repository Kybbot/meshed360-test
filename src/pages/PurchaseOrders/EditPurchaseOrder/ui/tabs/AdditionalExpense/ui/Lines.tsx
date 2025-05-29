import { FC } from "react";
import { Control, FieldErrors, useFieldArray, UseFormRegister } from "react-hook-form";

import { LinesRow } from "./LinesRow";

import { Button } from "@/components/shared/Button";

import {
	TF,
	TFAddRow,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTh,
	TFThead,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";

import {
	AdditionalExpenseAllocate,
	AdditionalExpenseFormValues,
	DefaultAdditionalExpenseLine,
} from "@/@types/purchaseOrder/additionalExpense";
import { BillType } from "@/@types/purchaseOrders";

type Props = {
	bills: BillType[];
	taxInclusive: boolean;
	disabledStatus: boolean;
	errors: FieldErrors<AdditionalExpenseFormValues>;
	control: Control<AdditionalExpenseFormValues, unknown>;
	register: UseFormRegister<AdditionalExpenseFormValues>;
	handleAddAllocation: (index: number, data: AdditionalExpenseAllocate[]) => void;
};

export const Lines: FC<Props> = ({
	bills,
	errors,
	control,
	taxInclusive,
	disabledStatus,
	register,
	handleAddAllocation,
}) => {
	const { update, remove, append, fields } = useFieldArray({
		name: "lines",
		control,
	});

	return (
		<TF>
			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ width: "20%" }}>Expense Account</TFTh>
								<TFTh style={{ width: "20%" }}>Reference</TFTh>
								<TFTh style={{ width: "20%" }}>Date</TFTh>
								<TFTh style={{ width: "20%" }}>Amount</TFTh>
								<TFTh style={{ width: "20%" }}>Allocation</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>
						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<LinesRow
											bills={bills}
											index={index}
											key={field.id}
											fields={fields}
											errors={errors}
											update={update}
											remove={remove}
											control={control}
											register={register}
											taxInclusive={taxInclusive}
											disabledStatus={disabledStatus}
											handleAddAllocation={handleAddAllocation}
										/>
									))}
								</TFTbody>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty colSpan={6}>
										No data available
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>

			{!disabledStatus && (
				<TFAddRow>
					<Button type="button" isSecondary onClick={() => append(DefaultAdditionalExpenseLine)}>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#plus" />
						</svg>
						Add Row
					</Button>
				</TFAddRow>
			)}
		</TF>
	);
};
