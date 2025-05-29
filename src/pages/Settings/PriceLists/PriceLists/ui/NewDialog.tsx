import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { useCreatePriceList } from "../../api/mutations/useCreatePriceList";

import {
	DialogClose,
	DialogContent,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/shared/Dialog";
import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { useGetCurrenciesName } from "@/entities/currencies";

import { SelectOption } from "@/@types/selects";

type FormValues = {
	name: string;
	currency: SelectOption;
};

type NewDialogProps = {
	orgId?: string;
	dialogState: boolean;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const NewDialog: FC<NewDialogProps> = ({ orgId, dialogState, setDialogState }) => {
	const {
		isLoading: isCurrenciesLoading,
		isError: isCurrenciesError,
		isSuccess: isCurrenciesSuccess,
		error: currenciesError,
		data: currenciesData,
	} = useGetCurrenciesName({ organisationId: orgId });

	const {
		isPending: isCreatePriceListPending,
		isSuccess: isCreatePriceListSuccess,
		isError: isCreatePriceListError,
		error: createPriceListError,
		mutate: createPriceListMutate,
	} = useCreatePriceList();

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
		reset();
	};

	const onSubmit = (formData: FormValues) => {
		if (orgId) {
			createPriceListMutate({
				body: {
					...formData,
					currencyId: formData.currency.id,
					organisationId: orgId,
				},
			});
		}
	};

	useEffect(() => {
		if (isCreatePriceListSuccess) {
			reset();
			setDialogState(false);
		}
	}, [isCreatePriceListSuccess, reset, setDialogState]);

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
			<DialogContent removeOverflow onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Add New Price List</h3>
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
								isLoading={isCreatePriceListPending}
								disabled={isCreatePriceListPending || isCurrenciesError || isCurrenciesLoading}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
						</div>
						{isCurrenciesError && currenciesError && <ErrorMessage error={currenciesError} />}
						{isCreatePriceListError && createPriceListError && <ErrorMessage error={createPriceListError} />}
					</form>
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
