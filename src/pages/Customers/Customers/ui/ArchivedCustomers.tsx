import { ChangeEvent, FC } from "react";

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
import { Search } from "@/components/widgets/Search";

import { formatNumberToCurrency } from "@/utils/formatNumberToCurrency";

import { ApiResult } from "@/@types/api";
import { GetAllCustomersResponseType } from "@/@types/customers";

type ArchivedCustomersProps = {
	page: string;
	limit: string;
	sort?: string;
	search: string;
	handleSort?: () => void;
	data: ApiResult<GetAllCustomersResponseType>;
	handlePageAndLimit: (p: string, l: string) => void;
	handleChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ArchivedCustomers: FC<ArchivedCustomersProps> = ({
	data,
	page,
	sort,
	limit,
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
										Name
									</TableTh>
									<TableTh>Account</TableTh>
									<TableTh>VAT Number</TableTh>
									<TableTh>Contact</TableTh>
									<TableTh>Contact Number</TableTh>
									<TableTh>Email</TableTh>
									<TableTh>Address</TableTh>
									<TableTh>Currency</TableTh>
									<TableTh>Sales Rep</TableTh>
									<TableTh>Due Amount</TableTh>
									<TableTh>Credit Limit</TableTh>
								</TableTr>
							</TableThead>
							<TableTbody>
								{data.data.customers.length > 0 ? (
									<>
										{data.data.customers.map((item) => (
											<TableTr key={item.id}>
												<TableTd>
													<TableLink to={`/sales/customers/edit/${item.id}`}>{item.name}</TableLink>
												</TableTd>
												<TableTd>{item.account}</TableTd>
												<TableTd>{item.vatNumber ?? "-"}</TableTd>
												<TableTd>{item.contact?.name ?? "-"}</TableTd>
												<TableTd>{item.contact?.phone ?? "-"}</TableTd>
												<TableTd>{item.contact?.email ?? "-"}</TableTd>
												<TableTd>{item.address ?? "-"}</TableTd>
												<TableTd>{item.currency ?? "-"}</TableTd>
												<TableTd>{item.salesRep ?? "-"}</TableTd>
												<TableTd>{formatNumberToCurrency(item.dueAmount)}</TableTd>
												<TableTd>{formatNumberToCurrency(item.creditLimit)}</TableTd>
											</TableTr>
										))}
									</>
								) : (
									<TableEmpty colSpan={11} />
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
