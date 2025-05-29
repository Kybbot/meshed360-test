import { FC } from "react";
import { Control, FieldErrors, useFieldArray, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { PackingLinesRow } from "./PackingLinesRow.tsx";

import { PackingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder } from "@/@types/salesOrders/api.ts";
import {
	TF,
	TFHr,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTh,
	TFThead,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";

type Props = {
	errors: FieldErrors<PackingFulfilmentFormValues>;
	control: Control<PackingFulfilmentFormValues, unknown>;
	register: UseFormRegister<PackingFulfilmentFormValues>;
	setValue: UseFormSetValue<PackingFulfilmentFormValues>;
	disabled: boolean;
	orderInfo: ExtendedSalesOrder;
};

export const PackingLines: FC<Props> = ({ errors, control, register, setValue, disabled }) => {
	const { update, remove, fields } = useFieldArray({
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
								<TFTh style={{ minWidth: "140px" }}>Product</TFTh>
								<TFTh>Batch/Serial</TFTh>
								<TFTh>Expiry Date</TFTh>
								<TFTh>Quantity</TFTh>
								<TFTh>Package #</TFTh>
								<TFTh style={{ minWidth: "140px" }}>Location</TFTh>
							</TFTr>
						</TFThead>

						{fields.length > 0 ? (
							<TFTbody>
								{fields.map((field, index) => (
									<PackingLinesRow
										key={field.id}
										index={index}
										fields={fields}
										errors={errors}
										update={update}
										remove={remove}
										control={control}
										setValue={setValue}
										register={register}
										disabled={disabled}
									/>
								))}
							</TFTbody>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd colSpan={6} isEmpty>
										No data available
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>
			<TFHr />
		</TF>
	);
};
