import { FC } from "react";

import { OrderFormValues } from "@/@types/salesOrders/local.ts";
import { DefaultTable } from "./Tables/DefaultTable";
import { UseFormReturn } from "react-hook-form";
import { MeatTable } from "@/pages/Orders/NewOrder/ui/tabs/Quote/Tables/MeatTable";
import { WoolworthTable } from "@/pages/Orders/NewOrder/ui/tabs/Quote/Tables/WoolworthTable";
import { Template } from "@/@types/salesOrders/api.ts";

type Props = {
	form: UseFormReturn<OrderFormValues>;
};

export const QuoteCreate: FC<Props> = ({ form }) => {
	const { id } = form.watch("template");

	switch (id) {
		case Template.WOOLWORTHS:
			return <WoolworthTable form={form} />;
		case Template.MEAT:
			return <MeatTable form={form} />;
		default:
			return <DefaultTable form={form} />;
	}
};
