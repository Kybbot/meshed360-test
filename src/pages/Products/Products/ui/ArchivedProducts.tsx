import { ChangeEvent, FC } from "react";

import {
	Table,
	TableTr,
	TableTd,
	TableTh,
	TableLink,
	TableTbody,
	TableThead,
	TableEmpty,
	TablePagination,
} from "@/components/widgets/Table";
import { Search } from "@/components/widgets/Search";

import { ApiResult } from "@/@types/api";
import { BOMValues, GetAllProductsResponseType } from "@/@types/products";

type ArchivedCustomersProps = {
	page: string;
	limit: string;
	search: string;
	data: ApiResult<GetAllProductsResponseType>;
	handlePageAndLimit: (p: string, l: string) => void;
	handleChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ArchivedProducts: FC<ArchivedCustomersProps> = ({
	data,
	page,
	limit,
	search,
	handlePageAndLimit,
	handleChangeSearch,
}) => {
	return (
		<div>
			<div className="archivedCustomers__actions">
				<Search id="searchId" name="search" label="Search" value={search} onChange={handleChangeSearch} />
			</div>
			<div className="archivedCustomers__main">
				<div className="customTable">
					<div className="customTable__wrapper">
						<Table>
							<TableThead>
								<TableTr>
									<TableTh>SKU</TableTh>
									<TableTh>Product Name</TableTh>
									<TableTh>Unit of Measure</TableTh>
									<TableTh>Type</TableTh>
									<TableTh>Category</TableTh>
									<TableTh>Brand</TableTh>
									<TableTh>Barcode</TableTh>
									<TableTh>BOM Type</TableTh>
								</TableTr>
							</TableThead>
							<TableTbody>
								{data.data.allProducts.length > 0 ? (
									<>
										{data.data.allProducts.map((item) => (
											<TableTr key={item.id}>
												<TableTd>
													<TableLink to={`/inventory/products/edit/${item.id}`}>{item.sku}</TableLink>
												</TableTd>
												<TableTd>
													<TableLink to={`/inventory/products/edit/${item.id}`}>{item.name}</TableLink>
												</TableTd>
												<TableTd>{item.unitOfMeasure?.name ?? "-"}</TableTd>
												<TableTd isCapitalize>{item.type.toLocaleLowerCase()}</TableTd>
												<TableTd>{item.category ?? "-"}</TableTd>
												<TableTd>{item.brand ?? "-"}</TableTd>
												<TableTd>{item.barcode ?? "-"}</TableTd>
												<TableTd>{BOMValues[item.bomType] ?? "-"}</TableTd>
											</TableTr>
										))}
									</>
								) : (
									<TableEmpty colSpan={8} />
								)}
							</TableTbody>
						</Table>
					</div>
				</div>
				<TablePagination
					page={page}
					limit={limit}
					total={data.data.totalCount}
					totalPages={data.data.totalPages}
					handlePageAndLimit={handlePageAndLimit}
				/>
			</div>
		</div>
	);
};
