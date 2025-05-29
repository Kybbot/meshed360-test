import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useUpdateBrand } from "../api/mutations/useUpdatedBrand";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { BrandType } from "@/@types/brands";

type FormValues = {
	name: string;
};

type EditDialogProps = {
	orgId?: string;
	dialogState: boolean;
	currentItem: BrandType;
	handleClearCurrentItem: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const EditDialog: FC<EditDialogProps> = ({
	orgId,
	dialogState,
	currentItem,
	handleClearCurrentItem,
	setDialogState,
}) => {
	const { isPending, isSuccess, isError, error, mutate } = useUpdateBrand();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: currentItem.name,
		},
	});

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const onSubmit = (formData: FormValues) => {
		if (orgId && currentItem.id) {
			mutate({
				brandId: currentItem.id,
				body: { ...formData, organisationId: orgId },
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
							<h3 className="commonDialog__title">Edit Brand</h3>
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
