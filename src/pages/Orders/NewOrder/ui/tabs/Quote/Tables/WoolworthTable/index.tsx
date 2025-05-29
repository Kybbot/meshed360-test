import { FC, useMemo, useRef } from "react";
import { useStore } from "zustand";
import { UseFormReturn, useWatch } from "react-hook-form";

import { OrderLines } from "./OrderLines.tsx";

import { Loader } from "@/components/shared/Loader.tsx";
import { ErrorMessage } from "@/components/shared/ErrorMessage.tsx";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf.tsx";

import {
	CommonPageActions,
	CommonPageFooter,
	CommonPageMain,
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";
import { TotalTable } from "@/components/widgets/TotalTable";

import { orderStore } from "@/app/stores/orderStore.ts";

import { useGetPriceListById } from "@/entities/priceLists";

import { OrderFormValues } from "@/@types/salesOrders/local.ts";
import { OrderServices } from "@/pages/Orders/NewOrder/ui/tabs/Quote/Tables/DefaultTable/OrderServices.tsx";

type Props = {
	form: UseFormReturn<OrderFormValues>;
};

export const WoolworthTable: FC<Props> = ({ form }) => {
	const { taxInclusive } = useStore(orderStore);

	const formRef = useRef<HTMLFormElement>(null);

	const priceList = form.watch("priceList");

	const { isLoading, isError, error, data } = useGetPriceListById({
		priceListId: priceList?.id,
	});

	const priceListContentData = useMemo(() => {
		if (data?.data.priceList.priceListContent?.length) {
			return data.data.priceList.priceListContent.reduce<Record<string, number>>((prev, curr) => {
				prev[curr.productid] = curr.price;
				return prev;
			}, {});
		}

		return null;
	}, [data]);

	const quoteLinesValues = useWatch({
		name: "woolworthsQuoteLines",
		control: form.control,
	});

	const serviceLinesValues = useWatch({
		name: "serviceLines",
		control: form.control,
	});

	return (
		<CommonPageWrapper>
			{isLoading ? (
				<Loader />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : (
				<>
					<CommonPageActions isComplex>
						<CommonPageSubWrapper>
							<CommonPageStatus isYellow>Draft</CommonPageStatus>
							<CommonPageTitle>Quote</CommonPageTitle>
						</CommonPageSubWrapper>
					</CommonPageActions>
					<CommonPageMain>
						<form ref={formRef} action="quoteForm" className="commonPage__main">
							<OrderLines
								isSubmitted={form.formState.isSubmitted}
								errors={form.formState.errors}
								control={form.control}
								register={form.register}
								setValue={form.setValue}
								priceListContentData={priceListContentData}
								trigger={form.trigger}
							/>
							<OrderServices
								errors={form.formState.errors}
								control={form.control}
								register={form.register}
								setValue={form.setValue}
								priceListContentData={priceListContentData}
							/>
						</form>
						<CommonPageFooter>
							<TextareaRhf<OrderFormValues>
								name="memo"
								id="memoId"
								label="Quote Memo"
								register={form.register}
								error={form.formState.errors.memo?.message}
							/>
							<TotalTable
								firstHeader="Order Lines"
								taxInclusive={taxInclusive}
								secondHeader="Additional Charges"
								orderLinesValues={quoteLinesValues}
								serviceLinesValues={serviceLinesValues}
							/>
						</CommonPageFooter>
					</CommonPageMain>
				</>
			)}
		</CommonPageWrapper>
	);
};
