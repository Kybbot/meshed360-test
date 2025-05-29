import { FC, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { useFieldArray, useForm } from "react-hook-form";

import { MultipleAllocateModalRow } from "./MultipleAllocateModalRow";
import { MultipleAllocateModalBillsSelect } from "./MultipleAllocateModalBillsSelect";

import { useGetOrganisationBills } from "../api";

import { getNormalizedCopyBillData, getNormalizedResetData } from "../utils/getNormalizedMultipleModalData";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { CustomModal } from "@/components/shared/CustomModal";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

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

import { orgStore } from "@/app/stores/orgStore";

import {
	OrgBillType,
	BillAllocate,
	BillAllocationType,
	BillModalFormValues,
	DefaultBillModalAllocate,
} from "@/@types/purchaseOrders";

type Props = {
	open: boolean;
	amount: string;
	disabled: boolean;
	taxInclusive: boolean;
	allocation: BillAllocationType[];
	onOpenChange(open: boolean): void;
	handleAddAllocation: (data: BillAllocate[]) => void;
};

export const MultipleAllocateModal: FC<Props> = ({
	open,
	amount,
	disabled,
	allocation,
	taxInclusive,
	onOpenChange,
	handleAddAllocation,
}) => {
	const { orgId } = useStore(orgStore);

	const firstRender = useRef(true);
	const closeBtnRef = useRef<HTMLButtonElement>(null);

	const [billIds, setBillIds] = useState<string[]>([]);
	const [currentLines, setCurrentLines] = useState<BillAllocate[]>([]);

	const disabledStatus = !billIds.length;

	const {
		data: bills,
		error: billsError,
		isError: isBillsError,
		isLoading: isBillsLoading,
		isSuccess: isBillsSuccess,
	} = useGetOrganisationBills({ orgId: orgId });

	const {
		reset,
		watch,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BillModalFormValues>({
		defaultValues: {
			additionalLines: [],
		},
	});

	const { remove, update, append, fields } = useFieldArray({
		name: "additionalLines",
		control,
	});

	const allValues = watch("additionalLines");

	const additionalCostSum = allValues.reduce((acc, line) => acc + +line.cost, 0);
	const billTotalSum = allValues.reduce((acc, line) => acc + +line.billTotal, 0);

	const handleSelectBill = (value: OrgBillType) => {
		if (!billIds.includes(value.id)) {
			setBillIds((prev) => {
				if (prev.includes(value.id)) return prev;
				return [...prev, value.id];
			});
			const newAdditionalLines = getNormalizedCopyBillData(value, taxInclusive);
			setCurrentLines((prev) => [...prev, ...newAdditionalLines]);
			append(newAdditionalLines);
		} else {
			setBillIds((prev) => prev.filter((id) => id !== value.id));
			const newAdditionalLines = allValues.filter((line) => line.billId !== value.id);
			setCurrentLines(newAdditionalLines);
			reset({ additionalLines: newAdditionalLines });
		}
	};

	const onSubmit = (formData: BillModalFormValues) => {
		handleAddAllocation(formData.additionalLines);
		if (closeBtnRef.current) closeBtnRef.current.click();
	};

	useEffect(() => {
		if (!disabled && firstRender.current && allocation.length > 0 && bills?.data) {
			setBillIds(allocation.map((item) => item.billId));
			const resetData = getNormalizedResetData(allocation, bills.data, taxInclusive);
			setCurrentLines(resetData.additionalLines);
			reset(resetData, { keepDefaultValues: true });
			firstRender.current = false;
		}
	}, [disabled, allocation, bills, taxInclusive, reset]);

	return (
		<CustomModal open={open} size="large" onOpenChange={onOpenChange}>
			<div className="customModal__body">
				<div className="customModal__header customModal__header--complex">
					<h3 className="customModal__title">Additional Cost Disbursement</h3>
					<div className="customModal__btns">
						{isBillsSuccess && bills.data.length > 0 && (
							<MultipleAllocateModalBillsSelect
								id="billsSelectId"
								billIds={billIds}
								customValues={bills.data}
								onValueChange={handleSelectBill}
							/>
						)}
						{billIds.length > 0 && (
							<Button isSecondary type="button" onClick={() => append(DefaultBillModalAllocate)}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#plus" />
								</svg>
								Add Row
							</Button>
						)}
						<Button ref={closeBtnRef} type="button" isSecondary onClick={() => onOpenChange(false)}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#cancel" />
							</svg>
							Cancel
						</Button>
						{isBillsSuccess && bills.data.length > 0 && (
							<Button type="button" onClick={handleSubmit(onSubmit)}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
						)}
					</div>
				</div>
				{isBillsLoading ? (
					<Loader isFullWidth />
				) : isBillsError && billsError ? (
					<ErrorMessage error={billsError} />
				) : isBillsSuccess && bills.data.length > 0 ? (
					<form className="commonDialog__form">
						<TF>
							<TFWrapper>
								<TFOverflow>
									<TFTable>
										<TFThead>
											<TFTr>
												<TFTh style={{ width: "25%" }}>Product</TFTh>
												<TFTh style={{ width: "25%" }}>Reference</TFTh>
												<TFTh style={{ width: "25%" }}>Bill Total</TFTh>
												<TFTh style={{ width: "25%" }}>Allocate Additional Cost</TFTh>
												<TFTh isActions></TFTh>
											</TFTr>
										</TFThead>
										{fields.length > 0 ? (
											<>
												<TFTbody>
													{fields.map((field, index) => (
														<MultipleAllocateModalRow
															index={index}
															key={field.id}
															amount={amount}
															errors={errors}
															update={update}
															remove={remove}
															control={control}
															setValue={setValue}
															register={register}
															currentLines={currentLines}
															disabledStatus={disabledStatus}
															additionalCostSum={additionalCostSum}
														/>
													))}
												</TFTbody>
												<TFTfoot>
													<TFTr>
														<TFThFoot>Total</TFThFoot>
														<TFThFoot></TFThFoot>
														<TFThFoot>{billTotalSum.toFixed(2)}</TFThFoot>
														<TFThFoot>{additionalCostSum.toFixed(2)}</TFThFoot>
														<TFThFoot isActions></TFThFoot>
													</TFTr>
													<TFTr>
														<TFThFoot>Remaining Allocation Amount</TFThFoot>
														<TFThFoot></TFThFoot>
														<TFThFoot></TFThFoot>
														<TFThFoot>{(+amount - additionalCostSum).toFixed(2)}</TFThFoot>
														<TFThFoot isActions></TFThFoot>
													</TFTr>
												</TFTfoot>
											</>
										) : (
											<TFTbody>
												<TFTr>
													<TFTd isEmpty colSpan={5}>
														Please select a Bill
													</TFTd>
												</TFTr>
											</TFTbody>
										)}
									</TFTable>
								</TFOverflow>
							</TFWrapper>
						</TF>
					</form>
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CustomModal>
	);
};
