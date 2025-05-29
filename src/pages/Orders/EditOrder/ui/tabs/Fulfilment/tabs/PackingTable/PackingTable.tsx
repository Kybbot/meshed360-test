import { FC, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu.tsx";
import { Button } from "@/components/shared/Button.tsx";

import {
	CommonPageActions,
	CommonPageMain,
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { orderStatusDictionary, PackingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder, FulfilmentType } from "@/@types/salesOrders/api.ts";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf.tsx";
import { useGetAllStockPickers } from "@/pages/Settings/StockPickers/api/queries/useGetAllStockPickers.ts";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import { CustomSelect } from "@/components/shared/CustomSelect.tsx";

import { ProductType } from "@/@types/products.ts";
import { PackingLines } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/tabs/PackingTable/PackingLines.tsx";
import { useSavePacking } from "@/entities/orders/api/mutations/fulfilment/packing/useSavePacking.ts";
import { useAuthorisePacking } from "@/entities/orders/api/mutations/fulfilment/packing/useAuthorisePacking.ts";
import { useVoidPacking } from "@/entities/orders/api/mutations/fulfilment/packing/useVoidPacking.ts";
import { useUndoPacking } from "@/entities/orders/api/mutations/fulfilment/packing/useUndoPacking.ts";
import { getNormalizedPackingData } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/utils/getNormalizedPackingData.ts";
import { getDateFromDayPickerDate } from "@/utils/date";

type Props = {
	fulfilment?: FulfilmentType;
	orderInfo: ExtendedSalesOrder;
	isListShown: boolean;
	setIsListShown: (value: boolean) => void;
};

export const PackingTable: FC<Props> = ({ fulfilment, orderInfo, isListShown, setIsListShown }) => {
	const formRef = useRef<HTMLFormElement>(null);
	const { orgId } = useStore(orgStore);
	const packing = fulfilment?.packing;

	const { data: pickersData, isLoading: isLoadingPickers } = useGetAllStockPickers({
		organisationId: orgId,
		pageNumber: "1",
		pageSize: "999",
		searchValue: "",
	});

	const { mutate: savePacking } = useSavePacking();
	const { mutate: authorisePacking } = useAuthorisePacking();
	const { mutate: voidPacking } = useVoidPacking();
	const { mutate: undoPacking } = useUndoPacking();

	const {
		control,
		setValue,
		register,
		handleSubmit,
		reset,
		formState: { errors, disabled },
	} = useForm<PackingFulfilmentFormValues>({
		defaultValues: {
			lines: fulfilment?.picking
				? fulfilment.picking.lines.map((line) => ({
						product: line.product as ProductType,
						batch: line.batchNumber ? { id: line.batchNumber, name: line.batchNumber } : undefined,
						quantity: line.quantity,
						expiryDate: line.expiryDate,
						packingNumber: "",
						location: line.warehouse,
					}))
				: [],
			packer: undefined,
			requiredBy: undefined,
		},
		disabled: packing?.status === "AUTHORIZED",
	});

	useEffect(() => {
		if (packing) {
			reset({
				lines: fulfilment?.picking
					? fulfilment.picking?.lines.map((line, index) => ({
							product: line.product as ProductType,
							batch: line.batchNumber ? { id: line.batchNumber, name: line.batchNumber } : undefined,
							quantity: line.quantity,
							expiryDate: line.expiryDate,
							location: line.warehouse,
							packingNumber: packing.lines[index]?.packageNumber || "",
						}))
					: [],
				packer: packing?.packer,
				requiredBy: packing.requiredBy ? getDateFromDayPickerDate(packing.requiredBy) : undefined,
			});
		} else {
			reset({
				lines: fulfilment?.picking
					? fulfilment.picking.lines.map((line) => ({
							product: line.product as ProductType,
							batch: line.batchNumber ? { id: line.batchNumber, name: line.batchNumber } : undefined,
							quantity: line.quantity,
							expiryDate: line.expiryDate,
							packingNumber: "",
							location: line.warehouse,
						}))
					: [],
				packer: undefined,
				requiredBy: undefined,
			});
		}
	}, [fulfilment, packing, reset]);

	const onSubmit = async (formData: PackingFulfilmentFormValues, action: "save" | "authorise") => {
		const payload = getNormalizedPackingData(formData);

		if (!orgId) return;

		switch (action) {
			case "authorise":
				authorisePacking({
					orderId: orderInfo.id,
					organisationId: orgId,
					fulfillmentId: fulfilment!.id,
					body: payload,
				});
				break;
			case "save":
				savePacking({
					orderId: orderInfo.id,
					organisationId: orgId,
					fulfillmentId: fulfilment!.id,
					body: payload,
				});
				break;
		}
	};

	const handleSave = handleSubmit((data) => onSubmit(data, "save"));
	const handleAuthorise = handleSubmit((data) => onSubmit(data, "authorise"));
	const handleVoid = () => {
		if (!orderInfo.id || !orgId || !fulfilment) return;
		voidPacking({ orderId: orderInfo.id, organisationId: orgId, fulfillmentId: fulfilment.id });
	};
	const handleUndo = () => {
		if (!orderInfo.id || !orgId || !fulfilment) return;
		undoPacking({ orderId: orderInfo.id, organisationId: orgId, fulfillmentId: fulfilment.id });
	};

	return (
		<CommonPageWrapper>
			<CommonPageActions isComplex>
				<CommonPageSubWrapper>
					{packing?.status ? (
						<CommonPageStatus
							isYellow={packing.status === "DRAFT"}
							isGreen={packing.status === "AUTHORIZED"}
							isRed={packing.status === "VOID"}
						>
							{orderStatusDictionary[packing.status]}
						</CommonPageStatus>
					) : (
						<CommonPageStatus>New</CommonPageStatus>
					)}
					<CommonPageTitle>Packing</CommonPageTitle>
				</CommonPageSubWrapper>
				<CommonPageSubWrapper>
					<Button type="button" isSecondary onClick={() => setIsListShown(!isListShown)}>
						{isListShown ? (
							<>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#eyeClose" />
								</svg>
								Hide Fulfilment List
							</>
						) : (
							<>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#eyeOpen" />
								</svg>
								Show Fulfilment List
							</>
						)}
					</Button>
					<DropdownMenuRoot modal={false}>
						<DropdownMenuTrigger disabled={fulfilment?.shipping?.status === "AUTHORIZED"} asChild>
							<Button type="button">
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#dotsInCicle" />
								</svg>
								Actions
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
							{packing?.status !== "AUTHORIZED" ? (
								<>
									<DropdownMenuItem className="dropDown__item" onSelect={() => handleSave()}>
										Save
									</DropdownMenuItem>
									{!!fulfilment && (
										<DropdownMenuItem className="dropDown__item" onSelect={() => handleAuthorise()}>
											Authorise
										</DropdownMenuItem>
									)}
									{!!fulfilment && (
										<DropdownMenuItem className="dropDown__item" onSelect={() => handleVoid()}>
											Void
										</DropdownMenuItem>
									)}
								</>
							) : (
								<>
									<DropdownMenuItem className="dropDown__item" onSelect={() => handleUndo()}>
										Undo
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenu>
					</DropdownMenuRoot>
				</CommonPageSubWrapper>
			</CommonPageActions>
			<form ref={formRef} action="packingForm" className="commonPage__main" onSubmit={handleSave}>
				<div className="salesOrder__fulfilment-picking-fields">
					<Controller
						name="requiredBy"
						control={control}
						render={({ field }) => {
							return (
								<FormDayPickerRhf
									{...field}
									value={field.value}
									placeholder="Required by"
									onValueChange={field.onChange}
									error={errors.requiredBy?.message}
								/>
							);
						}}
					/>
					<Controller
						name="packer"
						control={control}
						rules={{
							required: "Required",
						}}
						render={({ field }) => (
							<CustomSelect
								isLoading={isLoadingPickers}
								useSearch
								{...field}
								id="packer"
								value={field.value}
								placeholder="Packer*"
								onValueChange={field.onChange}
								error={errors.packer?.message}
								customValues={pickersData?.data?.pickers}
							/>
						)}
					/>
				</div>
				<CommonPageMain>
					<PackingLines
						disabled={disabled}
						errors={errors}
						control={control}
						register={register}
						setValue={setValue}
						orderInfo={orderInfo}
					/>
				</CommonPageMain>
			</form>
		</CommonPageWrapper>
	);
};
