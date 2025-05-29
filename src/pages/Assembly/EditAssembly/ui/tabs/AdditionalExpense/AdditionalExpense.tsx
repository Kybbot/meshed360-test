import { FC, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { TableDayPickerRhf } from "@/components/shared/form/TableDayPickerRhf";

import {
	CommonPageMain,
	CommonPageTitle,
	CommonPageHeader,
	CommonPageStatus,
	CommonPageWrapper,
	CommonPageActions,
	CommonPageSubWrapper,
} from "@/components/widgets/Page";
import {
	TF,
	TFTr,
	TFTh,
	TFTd,
	TFTable,
	TFThead,
	TFTbody,
	TFAddRow,
	TFRemove,
	TFWrapper,
	TFOverflow,
} from "@/components/widgets/Table";
import { FormTableAccountSelect } from "@/components/widgets/Selects";

import {
	useGetAssemblyAdditionalExpense,
	useSaveAssemblyAdditionalExpense,
	useUndoAssemblyAdditionalExpense,
	useVoidAssemblyAdditionalExpense,
	useAuthoriseAssemblyAdditionalExpense,
} from "@/entities/assembly";

import { getDateFromDayPickerDate, getFormDayPickerDate } from "@/utils/date";

import {
	AssemblyAdditionalExpenseLineType,
	AssemblyAdditionalExpenseFormValues,
	DefaultAssemblyAdditionalExpenseLine,
} from "@/@types/assembly/additionalExpense";
import { AssemblyByIdType } from "@/@types/assembly/assembly";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

const validateData = (data: AssemblyAdditionalExpenseFormValues) => {
	const lines = data.lines;

	const lineStrings = lines.map((item) => {
		const { date, ...rest } = item;
		return JSON.stringify({ ...rest, date: getFormDayPickerDate(date) });
	});

	if (hasDuplicateStrings(lineStrings)) {
		toast.error("There are duplicates in the Lines!");
		return false;
	}

	return true;
};

type Props = {
	assemblyData: AssemblyByIdType;
};

export const AdditionalExpenses: FC<Props> = ({ assemblyData }) => {
	const assemblyId = assemblyData.id;
	const assemblyStatus = assemblyData.status;

	const isFirstResetRef = useRef(true);
	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const { data, error, isError, isLoading, isSuccess } = useGetAssemblyAdditionalExpense({ assemblyId });

	const currentAdditionalExpenseStatus = data?.data.additionalExpensesStatus;

	const disabledStatus =
		assemblyStatus === "DRAFT" ||
		assemblyStatus === "CLOSED" ||
		currentAdditionalExpenseStatus === "AUTHORIZED";
	const disableActions = assemblyStatus === "DRAFT" || assemblyStatus === "CLOSED";

	const {
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<AssemblyAdditionalExpenseFormValues>({
		defaultValues: {
			lines: [DefaultAssemblyAdditionalExpenseLine],
		},
	});

	const { update, remove, append, fields } = useFieldArray({
		name: "lines",
		control,
	});

	const { mutateAsync } = useSaveAssemblyAdditionalExpense();
	const { mutate: undo } = useUndoAssemblyAdditionalExpense();
	const { mutate: mutateVoid } = useVoidAssemblyAdditionalExpense();
	const { mutate: authorise } = useAuthoriseAssemblyAdditionalExpense();

	const handleActions = async (type: "undo" | "void") => {
		if (assemblyId) {
			switch (type) {
				case "undo":
					undo({ body: { id: assemblyId } });
					break;
				case "void":
					mutateVoid(
						{ body: { id: assemblyId } },
						{
							onSuccess() {
								reset(
									{
										lines: [DefaultAssemblyAdditionalExpenseLine],
									},
									{ keepDefaultValues: true },
								);
							},
						},
					);
					break;
			}
		}
	};

	const onSubmit = async (formData: AssemblyAdditionalExpenseFormValues) => {
		const isValid = validateData(formData);
		const dataLines = formData.lines.map((line) => {
			const expenseAccount = line.expenseAccount!;

			return {
				expenseAccountId: expenseAccount.id,
				...(line.reference ? { reference: line.reference } : {}),
				...(line.date ? { date: getFormDayPickerDate(line.date, true) } : {}),
				amount: line.amount,
			};
		});

		const newData: AssemblyAdditionalExpenseLineType[] = formData.lines.map((line) => {
			const expenseAccount = line.expenseAccount!;

			return {
				id: "",
				expenseAccount: expenseAccount,
				reference: line.reference || "",
				date: getFormDayPickerDate(line.date, true),
				amount: line.amount,
			};
		});

		if (assemblyId && isValid) {
			await mutateAsync({ newData, body: { orderId: assemblyId, lines: dataLines } });

			if (currentStateRef.current === "authorise") {
				authorise({ body: { id: assemblyId } });
			}
		}
	};

	useEffect(() => {
		if (isFirstResetRef.current && isSuccess && data && data.data) {
			reset(
				data.data.lines.length > 0
					? {
							lines: data.data.lines.map((line) => ({
								expenseAccount: line.expenseAccount,
								reference: line.reference || "",
								date: getDateFromDayPickerDate(line.date),
								amount: line.amount,
							})),
						}
					: { lines: [DefaultAssemblyAdditionalExpenseLine] },
				{ keepDefaultValues: true },
			);

			isFirstResetRef.current = false;
		}
	}, [isSuccess, data, reset]);

	return (
		<CommonPageWrapper>
			{isLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess && data.data ? (
				<>
					<CommonPageHeader>
						<CommonPageSubWrapper>
							{data.data.additionalExpensesStatus && data.data.lines.length > 0 ? (
								<CommonPageStatus
									isRed={data.data.additionalExpensesStatus === "VOID"}
									isYellow={data.data.additionalExpensesStatus === "DRAFT"}
									isGreen={data.data.additionalExpensesStatus === "AUTHORIZED"}
								>
									{data.data.additionalExpensesStatus.toLocaleLowerCase()}
								</CommonPageStatus>
							) : (
								<CommonPageStatus>New</CommonPageStatus>
							)}
							<CommonPageTitle>Additional Expenses</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							{!disableActions && (
								<DropdownMenuRoot modal={false}>
									<DropdownMenuTrigger asChild>
										<Button type="button">
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#dotsInCicle" />
											</svg>
											Actions
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
										{data.data.additionalExpensesStatus !== "AUTHORIZED" && (
											<DropdownMenuItem
												className="dropDown__item"
												onSelect={() => {
													if (formRef.current) {
														currentStateRef.current = "save";
														formRef.current.requestSubmit();
													}
												}}
											>
												Save
											</DropdownMenuItem>
										)}
										{data.data.additionalExpensesStatus === "DRAFT" && (
											<DropdownMenuItem
												className="dropDown__item"
												onSelect={() => {
													if (formRef.current) {
														currentStateRef.current = "authorise";
														formRef.current.requestSubmit();
													}
												}}
											>
												Authorise
											</DropdownMenuItem>
										)}
										{data.data.additionalExpensesStatus === "AUTHORIZED" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
												Undo
											</DropdownMenuItem>
										)}
										{data.data.lines.length > 0 && data.data.additionalExpensesStatus === "DRAFT" && (
											<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
												Void
											</DropdownMenuItem>
										)}
									</DropdownMenu>
								</DropdownMenuRoot>
							)}
						</CommonPageActions>
					</CommonPageHeader>
					<CommonPageMain>
						<form
							ref={formRef}
							id="additionalExpensesForm"
							className="commonPage__main"
							onSubmit={handleSubmit(onSubmit)}
						>
							<TF>
								<TFWrapper>
									<TFOverflow>
										<TFTable>
											<TFThead>
												<TFTr>
													<TFTh style={{ width: "25%" }}>Expense Account</TFTh>
													<TFTh style={{ width: "25%" }}>Reference</TFTh>
													<TFTh style={{ width: "25%" }}>Date</TFTh>
													<TFTh style={{ width: "25%" }}>Amount</TFTh>
													<TFTh isActions></TFTh>
												</TFTr>
											</TFThead>
											{fields.length > 0 ? (
												<>
													<TFTbody>
														{fields.map((field, index) => (
															<TFTr key={field.id}>
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
																				id="expenseAccountId"
																				type="expenseAccounts"
																				disabled={disabledStatus}
																				onValueChange={field.onChange}
																				error={errors?.lines?.[index]?.expenseAccount?.message}
																			/>
																		)}
																	/>
																</TFTd>
																<TFTd>
																	<TableInputRhf<AssemblyAdditionalExpenseFormValues>
																		type="text"
																		id="referenceId"
																		label="Reference"
																		register={register}
																		disabled={disabledStatus}
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
																					placeholder="dd/mm/yyyy"
																					disabled={disabledStatus}
																					onValueChange={field.onChange}
																					error={errors?.lines?.[index]?.date?.message}
																				/>
																			);
																		}}
																	/>
																</TFTd>
																<TFTd>
																	<TableInputRhf<AssemblyAdditionalExpenseFormValues>
																		step={0.01}
																		type="number"
																		id="amountId"
																		label="Amount"
																		register={register}
																		rules={{
																			min: 0,
																			required: "Required",
																			onChange(event) {
																				const value = +event.target.value;

																				if (value < 0) {
																					setValue(`lines.${index}.amount`, "0");
																				}
																			},
																		}}
																		disabled={disabledStatus}
																		name={`lines.${index}.amount`}
																		error={errors?.lines?.[index]?.amount?.message}
																	/>
																</TFTd>
																<TFTd>
																	{!disabledStatus && (
																		<TFRemove
																			onClick={() => {
																				if (fields.length === 1 && index === 0) {
																					update(index, DefaultAssemblyAdditionalExpenseLine);
																				} else {
																					remove(index);
																				}
																			}}
																		/>
																	)}
																</TFTd>
															</TFTr>
														))}
													</TFTbody>
												</>
											) : (
												<TFTbody>
													<TFTr>
														<TFTd isEmpty colSpan={5}>
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
										<Button
											isSecondary
											type="button"
											onClick={() => append(DefaultAssemblyAdditionalExpenseLine)}
										>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#plus" />
											</svg>
											Add Row
										</Button>
									</TFAddRow>
								)}
							</TF>
						</form>
					</CommonPageMain>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
