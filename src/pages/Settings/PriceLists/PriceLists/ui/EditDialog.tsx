import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { useUpdatePriceList } from "../../api/mutations/useUpdatePriceList";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { useGetCurrenciesName } from "@/entities/currencies";

import { SelectOption } from "@/@types/selects";
import { PriceListType } from "@/@types/priceLists";

type FormValues = {
	name: string;
	currency: SelectOption;
};

type EditDialogProps = {
	orgId?: string;
	dialogState: boolean;
	currentItem: PriceListType;
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
	const {
		isLoading: isCurrenciesLoading,
		isError: isCurrenciesError,
		isSuccess: isCurrenciesSuccess,
		error: currenciesError,
		data: currenciesData,
	} = useGetCurrenciesName({ organisationId: orgId });

	const {
		isPending: isUpdatePriceListPending,
		isSuccess: isUpdatePriceListSuccess,
		isError: isUpdatePriceListError,
		error: updatePriceListError,
		mutate: updatePriceListMutate,
	} = useUpdatePriceList();

	const {
		reset,
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			currency: undefined,
		},
	});

	const handleCloseModal = () => {
		handleClearCurrentItem();
	};

	const onSubmit = (formData: FormValues) => {
		if (orgId && currentItem.id) {
			updatePriceListMutate({
				priceListId: currentItem.id,
				body: {
					...formData,
					currencyId: formData.currency.id,
					organisationId: orgId,
				},
			});
		}
	};

	useEffect(() => {
		if (dialogState) {
			reset({
				name: currentItem.name,
				currency: { id: currentItem.currencyId, name: currentItem.currencyDescription },
			});
		}
	}, [dialogState, currentItem, reset]);

	useEffect(() => {
		if (isUpdatePriceListSuccess) {
			handleClearCurrentItem();
			setDialogState(false);
		}
	}, [isUpdatePriceListSuccess, handleClearCurrentItem, setDialogState]);

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent removeOverflow onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Edit Price List</h3>
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

						<Controller
							name="currency"
							control={control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => (
								<CustomSelect
									{...field}
									useSearch
									id="currencyId"
									value={field.value}
									placeholder="Currency*"
									onValueChange={field.onChange}
									isLoading={isCurrenciesLoading}
									error={errors.currency?.message}
									disabled={isCurrenciesLoading || isCurrenciesError}
									customValues={isCurrenciesSuccess ? currenciesData.data : []}
								/>
							)}
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
							<Button
								type="submit"
								isLoading={isUpdatePriceListPending}
								disabled={isUpdatePriceListPending || isCurrenciesError || isCurrenciesLoading || !orgId}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
						</div>
						{isCurrenciesError && currenciesError && <ErrorMessage error={currenciesError} />}
						{isUpdatePriceListError && updatePriceListError && <ErrorMessage error={updatePriceListError} />}
					</form>
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
