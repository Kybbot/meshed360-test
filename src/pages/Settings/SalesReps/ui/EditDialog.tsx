import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useUpdateSalesRep } from "../api/mutations/useUpdateSalesRep";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { SalesRepType } from "@/@types/salesReps";

type FormValues = {
	name: string;
	email: string;
	contactNumber: string;
};

type EditDialogProps = {
	dialogState: boolean;
	currentItem: SalesRepType;
	handleClearCurrentItem: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const EditDialog: FC<EditDialogProps> = ({
	dialogState,
	currentItem,
	setDialogState,
	handleClearCurrentItem,
}) => {
	const { isPending, isSuccess, isError, error, mutate } = useUpdateSalesRep();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: currentItem.name,
			email: currentItem.email,
			contactNumber: currentItem.phone,
		},
	});

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const onSubmit = (formData: FormValues) => {
		if (currentItem.id) {
			mutate({
				salesRepId: currentItem.id,
				body: formData,
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
							<h3 className="commonDialog__title">Edit Sales Rep</h3>
						</DialogTitle>
					</div>
					<form className="commonDialog__form" onSubmit={handleSubmit(onSubmit)}>
						<InputRhf<FormValues>
							type="text"
							name="name"
							id="nameId"
							label="Name*"
							register={register}
							rules={{
								required: "Required",
							}}
							error={errors.name?.message}
						/>

						<InputRhf<FormValues>
							type="email"
							name="email"
							id="emailId"
							autoComplete="email"
							label="Email address*"
							register={register}
							rules={{
								required: "Required",
							}}
							error={errors.email?.message}
						/>

						<InputRhf<FormValues>
							type="text"
							autoComplete="tel"
							name="contactNumber"
							id="contactNumberId"
							label="Contact Number"
							register={register}
							error={errors.contactNumber?.message}
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
