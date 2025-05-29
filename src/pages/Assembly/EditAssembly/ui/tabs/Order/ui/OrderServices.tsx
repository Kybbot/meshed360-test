import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { OrderServicesRow } from "./OrderServicesRow";

import { calculateFooterValues2 } from "../utils/calculate";

import { Button } from "@/components/shared/Button";

import {
	TF,
	TFAddRow,
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

import { AssemblyFormValues, DefaultAssemblyService } from "@/@types/assembly/assembly";

type Props = {
	disabledStatus: boolean;
	errors: FieldErrors<AssemblyFormValues>;
	control: Control<AssemblyFormValues, unknown>;
	register: UseFormRegister<AssemblyFormValues>;
	setValue: UseFormSetValue<AssemblyFormValues>;
};

export const OrderServices: FC<Props> = ({ errors, control, disabledStatus, register, setValue }) => {
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
								<TFTh style={{ width: "25%" }}>Labour & Overheads</TFTh>
								<TFTh style={{ width: "15%" }}>Quantity</TFTh>
								<TFTh style={{ width: "25%" }}>Expense Account</TFTh>
								<TFTh style={{ width: "15%" }}>Unit Cost</TFTh>
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
										<OrderServicesRow
											index={index}
											key={field.id}
											errors={errors}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
											disabledStatus={disabledStatus}
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

			{!disabledStatus && (
				<TFAddRow>
					<Button type="button" isSecondary onClick={() => append(DefaultAssemblyService)}>
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
