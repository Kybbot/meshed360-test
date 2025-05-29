import { FC } from "react";
import {
	Control,
	useWatch,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";

import { OrderLinesRow } from "./OrderLinesRow";

import { calculateFooterValues1 } from "../utils/calculate";

import { Button } from "@/components/shared/Button";

import {
	TF,
	TFAddRow,
	TFHr,
	TFInfo,
	TFInfoBold,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTfoot,
	TFTh,
	TFThead,
	TFThFoot,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";

import { SelectOption } from "@/@types/selects";
import { AssemblyFormValues, DefaultAssemblyLine } from "@/@types/assembly/assembly";

type Props = {
	warehouse: SelectOption;
	disabledStatus: boolean;
	quantityToProduce: string;
	errors: FieldErrors<AssemblyFormValues>;
	control: Control<AssemblyFormValues, unknown>;
	register: UseFormRegister<AssemblyFormValues>;
	setValue: UseFormSetValue<AssemblyFormValues>;
};

export const OrderLines: FC<Props> = ({
	errors,
	control,
	warehouse,
	disabledStatus,
	quantityToProduce,
	register,
	setValue,
}) => {
	const { update, remove, append, fields } = useFieldArray({
		name: "lines",
		control,
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const { total } = calculateFooterValues1(allValues);

	const usedProductIds = [...new Set(allValues.map((item) => item.product?.id || ""))];

	return (
		<TF>
			<TFInfo>
				Choose either <TFInfoBold>Wastage %</TFInfoBold> or <TFInfoBold>Wastage Quantity</TFInfoBold>, as they
				cannot be combined
			</TFInfo>

			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ width: "11%" }}>Product</TFTh>
								<TFTh style={{ width: "11%" }}>Quantity to Use</TFTh>
								<TFTh style={{ width: "11%" }}>Unit of Measure</TFTh>
								<TFTh style={{ width: "11%" }}>Unit Cost</TFTh>
								<TFTh style={{ width: "11%" }}>Wastage %</TFTh>
								<TFTh style={{ width: "11%" }}>Wastage Quantity</TFTh>
								<TFTh style={{ width: "11%" }}>Available</TFTh>
								<TFTh style={{ width: "11%" }}>Total Quantity</TFTh>
								<TFTh style={{ width: "11%" }} isRight>
									Total Cost
								</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>
						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<OrderLinesRow
											index={index}
											key={field.id}
											fields={fields}
											errors={errors}
											update={update}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
											warehouse={warehouse}
											usedProductIds={usedProductIds}
											disabledStatus={disabledStatus}
											quantityToProduce={quantityToProduce}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot isRight>{total}</TFThFoot>
										<TFThFoot isActions></TFThFoot>
									</TFTr>
								</TFTfoot>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty colSpan={10}>
										No data available
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>

			{!disabledStatus && (
				<>
					<TFAddRow>
						<Button type="button" isSecondary onClick={() => append(DefaultAssemblyLine)}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plus" />
							</svg>
							Add Row
						</Button>
					</TFAddRow>
					<TFHr />
				</>
			)}
		</TF>
	);
};
