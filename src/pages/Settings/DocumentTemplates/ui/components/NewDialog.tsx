import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateTemplate } from "../../api";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { TemplateTypes } from "@/@types/documentTemplates";

type FormValues = {
	name: string;
};

type NewDialogProps = {
	orgId?: string;
	dialogState: boolean;
	currentTemplateType: TemplateTypes;
	handleClearCurrentTemplateType: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const NewDialog: FC<NewDialogProps> = ({
	orgId,
	dialogState,
	currentTemplateType,
	setDialogState,
	handleClearCurrentTemplateType,
}) => {
	const { isPending, isSuccess, isError, error, mutate } = useCreateTemplate();

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
		handleClearCurrentTemplateType();
	};

	const onSubmit = (formData: FormValues) => {
		if (orgId) {
			mutate({
				body: { name: formData.name, organisationId: orgId, type: currentTemplateType },
			});
		}
	};

	useEffect(() => {
		if (isSuccess) {
			reset();
			handleClearCurrentTemplateType();
			setDialogState(false);
		}
	}, [isSuccess, reset, setDialogState, handleClearCurrentTemplateType]);

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Add New Template</h3>
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
							<Button type="submit" isLoading={isPending} disabled={isPending || !orgId}>
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
