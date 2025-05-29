import { FC } from "react";

import { DefaultTable } from "./DefaultTable/DefaultTable.tsx";
import { MeatTable } from "./MeatTable/MeatTable.tsx";
import { WoolworthTable } from "./WoolwotrhTable/WoolworthTable.tsx";

import { ExtendedSalesOrder, QuoteType, Template } from "@/@types/salesOrders/api.ts";

type Props = {
	orderInfo: ExtendedSalesOrder;
	quote?: QuoteType;
};

export const SalesOrder: FC<Props> = ({ orderInfo, quote }) => {
	const { template } = orderInfo;

	switch (template) {
		case Template.WOOLWORTHS:
			return <WoolworthTable order={orderInfo} quote={quote} />;
		case Template.MEAT:
			return <MeatTable order={orderInfo} quote={quote} />;
		default:
			return <DefaultTable order={orderInfo} quote={quote} />;
	}
};
