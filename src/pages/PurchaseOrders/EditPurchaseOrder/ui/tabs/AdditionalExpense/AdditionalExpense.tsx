import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { Lines } from "./ui/Lines";

import {
	useAddAdditionalExpense,
	useGetAdditionalExpense,
	useUndoAdditionalExpense,
	useVoidAdditionalExpense,
	useAuthoriseAdditionalExpense,
} from "./api";
import { useGetBills } from "../Bill/api";

import {
	getNormalizedResetData,
	getNormalizedCreateAdditionalExpenseData,
} from "./utils/getNormalizedAdditionalExpenseDate";
import { validateData } from "./utils/validateData";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

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
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";

import {
	AdditionalExpenseAllocate,
	AdditionalExpenseFormValues,
	DefaultAdditionalExpenseLine,
} from "@/@types/purchaseOrder/additionalExpense";
import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	orderData: GetPurchaseOrderByIdResponseType;
};

export const AdditionalExpenses: FC<Props> = ({ orderData }) => {
	const orderId = orderData.id;
	const orderStatus = orderData.status;
	const taxInclusive = orderData.taxInclusive;

	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const { data, error, isLoading, isSuccess, isError } = useGetAdditionalExpense({
		purchaseOrderId: orderId,
	});

	const {
		data: bills,
		error: billsError,
		isError: isBillsError,
		isLoading: isBillsLoading,
		isSuccess: isBillsSuccess,
	} = useGetBills({ purchaseOrderId: orderId });

	const currentAdditionalExpense = data?.data;

	const disabledStatus =
		orderStatus === "VOID" ||
		orderStatus === "DRAFT" ||
		orderStatus === "CLOSED" ||
		currentAdditionalExpense?.status === "AUTHORIZED";

	const {
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<AdditionalExpenseFormValues>({
		defaultValues: {
			lines: [DefaultAdditionalExpenseLine],
		},
	});

	const handleNewAdditionalExpense = () => {
		reset({
			lines: [DefaultAdditionalExpenseLine],
		});
	};

	const handleAddAllocation = (index: number, data: AdditionalExpenseAllocate[]) => {
		setValue(`lines.${index}.allocation`, data);
	};

	const { mutateAsync } = useAddAdditionalExpense();
	const { mutate: undo } = useUndoAdditionalExpense();
	const { mutate: mutateVoid } = useVoidAdditionalExpense();
	const { mutate: authorise } = useAuthoriseAdditionalExpense();

	const handleActions = async (type: "undo" | "void") => {
		if (orderId) {
			switch (type) {
				case "undo":
					undo({ body: { id: orderId } });
					break;
				case "void":
					mutateVoid(
						{ body: { id: orderId } },
						{
							onSuccess() {
								handleNewAdditionalExpense();
							},
						},
					);
					break;
			}
		}
	};

	const onSubmit = async (formData: AdditionalExpenseFormValues) => {
		const data = getNormalizedCreateAdditionalExpenseData(formData);
		const isValid = validateData(data);

		if (orderId && isValid) {
			await mutateAsync({ body: { orderId, ...data } });

			if (currentStateRef.current === "authorise") {
				authorise({ body: { id: orderId } });
			}
		}
	};

	useEffect(() => {
		if (isSuccess && data && data.data && bills && bills.data) {
			const resetData = getNormalizedResetData(data.data, bills.data.bills, taxInclusive);
			reset(resetData, { keepDefaultValues: true });
		}
	}, [isSuccess, data, bills, taxInclusive, reset]);

	return (
		<CommonPageWrapper>
			{isLoading || isBillsLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isBillsError && billsError ? (
				<ErrorMessage error={billsError} />
			) : isSuccess && isBillsSuccess && bills.data ? (
				<>
					<CommonPageHeader>
						<CommonPageSubWrapper>
							{currentAdditionalExpense ? (
								<CommonPageStatus
									isRed={currentAdditionalExpense.status === "VOID"}
									isYellow={currentAdditionalExpense.status === "DRAFT"}
									isGreen={currentAdditionalExpense.status === "AUTHORIZED"}
								>
									{currentAdditionalExpense.status.toLocaleLowerCase()}
								</CommonPageStatus>
							) : (
								<CommonPageStatus>New</CommonPageStatus>
							)}
							<CommonPageTitle>Additional Expenses</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
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
									{currentAdditionalExpense?.status !== "AUTHORIZED" && (
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
									{currentAdditionalExpense?.status === "DRAFT" && (
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
									{currentAdditionalExpense?.status === "AUTHORIZED" && (
										<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
											Undo
										</DropdownMenuItem>
									)}
									{currentAdditionalExpense?.status === "DRAFT" && (
										<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
											Void
										</DropdownMenuItem>
									)}
								</DropdownMenu>
							</DropdownMenuRoot>
						</CommonPageActions>
					</CommonPageHeader>
					<CommonPageMain>
						<form
							ref={formRef}
							id="additionalExpensesForm"
							className="commonPage__main"
							onSubmit={handleSubmit(onSubmit)}
						>
							<Lines
								errors={errors}
								control={control}
								register={register}
								bills={bills.data.bills}
								taxInclusive={taxInclusive}
								disabledStatus={disabledStatus}
								handleAddAllocation={handleAddAllocation}
							/>
						</form>
					</CommonPageMain>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</CommonPageWrapper>
	);
};
