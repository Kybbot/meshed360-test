import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
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

type EditDialogProps = {
	dialogState: boolean;
	currentItemIndex: number;
	currentItems: ContactsType[];
	handleClearCurrentItem: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const EditDialog: FC<EditDialogProps> = ({
	dialogState,
	currentItems,
	currentItemIndex,
	setDialogState,
	handleClearCurrentItem,
}) => {
	const { supplierId } = useParams();

	const { isPending, isSuccess, isError, error, mutate } = useUpdateSupplierContacts();

	const cuurentItem = useMemo(
		() => currentItems.find((_item, index) => index === currentItemIndex),
		[currentItems, currentItemIndex],
	);

	const {
		watch,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: cuurentItem?.name ?? "",
			phone: cuurentItem?.phone ?? "",
			email: cuurentItem?.email ?? "",
			comment: cuurentItem?.comment ?? "",
		},
	});

	const phone = watch("phone");
	const email = watch("email");

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const onSubmit = (formData: FormValues) => {
		const { phone, email, ...rest } = formData;
		const updatedArr = currentItems.map((item, index) => {
			if (index === currentItemIndex) {
				return {
					...item,
					...rest,
					phone: phone || undefined,
					email: email || undefined,
				};
			}

			return item;
		});

		if (supplierId) {
			mutate({
				supplierId,
				body: updatedArr,
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
			<DialogContent size="big" onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Edit Contact</h3>
						</DialogTitle>
					</div>
					<form className="commonDialog__form" onSubmit={handleSubmit(onSubmit)}>
						<div className="commonDialog__row">
							<InputRhf<FormValues>
								type="text"
								id="nameId"
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

						<div className="commonDialog__btns ">
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
