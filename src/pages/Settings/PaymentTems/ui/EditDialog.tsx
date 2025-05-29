import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { useUpdatePaymentTerm } from "../api/mutations/useUpdatePaymentTerm";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { FormSelect, SelectItem } from "@/components/shared/form/FormSelect";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { PaymentTermsMethods, PaymentTermType } from "@/@types/paymentTerms";

type FormValues = {
	description: string;
	method: string;
	durationDays: string;
};

type EditDialogProps = {
	dialogState: boolean;
	currentItem: PaymentTermType;
	handleClearCurrentItem: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const EditDialog: FC<EditDialogProps> = ({
	dialogState,
	currentItem,
	setDialogState,
	handleClearCurrentItem,
}) => {
	const { isPending, isSuccess, isError, error, mutate, reset } = useUpdatePaymentTerm();

	const {
		watch,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			description: currentItem.description,
			method: currentItem.method.toString(),
			durationDays: currentItem.durationDays?.toString() ?? "",
		},
	});

	const method = watch("method");

	const handleCloseModal = () => {
		reset();
		handleClearCurrentItem();
	};

	const onSubmit = (formData: FormValues) => {
		if (currentItem.id) {
			mutate({
				paymentTermId: currentItem.id,
				body: {
					description: formData.description,
					method: +formData.method,
					...(formData.durationDays !== ""
						? { durationDays: +formData.durationDays }
						: { durationDays: null }),
					default: currentItem.default,
				},
			});
		}
	};

	useEffect(() => {
		if (isSuccess) {
			handleClearCurrentItem();
			setDialogState(false);
		}
	}, [isSuccess, handleClearCurrentItem, setDialogState]);

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Edit Payment Term</h3>
						</DialogTitle>
					</div>
					<form className="commonDialog__form" onSubmit={handleSubmit(onSubmit)}>
						<InputRhf<FormValues>
							type="text"
							name="description"
							id="descriptionId"
							label="Description*"
							register={register}
							rules={{
								required: "Required",
							}}
							error={errors.description?.message}
						/>

						<div className="commonDialog__row commonDialog__row--small">
							<InputRhf<FormValues>
								type="number"
								name="durationDays"
								id="durationDaysId"
								register={register}
								disabled={method === "5" || method === "6"}
								label={`${method === "5" || method === "6" ? "Day" : "Day*"}`}
								rules={{
									valueAsNumber: true,
									...(method === "2" || method === "3"
										? {
												min: { value: 0, message: "Enter a value between 0 - 90" },
												max: { value: 90, message: "Enter a value between 0 - 90" },
											}
										: method !== "5" && method !== "6"
											? {
													min: { value: 1, message: "Enter a value between 1 - 31" },
													max: { value: 31, message: "Enter a value between 1 - 31" },
												}
											: {}),
									required: { value: method !== "5" && method !== "6", message: "Required" },
								}}
								error={errors.durationDays?.message}
								hideErrorMessage={
									errors.durationDays?.message === "Enter a value between 0 - 31" ||
									errors.durationDays?.message === "Enter a value between 1 - 31"
								}
							/>
							<Controller
								name="method"
								control={control}
								rules={{
									required: "Required",
									onChange(event) {
										const value = event.target.value;
										if (value === "5" || value === "6") {
											setValue("durationDays", "");
										}
									},
								}}
								render={({ field }) => (
									<FormSelect
										{...field}
										usePortal1
										id="methodId"
										value={field.value}
										placeholder="Method*"
										error={errors.method?.message}
										onValueChange={field.onChange}
									>
										{Object.entries(PaymentTermsMethods).map((item) => (
											<SelectItem key={item[0]} value={item[0]}>
												{item[1]}
											</SelectItem>
										))}
									</FormSelect>
								)}
							/>
							{errors.durationDays?.message &&
								(errors.durationDays.message === "Enter a value between 0 - 31" ||
									errors.durationDays.message === "Enter a value between 1 - 31") && (
									<p role="alert" className="customInput__error commonDialog__row--2columns">
										{errors.durationDays.message}
									</p>
								)}
						</div>

						<div className="commonDialog__btns">
							<DialogClose asChild>
								<Button type="button" isSecondary onClick={handleCloseModal}>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#cancel" />
									</svg>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" isLoading={isPending} disabled={isPending}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
						</div>
						{isError && error && <ErrorMessage error={error} />}
					</form>
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
