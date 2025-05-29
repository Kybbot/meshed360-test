import { FC } from "react";
import { Control, FieldErrors, useFieldArray, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { ShippingLinesRow } from "./ShippingLinesRow.tsx";

import { ShippingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
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
	errors: FieldErrors<ShippingFulfilmentFormValues>;
	control: Control<ShippingFulfilmentFormValues, unknown>;
	register: UseFormRegister<ShippingFulfilmentFormValues>;
	setValue: UseFormSetValue<ShippingFulfilmentFormValues>;
	disabled: boolean;
	orderInfo: ExtendedSalesOrder;
};

export const ShippingLines: FC<Props> = ({ errors, control, register, setValue, disabled }) => {
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
								<TFTh style={{ minWidth: "140px" }}>Ship Date</TFTh>
								<TFTh style={{ minWidth: "140px" }}>Carrier</TFTh>
								<TFTh>Waybill #</TFTh>
								<TFTh>Tracking Link</TFTh>
								<TFTh>Package #</TFTh>
							</TFTr>
						</TFThead>

						{fields.length > 0 ? (
							<TFTbody>
								{fields.map((field, index) => (
									<ShippingLinesRow
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
									<TFTd isEmpty>No data available</TFTd>
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
