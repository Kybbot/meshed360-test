import { FC } from "react";
import { useNavigate } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { Button } from "@/components/shared/Button";

import {
	CommonPage,
	CommonPageTitle,
	CommonPageHeader,
	CommonPageActions,
	CommonPageStatus,
	CommonPageSubWrapper,
} from "@/components/widgets/Page";
import { CreateOrderForm } from "@/components/widgets/Sales";
import { useForm } from "react-hook-form";
import {
	EmptyDefaultOrderLine,
	EmptyMeatOrderLine,
	EmptyWoolworthsOrderLine,
	OrderFormValues,
} from "@/@types/salesOrders/local.ts";
import * as Tabs from "@radix-ui/react-tabs";
import { QuoteCreate } from "@/pages/Orders/NewOrder/ui/tabs/Quote/QuoteCreate.tsx";

const tab = { content: "Quote", name: "quote", iconName: "emptyFile" };

const NewOrder: FC = () => {
	const navigate = useNavigate();

	const createCustomerStatus = useMutationState({
		filters: { mutationKey: ["create-order"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = createCustomerStatus.includes("pending");

	const form = useForm<OrderFormValues>({
		defaultValues: {
			customer: undefined,
			contact: undefined,
			phone: "",
			email: "",
			billingAddress: undefined,
			billingAddressLine2: "",
			priceList: undefined,
			reference: "",
			template: { id: "DEFAULT", name: "Default" },
			paymentTerm: undefined,
			salesRep: undefined,
			account: undefined,
			taxRate: undefined,
			taxInclusive: false,
			skipQuote: false,
			warehouse: undefined,
			date: new Date(),
			dueDate: undefined,
			shipToDifferentCompany: false,
			shippingAddress: undefined,
			shippingAddressText: "",
			shippingAddressLine2: "",
			shippingNotes: "",
			deliveryMethod: "",
			comments: "",
			defaultQuoteLines: [EmptyDefaultOrderLine],
			meatQuoteLines: [EmptyMeatOrderLine],
			woolworthsQuoteLines: [EmptyWoolworthsOrderLine],
			serviceLines: [],
			memo: "",
		},
	});

	const skipQuote = form.watch("skipQuote");

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader>
						<CommonPageSubWrapper>
							<CommonPageStatus isYellow>Draft</CommonPageStatus>
							<CommonPageTitle>New Order</CommonPageTitle>
						</CommonPageSubWrapper>
						<CommonPageActions>
							<Button type="button" isSecondary onClick={() => navigate(-1)}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#list" />
								</svg>
								Back to List
							</Button>
							<Button type="submit" form="newOrderForm" isLoading={isPending} disabled={isPending}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#plus" />
								</svg>
								Create
							</Button>
						</CommonPageActions>
					</CommonPageHeader>
					<CreateOrderForm form={form} />
				</div>
			</CommonPage>
			{!skipQuote && (
				<CommonPage>
					<div className="main__container">
						<Tabs.Root className="tabs" value={"quote"} defaultValue={"quote"}>
							<div className="tabs__header">
								<Tabs.List className="tabs__nav" aria-label="Manage users & roles">
									<Tabs.Trigger value={tab.name} className="tabs__btn">
										<svg focusable="false" aria-hidden="true" width="18" height="18">
											<use xlinkHref={`/icons/icons.svg#${tab.iconName}`} />
										</svg>
										{tab.content}
									</Tabs.Trigger>
								</Tabs.List>
							</div>
							<Tabs.Content className="tabs__content sales-order__form-table" value={tab.name}>
								<QuoteCreate form={form} />
							</Tabs.Content>
						</Tabs.Root>
					</div>
				</CommonPage>
			)}
		</div>
	);
};

export default NewOrder;
