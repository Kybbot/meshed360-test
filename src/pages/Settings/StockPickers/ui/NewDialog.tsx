import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateStockPicker } from "../api/mutations/useCreateStockPicker";

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
};

type NewDialogProps = {
	orgId?: string;
	dialogState: boolean;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const NewDialog: FC<NewDialogProps> = ({ orgId, dialogState, setDialogState }) => {
	const { isPending, isSuccess, isError, error, mutate } = useCreateStockPicker();

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
		},
	});

	const handleCloseModal = () => {
		reset();
	};

	const onSubmit = (formData: FormValues) => {
		if (orgId) {
			mutate({
				organisationId: orgId,
				body: { ...formData },
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
							<h3 className="commonDialog__title">Add Stock Picker</h3>
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
