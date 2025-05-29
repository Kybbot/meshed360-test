import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { ProductBomLinesRow } from "./ProductBomLinesRow";
import { DefaultProductBOMLineFormValues, ProductBomFormValues } from "@/@types/products";

import { Button } from "@/components/shared/Button";

import {
	TF,
	TFHr,
	TFTd,
	TFTh,
	TFTr,
	TFInfo,
	TFTable,
	TFTbody,
	TFThead,
	TFAddRow,
	TFWrapper,
	TFInfoBold,
	TFOverflow,
	TFTfoot,
	TFThFoot,
} from "@/components/widgets/Table";
import { calculateFooterValues1 } from "../../../utils/calculate";

type Props = {
	isAssembly: boolean;
	errors: FieldErrors<ProductBomFormValues>;
	control: Control<ProductBomFormValues, unknown>;
	register: UseFormRegister<ProductBomFormValues>;
	setValue: UseFormSetValue<ProductBomFormValues>;
};

export const ProductBomLines: FC<Props> = ({ errors, control, register, setValue, isAssembly }) => {
	const { update, remove, append, fields } = useFieldArray({
		name: "lines",
		control,
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const { total } = calculateFooterValues1(allValues);
	const colWidth = isAssembly ? "17%" : "20%";

	return (
		<TF>
			{isAssembly && (
				<TFInfo>
					Choose either <TFInfoBold>Wastage %</TFInfoBold> or <TFInfoBold>Wastage Quantity</TFInfoBold>, as
					they cannot be combined
				</TFInfo>
			)}

			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ width: colWidth }}>Product</TFTh>
								<TFTh style={{ width: colWidth }}>Quantity</TFTh>
								{isAssembly ? (
									<>
										<TFTh style={{ width: colWidth }}>Wastage %</TFTh>
										<TFTh style={{ width: colWidth }}>Wastage Quantity</TFTh>
									</>
								) : (
									<TFTh style={{ width: colWidth }}>Disassembly Cost Distribution %</TFTh>
								)}
								<TFTh style={{ width: colWidth }}>Cost per Unit</TFTh>
								<TFTh style={{ width: colWidth }} isRight>
									Total Cost
								</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>
						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<ProductBomLinesRow
											index={index}
											key={field.id}
											fields={fields}
											errors={errors}
											update={update}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
											isAssembly={isAssembly}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
										<TFThFoot></TFThFoot>
										{isAssembly ? (
											<>
												<TFThFoot></TFThFoot>
												<TFThFoot></TFThFoot>
											</>
										) : (
											<TFThFoot></TFThFoot>
										)}
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

			<>
				<TFAddRow>
					<Button type="button" isSecondary onClick={() => append(DefaultProductBOMLineFormValues)}>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#plus" />
						</svg>
						Add Row
					</Button>
				</TFAddRow>
				<TFHr />
			</>
		</TF>
	);
};
