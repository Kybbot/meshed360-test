import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { ProductBomServiceLinesRow } from "./ProductBomServiceLinesRow";

import { Button } from "@/components/shared/Button";

import {
	TF,
	TFTd,
	TFTh,
	TFTr,
	TFTfoot,
	TFTable,
	TFTbody,
	TFThead,
	TFThFoot,
	TFAddRow,
	TFWrapper,
	TFOverflow,
} from "@/components/widgets/Table";

import { calculateFooterValues2 } from "../../../utils/calculate";

import { ProductBomFormValues, DefaultProductBOMServiceLineFormValues } from "@/@types/products";

type Props = {
	errors: FieldErrors<ProductBomFormValues>;
	control: Control<ProductBomFormValues, unknown>;
	register: UseFormRegister<ProductBomFormValues>;
	setValue: UseFormSetValue<ProductBomFormValues>;
};

export const ProductBomServiceLines: FC<Props> = ({ errors, control, register, setValue }) => {
	const { remove, append, fields } = useFieldArray({
		name: "serviceLines",
		control,
	});

	const allValues = useWatch({
		name: "serviceLines",
		control,
	});

	const { total } = calculateFooterValues2(allValues);

	return (
		<TF>
			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ width: "20%" }}>Labour & Overheads</TFTh>
								<TFTh style={{ width: "20%" }}>Quantity</TFTh>
								<TFTh style={{ width: "20%" }}>Expense Account</TFTh>
								<TFTh style={{ width: "20%" }}>Unit Cost</TFTh>
								<TFTh style={{ width: "20%" }} isRight>
									Total Cost
								</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>
						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<ProductBomServiceLinesRow
											index={index}
											key={field.id}
											errors={errors}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
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
									<TFTd isEmpty colSpan={6}>
										No data available
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>

			<TFAddRow>
				<Button type="button" isSecondary onClick={() => append(DefaultProductBOMServiceLineFormValues)}>
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#plus" />
					</svg>
					Add Row
				</Button>
			</TFAddRow>
		</TF>
	);
};
