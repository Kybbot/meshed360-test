import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

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

import { orderStatusDictionary, ShippingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder, FulfilmentType } from "@/@types/salesOrders/api.ts";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";

import { useSaveShipping } from "@/entities/orders/api/mutations/fulfilment/shipping/useSaveShipping.ts";
import { useAuthoriseShipping } from "@/entities/orders/api/mutations/fulfilment/shipping/useAuthoriseShipping.ts";
import { useVoidShipping } from "@/entities/orders/api/mutations/fulfilment/shipping/useVoidShipping.ts";
import { useUndoShipping } from "@/entities/orders/api/mutations/fulfilment/shipping/useUndoShipping.ts";
import { getNormalizedShippingData } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/utils/getNormalizedShippingData.ts";
import { ShippingLines } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/tabs/ShippingTable/ShippingLines.tsx";
import { getDateFromDayPickerDate } from "@/utils/date";

type Props = {
	fulfilment?: FulfilmentType;
	orderInfo: ExtendedSalesOrder;
	isListShown: boolean;
	setIsListShown: (value: boolean) => void;
};

export const ShippingTable: FC<Props> = ({ fulfilment, orderInfo, isListShown, setIsListShown }) => {
	const formRef = useRef<HTMLFormElement>(null);
	const { orgId } = useStore(orgStore);
	const shipping = fulfilment?.shipping;

	const { mutate: saveShipping } = useSaveShipping();
	const { mutate: authoriseShipping } = useAuthoriseShipping();
	const { mutate: voidShipping } = useVoidShipping();
	const { mutate: undoShipping } = useUndoShipping();

	const {
		control,
		setValue,
		register,
		handleSubmit,
		reset,
		formState: { errors, disabled },
	} = useForm<ShippingFulfilmentFormValues>({
		defaultValues: {
			lines: fulfilment?.packing
				? fulfilment.packing.lines.map((line) => ({
						shipDate: getDateFromDayPickerDate(orderInfo.shippingDate),
						carrier: undefined,
						waybillNumber: "",
						trackingLink: "",
						packageNumber: line.packageNumber!,
					}))
				: [],
		},
		disabled: shipping?.status === "AUTHORIZED",
	});

	useEffect(() => {
		if (shipping) {
			reset({
				lines: fulfilment?.shipping
					? fulfilment.shipping.lines.map((line, index) => ({
							shipDate: line.shipDate ? getDateFromDayPickerDate(line.shipDate) : undefined,
							carrier: line.carrier,
							waybillNumber: line.waybillNumber || "",
							trackingLink: line.trackingLink || "",
							packageNumber: fulfilment.packing!.lines[index].packageNumber!,
						}))
					: [],
			});
		} else {
			reset({
				lines: fulfilment?.packing
					? fulfilment.packing.lines.map((line) => ({
							shipDate: getDateFromDayPickerDate(orderInfo.shippingDate),
							carrier: undefined,
							waybillNumber: "",
							trackingLink: "",
							packageNumber: line.packageNumber!,
						}))
					: [],
			});
		}
	}, [fulfilment, shipping, reset]);

	const onSubmit = async (formData: ShippingFulfilmentFormValues, action: "save" | "authorise") => {
		const payload = getNormalizedShippingData(formData);

		if (!orgId) return;

		switch (action) {
			case "authorise":
				authoriseShipping({
					orderId: orderInfo.id,
					organisationId: orgId,
					fulfillmentId: fulfilment!.id,
					body: payload,
				});
				break;
			case "save":
				saveShipping({
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
		voidShipping({ orderId: orderInfo.id, organisationId: orgId, fulfillmentId: fulfilment.id });
	};
	const handleUndo = () => {
		if (!orderInfo.id || !orgId || !fulfilment) return;
		undoShipping({ orderId: orderInfo.id, organisationId: orgId, fulfillmentId: fulfilment.id });
	};

	return (
		<CommonPageWrapper>
			<CommonPageActions isComplex>
				<CommonPageSubWrapper>
					{shipping?.status ? (
						<CommonPageStatus
							isYellow={shipping.status === "DRAFT"}
							isGreen={shipping.status === "AUTHORIZED"}
							isRed={shipping.status === "VOID"}
						>
							{orderStatusDictionary[shipping.status]}
						</CommonPageStatus>
					) : (
						<CommonPageStatus>New</CommonPageStatus>
					)}
					<CommonPageTitle>Shipping</CommonPageTitle>
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
						<DropdownMenuTrigger asChild>
							<Button type="button">
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#dotsInCicle" />
								</svg>
								Actions
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
							{shipping?.status !== "AUTHORIZED" ? (
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
			<form ref={formRef} action="shippingForm" className="commonPage__main" onSubmit={handleSave}>
				<CommonPageMain>
					<ShippingLines
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
