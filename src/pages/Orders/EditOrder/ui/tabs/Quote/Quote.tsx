import { FC } from "react";

import { DefaultTable } from "./DefaultTable/DefaultTable.tsx";
import { MeatTable } from "@/pages/Orders/EditOrder/ui/tabs/Quote/MeatTable/MeatTable.tsx";

import { ExtendedSalesOrder, QuoteType, Template } from "@/@types/salesOrders/api.ts";
import { WoolworthTable } from "@/pages/Orders/EditOrder/ui/tabs/Quote/WoolwotrhTable/WoolworthTable.tsx";

type Props = {
	orderInfo: ExtendedSalesOrder;
	quote: QuoteType | null;
};

export const Quote: FC<Props> = ({ orderInfo, quote }) => {
	const { template } = orderInfo;

	switch (template) {
		case Template.WOOLWORTHS:
			return <WoolworthTable orderInfo={orderInfo} quote={quote} />;
		case Template.MEAT:
			return <MeatTable orderInfo={orderInfo} quote={quote} />;
		default:
			return <DefaultTable orderInfo={orderInfo} quote={quote} />;
	}
};
