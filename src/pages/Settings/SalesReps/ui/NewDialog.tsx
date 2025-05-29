import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateSalesRep } from "../api/mutations/useCreateSalesRep";

import {
	DialogClose,
	DialogContent,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/shared/Dialog";
import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

type FormValues = {
	name: string;
	email: string;
	contactNumber: string;
};

type NewDialogProps = {
	orgId?: string;
	dialogState: boolean;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const NewDialog: FC<NewDialogProps> = ({ orgId, dialogState, setDialogState }) => {
	const { isPending, isSuccess, isError, error, mutate } = useCreateSalesRep();

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			email: "",
			contactNumber: "",
		},
	});

	const handleCloseModal = () => {
		reset();
	};

	const onSubmit = (formData: FormValues) => {
		if (orgId) {
			mutate({
				body: { ...formData, organisationId: orgId },
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
			<DialogTrigger asChild>
				<Button type="button" isSecondary disabled={!orgId}>
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#plus" />
					</svg>
					Add
				</Button>
			</DialogTrigger>
			<DialogContent onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Add Sales Rep</h3>
						</DialogTitle>
					</div>
					<form className="commonDialog__form" onSubmit={handleSubmit(onSubmit)}>
						<InputRhf<FormValues>
							type="text"
							name="name"
							id="nameId"
							label="Name*"
							autoComplete="given-name"
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
