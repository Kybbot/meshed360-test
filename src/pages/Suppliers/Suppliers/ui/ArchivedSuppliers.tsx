import { ChangeEvent, FC } from "react";

import { Search } from "@/components/widgets/Search";

import {
	Table,
	TableEmpty,
	TableLink,
	TablePagination,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
} from "@/components/widgets/Table";

import { ApiResult } from "@/@types/api";
import { GetAllSuppliersResponseType } from "@/@types/suppliers";

type ArchivedCustomersProps = {
	page: string;
	limit: string;
	sort?: string;
	search: string;
	handleSort?: () => void;
	data: ApiResult<GetAllSuppliersResponseType>;
	handlePageAndLimit: (p: string, l: string) => void;
	handleChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ArchivedSuppliers: FC<ArchivedCustomersProps> = ({
	data,
	page,
	limit,
	sort,
	search,
	handleSort,
	handlePageAndLimit,
	handleChangeSearch,
}) => {
	return (
		<div className="archivedCustomers">
			<div className="archivedCustomers__actions">
				<Search id="searchId" name="search" label="Search" value={search} onChange={handleChangeSearch} />
			</div>
			<div className="archivedCustomers__main">
				<div className="customTable">
					<div className="customTable__wrapper">
						<Table>
							<TableThead>
								<TableTr>
									<TableTh
										onSortClick={handleSort}
										sortButton={
											handleSort && (
												<button type="button" className="table__sort-btn">
													<svg width="18" height="18" focusable="false" aria-hidden="true">
														<use
															xlinkHref={`/icons/icons.svg#${
																sort === "asc" ? "up" : sort === "desc" ? "down" : "sort"
															}`}
														/>
													</svg>
												</button>
											)
										}
									>
										Supplier
									</TableTh>
									<TableTh>Account</TableTh>
									<TableTh>VAT Number</TableTh>
									<TableTh>Contact Name</TableTh>
									<TableTh>Email</TableTh>
									<TableTh>Currency</TableTh>
								</TableTr>
							</TableThead>
							<TableTbody>
								{data.data.suppliers.length > 0 ? (
									<>
										{data.data.suppliers.map((item) => (
											<TableTr key={item.id}>
												<TableTd>
													<TableLink to={`/purchases/suppliers/edit/${item.id}`}>{item.name}</TableLink>
												</TableTd>
												<TableTd>{item.accountNumber}</TableTd>
												<TableTd>{item.taxNumber ?? "-"}</TableTd>
												<TableTd>{item.contact?.name ?? "-"}</TableTd>
												<TableTd>{item.contact?.email ?? "-"}</TableTd>
												<TableTd>{item.currency ?? "-"}</TableTd>
											</TableTr>
										))}
									</>
								) : (
									<TableEmpty colSpan={6} />
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
