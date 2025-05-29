import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";

import { useUpdateSupplierContacts } from "../../../api/mutations/useUpdateSupplierContact";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { ContactsType } from "@/@types/suppliers";

type FormValues = {
	name: string;
	phone: string;
	email: string;
	comment: string;
};

type NewDialogProps = {
	dialogState: boolean;
	currentItems: ContactsType[];
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const NewDialog: FC<NewDialogProps> = ({ currentItems, dialogState, setDialogState }) => {
	const { supplierId } = useParams();

	const { isPending, isSuccess, isError, error, mutate } = useUpdateSupplierContacts();

	const {
		watch,
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			comment: "",
		},
	});

	const phone = watch("phone");
	const email = watch("email");

	const handleCloseModal = () => {
		reset();
	};

	const onSubmit = (formData: FormValues) => {
		const { phone, email, ...rest } = formData;
		const newArray = [
			{
				...rest,
				phone: phone || undefined,
				email: email || undefined,
				isDefault: false,
			},
			...currentItems,
		];

		if (supplierId) {
			mutate({
				supplierId,
				body: newArray,
			});
		}
	};

	useEffect(() => {
		if (isSuccess) {
			reset();
			setDialogState(false);
		}
	}, [isSuccess, reset, setDialogState]);

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent size="big" onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Add Contact</h3>
						</DialogTitle>
					</div>
					<form className="commonDialog__form" onSubmit={handleSubmit(onSubmit)}>
						<div className="commonDialog__row">
							<InputRhf<FormValues>
								type="text"
								id="nameIdNew"
								name="name"
								label="Name*"
								register={register}
								rules={{
									required: "Required",
								}}
								error={errors.name?.message}
							/>

							<InputRhf<FormValues>
								type="text"
								id="phoneId"
								name="phone"
								autoComplete="tel"
								register={register}
								label={`${email ? "Contact Number" : "Contact Number*"}`}
								rules={{
									required: { value: !email, message: "Required" },
								}}
								error={errors.phone?.message}
							/>
						</div>

						<InputRhf<FormValues>
							type="email"
							id="emailId"
							name="email"
							register={register}
							autoComplete="email"
							label={`${phone ? "Email" : "Email*"}`}
							rules={{
								required: { value: !phone, message: "Required" },
							}}
							error={errors.email?.message}
						/>

						<TextareaRhf<FormValues>
							name="comment"
							id="commentId"
							label="Comments"
							register={register}
							error={errors.comment?.message}
						/>

						<div className="commonDialog__btns">
							<DialogClose asChild>
								<Button type="button" isSecondary onClick={handleCloseModal}>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#cancel" />
									</svg>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" isLoading={isPending} disabled={isPending || !supplierId}>
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
