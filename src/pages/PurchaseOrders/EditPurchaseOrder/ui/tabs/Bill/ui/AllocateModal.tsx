import { FC, useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { AllocateModalRow } from "./AllocateModalRow";

import { getNormalizedResetData } from "../utils/getNormalizedModalData";

import {
	DialogRoot,
	DialogTitle,
	DialogClose,
	DialogTrigger,
	DialogContent,
} from "@/components/shared/Dialog";
import { Button } from "@/components/shared/Button";

import {
	TF,
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

import {
	BillType,
	BillAllocate,
	BillLineFormType,
	BillModalFormValues,
	DefaultBillModalAllocate,
	BillAdditionalCostFormType,
} from "@/@types/purchaseOrders";

type Props = {
	amount: string;
	disabled: boolean;
	taxInclusive: boolean;
	currentBill?: BillType;
	linesValues: BillLineFormType[];
	serviceLineValues: BillAdditionalCostFormType;
	handleAddAllocation: (data: BillAllocate[]) => void;
};

export const AllocateModal: FC<Props> = ({
	amount,
	disabled,
	linesValues,
	currentBill,
	taxInclusive,
	serviceLineValues,
	handleAddAllocation,
}) => {
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	const {
		watch,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BillModalFormValues>({
		defaultValues: {
			additionalLines: [DefaultBillModalAllocate],
		},
	});

	const { fields } = useFieldArray({
		name: "additionalLines",
		control,
	});

	const disabledStatus = false;

	const allValues = watch("additionalLines");

	const additionalCostSum = allValues.reduce((acc, line) => acc + +line.cost, 0);
	const billTotalSum = allValues.reduce((acc, line) => acc + +line.billTotal, 0);

	const onSubmit = (formData: BillModalFormValues) => {
		handleAddAllocation(formData.additionalLines);
		if (closeBtnRef.current) closeBtnRef.current.click();
	};

	useEffect(() => {
		if (!disabled && linesValues && serviceLineValues) {
			const data = getNormalizedResetData(linesValues, serviceLineValues, taxInclusive, currentBill);
			setValue("additionalLines", data);
		}
	}, [disabled, linesValues, serviceLineValues, currentBill, taxInclusive, setValue]);

	return (
		<DialogRoot>
			<DialogTrigger asChild>
				<button type="button" className="formTable__btn" disabled={disabled}>
					Allocate
				</button>
			</DialogTrigger>
			<DialogContent size="large" removeOverflow>
				<div className="commonDialog">
					<div className="commonDialog__header commonDialog__header--complex">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Additional Cost Disbursement</h3>
						</DialogTitle>
						<div className="commonDialog__btns">
							<DialogClose asChild>
								<Button ref={closeBtnRef} type="button" isSecondary>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#cancel" />
									</svg>
									Cancel
								</Button>
							</DialogClose>
							<Button type="button" onClick={handleSubmit(onSubmit)}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
						</div>
					</div>
					<form className="commonDialog__form">
						<TF>
							<TFWrapper>
								<TFOverflow>
									<TFTable>
										<TFThead>
											<TFTr>
												<TFTh style={{ width: "33%" }}>Product</TFTh>
												<TFTh style={{ width: "33%" }}>Bill Total</TFTh>
												<TFTh style={{ width: "33%" }}>Allocate Additional Cost</TFTh>
											</TFTr>
										</TFThead>
										{fields.length > 0 ? (
											<>
												<TFTbody>
													{fields.map((field, index) => (
														<AllocateModalRow
															index={index}
															key={field.id}
															amount={amount}
															fields={fields}
															errors={errors}
															control={control}
															setValue={setValue}
															register={register}
															disabledStatus={disabledStatus}
															additionalCostSum={additionalCostSum}
														/>
													))}
												</TFTbody>
												<TFTfoot>
													<TFTr>
														<TFThFoot>Total</TFThFoot>
														<TFThFoot>{billTotalSum.toFixed(2)}</TFThFoot>
														<TFThFoot>{additionalCostSum.toFixed(2)}</TFThFoot>
													</TFTr>
													<TFTr>
														<TFThFoot>Remaining Allocation Amount</TFThFoot>
														<TFThFoot></TFThFoot>
														<TFThFoot>{(+amount - additionalCostSum).toFixed(2)}</TFThFoot>
													</TFTr>
												</TFTfoot>
											</>
										) : (
											<TFTbody>
												<TFTr>
													<TFTd isEmpty colSpan={3}>
														No data available
													</TFTd>
												</TFTr>
											</TFTbody>
										)}
									</TFTable>
								</TFOverflow>
							</TFWrapper>
						</TF>
					</form>
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
