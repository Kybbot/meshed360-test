import { FC, useCallback, useState } from "react";
import { useParams } from "react-router";

import { NewDialog } from "./NewDialog";
import { EditDialog } from "./EditDialog";
import { DeleteDialog } from "./DeleteDialog";

import { useUpdateSupplierAddress } from "../../../api/mutations/useUpdateSupplierAddress";
import { useGetAllSupplierAddresses } from "../../../api/queries/useGetAllSupplierAddresses";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/form/Checkbox";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	Table,
	TableCenter,
	TableEmpty,
	TablePagination,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
} from "@/components/widgets/Table";

import { SupplierAddressesType, NormalizedAddressesData } from "@/@types/suppliers";

export const Addresses: FC = () => {
	const { supplierId } = useParams();

	const [{ page, limit }, setPageAndLimit] = useState({ page: "1", limit: "10" });

	const [newDiaglog, setNewDiaglog] = useState(false);
	const [editDiaglog, setEditDiaglog] = useState(false);
	const [deleteDiaglog, setDeleteDiaglog] = useState(false);
	const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
	const [currentItems, setCurrentItems] = useState<NormalizedAddressesData | null>(null);

	const { data, error, isLoading, isError, isSuccess } = useGetAllSupplierAddresses({
		pageNumber: page,
		pageSize: limit,
		supplierId,
	});

	const { mutate: updateAddress, isPending: isUpdateAddressLoading } = useUpdateSupplierAddress(true);

	const handlePageAndLimit = (page: string, limit: string) => {
		setPageAndLimit({ page, limit });
	};

	const handleChangeCheckbox = (value: SupplierAddressesType[], itemIndex: number, checked: boolean) => {
		if (supplierId) {
			const updatedArr = value.map((item, index) => ({
				...item,
				isDefault: index === itemIndex ? checked : false,
			}));

			updateAddress({ supplierId, body: { addresses: updatedArr } });
		}
	};

	const handleOnNew = (value: NormalizedAddressesData) => {
		setCurrentItems(value);
		setNewDiaglog(true);
	};

	const handleOnEdit = (value: NormalizedAddressesData, itemIndex: number) => {
		setCurrentItemIndex(itemIndex);
		setCurrentItems(value);
		setEditDiaglog(true);
	};

	const handleOnDeleteBtn = (value: NormalizedAddressesData, itemIndex: number) => {
		setCurrentItemIndex(itemIndex);
		setCurrentItems(value);
		setDeleteDiaglog(true);
	};

	const handleClearCurrentItem = useCallback(() => {
		setCurrentItemIndex(null);
		setCurrentItems(null);
	}, []);

	return (
		<>
			{isLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess && data.data.addresses ? (
				<>
					<div className="commonPage__actions commonPage__actions--complex">
						<div />
						<Button type="button" onClick={() => handleOnNew(data.data)} disabled={!supplierId}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plus" />
							</svg>
							Add
						</Button>
					</div>
					<div className="commonPage__main">
						{newDiaglog && currentItems && (
							<NewDialog
								dialogState={newDiaglog}
								currentItems={currentItems}
								setDialogState={setNewDiaglog}
							/>
						)}
						{editDiaglog && currentItems && currentItemIndex !== null && (
							<EditDialog
								dialogState={editDiaglog}
								currentItems={currentItems}
								currentItemIndex={currentItemIndex}
								setDialogState={setEditDiaglog}
								handleClearCurrentItem={handleClearCurrentItem}
							/>
						)}
						{deleteDiaglog && currentItems && currentItemIndex !== null && (
							<DeleteDialog
								dialogState={deleteDiaglog}
								currentItems={currentItems}
								currentItemIndex={currentItemIndex}
								setDialogState={setDeleteDiaglog}
								handleClearCurrentItem={handleClearCurrentItem}
							/>
						)}

						<div className="customTable">
							<div className="customTable__wrapper">
								<Table>
									<TableThead>
										<TableTr>
											<TableTh>Line 1</TableTh>
											<TableTh>Line 2</TableTh>
											<TableTh>Line 3</TableTh>
											<TableTh>Postal Code</TableTh>
											<TableTh>City</TableTh>
											<TableTh>Country</TableTh>
											<TableTh isCheckbox>Default</TableTh>
											<TableTh isActions>Actions</TableTh>
										</TableTr>
									</TableThead>
									<TableTbody>
										{data.data.addresses.length > 0 ? (
											<>
												{data.data.addresses.map((item, index) => (
													<TableTr key={index}>
														<TableTd>{item.addressLine1}</TableTd>
														<TableTd>{item.addressLine2 || "-"}</TableTd>
														<TableTd>{item.addressLine3 || "-"}</TableTd>
														<TableTd>{item.postalCode || "-"}</TableTd>
														<TableTd>{item.city || "-"}</TableTd>
														<TableTd>{item.country || "-"}</TableTd>
														<TableTd>
															<TableCenter>
																<Checkbox
																	hideLabel
																	label="Default"
																	id={`defaultId-${index}`}
																	name={`default-${index}`}
																	checked={item.isDefault}
																	disabled={isUpdateAddressLoading}
																	onChange={(event) =>
																		handleChangeCheckbox(data.data.addresses, index, event.target.checked)
																	}
																/>
															</TableCenter>
														</TableTd>
														<TableTd>
															<div className="table__actions">
																<button
																	type="button"
																	aria-label="Edit user"
																	className="table__action table__action--edit"
																	onClick={() => {
																		handleOnEdit(data.data, index);
																	}}
																>
																	<svg width="20" height="20" focusable="false" aria-hidden="true">
																		<use xlinkHref="/icons/icons.svg#edit" />
																	</svg>
																</button>
																<button
																	type="button"
																	aria-label="Delete user"
																	className="table__action table__action--delete"
																	onClick={() => {
																		handleOnDeleteBtn(data.data, index);
																	}}
																>
																	<svg width="20" height="20" focusable="false" aria-hidden="true">
																		<use xlinkHref="/icons/icons.svg#delete" />
																	</svg>
																</button>
															</div>
														</TableTd>
													</TableTr>
												))}
											</>
										) : (
											<TableEmpty colSpan={8} />
										)}
									</TableTbody>
								</Table>
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
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</>
	);
};
