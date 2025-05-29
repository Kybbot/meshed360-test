import {
	Table,
	TableEmpty,
	TablePagination,
	TableTbody,
	TableThead,
	TableTr,
} from "@/components/widgets/Table";
import { useDraftsTable } from "@/pages/Reports/hooks/useDraftsTable";
import { FC } from "react";

type DraftsProps = {
	// page: string;
	// limit: string;
	// search: string;
	data?: { id: string }[] | null; // TODO ApiResult<GetAllSuppliersResponseType>;
	// handlePageAndLimit: (p: string, l: string) => void;
	// handleChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Drafts: FC<DraftsProps> = ({ data }) => {
	const { columns, layoutOptions, handleResetLayoutOptions, handleToggleLayoutOptions } = useDraftsTable();

	return (
		<div className="activeCustomers__main">
			<div className="customTable">
				<div className="customTable__wrapper">
					<Table>
						<TableThead>
							<TableTr>
								{columns.map((column, index) => {
									return column.renderHeader(column, index);
								})}
							</TableTr>
						</TableThead>
						<TableTbody>
							{data && data?.length > 0 ? (
								<>
									{data.map((item) => (
										<TableTr key={item.id}>
											{columns.map((column) => {
												return column.renderItem(item, column);
											})}
										</TableTr>
									))}
								</>
							) : (
								<TableEmpty colSpan={columns.length} />
							)}
						</TableTbody>
					</Table>
				</div>
			</div>
			<TablePagination
				page={"1" /* page */}
				limit={"0" /* limit */}
				total={0 /* data.data.totalCount */}
				totalPages={0 /* data.data.totalPages */}
				handlePageAndLimit={() => {} /* handlePageAndLimit */}
			/>
		</div>
	);
};

export default Drafts;
