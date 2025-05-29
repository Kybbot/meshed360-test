import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { useUpdateSupplierAddress } from "../../../api/mutations/useUpdateSupplierAddress";

import { getNormalizedNewAddressData } from "../../../utils/addressesData";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { address, addressByKey, AddressFormValue, NormalizedAddressesData } from "@/@types/suppliers";

type EditDialogProps = {
	dialogState: boolean;
	currentItemIndex: number;
	currentItems: NormalizedAddressesData;
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

	const { isPending, isSuccess, isError, error, mutate } = useUpdateSupplierAddress();

	const cuurentItem = useMemo(
		() => currentItems.addresses.find((_item, index) => index === currentItemIndex),
		[currentItems, currentItemIndex],
	);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AddressFormValue>({
		defaultValues: {
			addressLine1: cuurentItem?.addressLine1 ?? "",
			addressLine2: cuurentItem?.addressLine2 ?? "",
			addressLine3: cuurentItem?.addressLine3 ?? "",
			addressLine4: cuurentItem?.addressLine4 ?? "",
			addressType: cuurentItem?.addressType
				? (addressByKey[cuurentItem.addressType] as AddressFormValue["addressType"])
				: undefined,
			postalCode: cuurentItem?.postalCode ?? "",
			city: cuurentItem?.city ?? "",
			region: cuurentItem?.region ?? "",
			country: cuurentItem?.country ?? "",
		},
	});

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const onSubmit = (formData: AddressFormValue) => {
		const currentItem = getNormalizedNewAddressData(formData);

		const updatedArr = currentItems.addresses.map((item, index) => {
			if (index === currentItemIndex) {
				return {
					...currentItem,
					isDefault: item.isDefault,
				};
			}

			return item;
		});

		if (supplierId) {
			mutate({
				supplierId,
				body: { addresses: updatedArr },
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
							<h3 className="commonDialog__title">Edit Address</h3>
						</DialogTitle>
					</div>
					<form className="commonDialog__form commonDialog__form--2columns" onSubmit={handleSubmit(onSubmit)}>
						<InputRhf<AddressFormValue>
							type="text"
							id="addressLine1Id"
							name="addressLine1"
							label="Address Line 1*"
							autoComplete="address-line1"
							register={register}
							rules={{
								required: "Required",
							}}
							error={errors.addressLine1?.message}
						/>

						<InputRhf<AddressFormValue>
							type="text"
							id="addressLine2Id"
							name="addressLine2"
							label="Address Line 2"
							autoComplete="address-line2"
							register={register}
							error={errors.addressLine2?.message}
						/>

						<InputRhf<AddressFormValue>
							type="text"
							id="addressLine3Id"
							name="addressLine3"
							label="Address Line 3"
							autoComplete="address-line3"
							register={register}
							error={errors.addressLine3?.message}
						/>

						<InputRhf<AddressFormValue>
							type="text"
							id="addressLine4Id"
							name="addressLine4"
							label="Address Line 4"
							register={register}
							error={errors.addressLine4?.message}
						/>

						<Controller
							name="addressType"
							control={control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => (
								<CustomSelect
									{...field}
									id="addressTypeId"
									value={field.value}
									allowUnselect={false}
									placeholder="Address Type*"
									customValues={address}
									onValueChange={field.onChange}
									error={errors.addressType?.message}
								/>
							)}
						/>

						<InputRhf<AddressFormValue>
							type="text"
							id="postalCodeId"
							name="postalCode"
							label="Postal Code"
							autoComplete="postal-code"
							register={register}
							error={errors.postalCode?.message}
						/>

						<InputRhf<AddressFormValue>
							type="text"
							name="city"
							id="cityId"
							label="City"
							register={register}
							error={errors.city?.message}
						/>

						<InputRhf<AddressFormValue>
							type="text"
							name="region"
							id="regionId"
							label="Province"
							register={register}
							error={errors.region?.message}
						/>

						<InputRhf<AddressFormValue>
							type="text"
							name="country"
							id="countryId"
							label="Country"
							register={register}
							error={errors.country?.message}
						/>

						<div className="commonDialog__btns commonDialog__btns--2columns">
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
