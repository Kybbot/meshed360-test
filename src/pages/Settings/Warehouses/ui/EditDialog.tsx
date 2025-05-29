import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useUpdateWarehouse } from "../api/mutations/useUpdateWarehouse";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { WarehousType } from "@/@types/warehouses";

type FormValues = {
	name: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	postalCode: string;
	state: string;
	country: string;
	comments: string;
};

type EditDialogProps = {
	orgId?: string;
	dialogState: boolean;
	currentItem: WarehousType;
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
	const { isPending, isSuccess, isError, error, mutate } = useUpdateWarehouse();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: currentItem.name,
			addressLine1: currentItem.addressDetails.addressLine1,
			addressLine2: currentItem.addressDetails.addressLine2,
			city: currentItem.addressDetails.city,
			postalCode: currentItem.addressDetails.postalCode,
			state: currentItem.addressDetails.state,
			country: currentItem.addressDetails.country,
			comments: currentItem.comments,
		},
	});

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const onSubmit = (formData: FormValues) => {
		if (orgId && currentItem.id) {
			mutate({
				warehousesId: currentItem.id,
				body: {
					name: formData.name,
					comments: formData.comments,
					addressDetails: {
						city: formData.city,
						state: formData.state,
						country: formData.country,
						postalCode: formData.postalCode,
						addressLine1: formData.addressLine1,
						addressLine2: formData.addressLine2,
					},
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
							<h3 className="commonDialog__title">Edit Warehouse</h3>
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
							type="text"
							name="addressLine1"
							id="addressLine1Id"
							label="Address Line 1"
							autoComplete="address-line1"
							register={register}
							error={errors.addressLine1?.message}
						/>

						<InputRhf<FormValues>
							type="text"
							name="addressLine2"
							id="addressLine2Id"
							label="Address Line 2"
							autoComplete="address-line2"
							register={register}
							error={errors.addressLine2?.message}
						/>

						<InputRhf<FormValues>
							type="text"
							name="city"
							id="cityId"
							label="City/Suburb"
							register={register}
							error={errors.city?.message}
						/>

						<InputRhf<FormValues>
							type="text"
							name="state"
							id="stateId"
							label="Province"
							register={register}
							error={errors.state?.message}
						/>

						<InputRhf<FormValues>
							type="text"
							name="postalCode"
							id="postalCodeId"
							label="Postal Code"
							autoComplete="postal-code"
							register={register}
							error={errors.postalCode?.message}
						/>

						<InputRhf<FormValues>
							type="text"
							name="country"
							id="countryId"
							label="Country"
							register={register}
							error={errors.country?.message}
						/>

						<TextareaRhf<FormValues>
							name="comments"
							id="commentsId"
							label="Comments"
							register={register}
							error={errors.comments?.message}
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
