import { ChangeEvent, FC, useCallback, useState } from "react";
import { useStore } from "zustand";

import { useGetAttachments, useUploadAttachment } from "../api";

import { DeleteDialog } from "./DeleteDialog";
import { OverrideDialog } from "./OverrideDialog";

import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

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
import { CommonPageActions, CommonPageMain, CommonPageWrapper } from "@/components/widgets/Page";

import { useDropFile } from "@/hooks/useDropFile";
import { useDebounce } from "@/hooks/useDebounce";

import { orgStore } from "@/app/stores/orgStore";

import { getFormDayPickerDate } from "@/utils/date";

import { AttachmentEntityType, AttachmentType } from "@/@types/attachments";

interface Props {
	entityId: string;
	type: AttachmentEntityType;
}

export const Attachments: FC<Props> = ({ type, entityId }) => {
	const { orgId } = useStore(orgStore);

	const [search, setSearch] = useState("");
	const [pagination, setPagination] = useState({ page: "1", limit: "10" });

	const [deleteDiaglog, setDeleteDiaglog] = useState(false);
	const [overrideDialog, setOverrideDialog] = useState(false);
	const [currentItem, setCurrentItem] = useState<AttachmentType | null>(null);

	const resetPage = useCallback(() => {
		setPagination((prev) => ({ ...prev, page: "1" }));
	}, []);

	const searchValue = useDebounce<string>(search, 700, resetPage);

	const [
		fileInputRef,
		dragActive,
		currentFile,
		handleClearFile,
		handleFileButton,
		handleFileChange,
		handleDrag,
		handleDrop,
	] = useDropFile(false);

	const { data, isLoading, error, isError, isSuccess } = useGetAttachments({
		pageNumber: pagination.page,
		pageSize: pagination.limit,
		organisationId: orgId,
		searchValue,
		entityId,
		type,
	});

	const { mutate, isPending } = useUploadAttachment(type);

	const handleUploadFile = () => {
		if (orgId && currentFile) {
			const formData = new FormData();
			formData.append("override", String(false));
			formData.append("file", currentFile);

			mutate(
				{ entityId, formData, organisationId: orgId },
				{
					onSuccess: () => {
						handleClearFile();
					},
					onError: (error) => {
						if (error.response?.data?.data?.message === "Attachment already exists") {
							setOverrideDialog(true);
						}
					},
				},
			);
		}
	};

	const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	const handlePageAndLimit = (page: string, limit: string) => {
		setPagination({ page, limit });
	};

	const handleOnDeleteBtn = (value: AttachmentType) => {
		setCurrentItem(value);
		setDeleteDiaglog(true);
	};

	return (
		<div>
			{isLoading ? (
				<Loader isFullWidth />
			) : isError && !overrideDialog ? (
				<ErrorMessage error={error} />
			) : isSuccess && data?.data ? (
				<CommonPageMain columns="two">
					{deleteDiaglog && currentItem && (
						<DeleteDialog
							type={type}
							entityId={entityId}
							currentItem={currentItem}
							dialogState={deleteDiaglog}
							setDialogState={setDeleteDiaglog}
							handleClearCurrentItem={() => setCurrentItem(null)}
						/>
					)}
					{overrideDialog && currentFile && (
						<OverrideDialog
							type={type}
							entityId={entityId}
							newFile={currentFile}
							dialogState={overrideDialog}
							handleClearFile={handleClearFile}
							setDialogState={setOverrideDialog}
						/>
					)}
					<form
						onDrop={handleDrop}
						onDragOver={handleDrag}
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onSubmit={(e) => e.preventDefault()}
						className={`import__card import__card--drop ${dragActive ? "import__card--active" : ""}`}
					>
						<div className="import__icon">
							<svg width="140" height="140" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/illustrations.svg#upload" />
							</svg>
						</div>
						<h3 className="import__subTitle">Upload File</h3>
						<p className="import__description">
							{currentFile
								? `${currentFile.name}`
								: "Drag and drop a file to upload or click on button to select a file."}
						</p>
						<div className="import__btns">
							<Button isSecondary type="button" onClick={handleFileButton} disabled={isPending}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#import" />
								</svg>
								Select File
							</Button>
							<Button
								type="button"
								disabled={!currentFile || isPending}
								onClick={handleUploadFile}
								isLoading={isPending}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#import" />
								</svg>
								Upload
							</Button>
						</div>
						<input
							type="file"
							name="file"
							id="fileId"
							className="srOnly"
							ref={fileInputRef}
							onChange={handleFileChange}
						/>
					</form>
					<CommonPageWrapper>
						<CommonPageActions isComplex>
							<Search
								id="searchId"
								name="search"
								label="Search"
								value={search}
								onChange={handleChangeSearch}
							/>
						</CommonPageActions>
						<div className="customTable">
							<div className="customTable__wrapper">
								<Table>
									<TableThead>
										<TableTr>
											<TableTh>File</TableTh>
											<TableTh>Date</TableTh>
											<TableTh isActions>Action</TableTh>
										</TableTr>
									</TableThead>
									<TableTbody>
										{!data?.data.attachments.length ? (
											<TableEmpty colSpan={3} />
										) : (
											data.data.attachments.map((attachment) => (
												<TableTr key={attachment.id}>
													<TableTd>
														<TableLink to={attachment.link}>{attachment.fileName}</TableLink>
													</TableTd>
													<TableTd>{getFormDayPickerDate(attachment.date)}</TableTd>
													<TableTd>
														<div className="table__actions">
															<button
																type="button"
																aria-label="Delete user"
																className="table__action table__action--delete"
																onClick={() => handleOnDeleteBtn(attachment)}
															>
																<svg width="20" height="20" focusable="false" aria-hidden="true">
																	<use xlinkHref="/icons/icons.svg#delete" />
																</svg>
															</button>
														</div>
													</TableTd>
												</TableTr>
											))
										)}
									</TableTbody>
								</Table>
							</div>
							<TablePagination
								page={pagination.page}
								limit={pagination.limit}
								total={data.data.totalCount}
								totalPages={data.data.totalPages}
								handlePageAndLimit={handlePageAndLimit}
							/>
						</div>
					</CommonPageWrapper>
				</CommonPageMain>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</div>
	);
};
