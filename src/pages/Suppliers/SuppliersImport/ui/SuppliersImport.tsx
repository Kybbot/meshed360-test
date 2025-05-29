import { FC, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";

import { useUploadContactsCsv } from "../api/mutations/useUploadContactsCsv";
import { useUploadSuppliersCsv } from "../api/mutations/useUploadSuppliersCsv";
import { useUploadAddressesCsv } from "../api/mutations/useUploadAddressesCsv";

import { Button } from "@/components/shared/Button";
import { ImportError } from "@/components/shared/ImportError";

import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageTitle,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useDropFile } from "@/hooks/useDropFile";
import { useGetExportData } from "@/hooks/useGetCsvData";
import { useGetCsvTemplate } from "@/hooks/useGetCsvTemplate";

type SalesImportProps = {
	isContacts?: boolean;
	isSuppliers?: boolean;
	isAddresses?: boolean;
};

const SupliersImport: FC<SalesImportProps> = ({ isContacts, isSuppliers, isAddresses }) => {
	const { orgId } = useStore(orgStore);

	const [
		fileInputRef,
		dragActive,
		currentFile,
		handleClearFile,
		handleFileButton,
		handleFileChange,
		handleDrag,
		handleDrop,
	] = useDropFile();

	// GET DATA
	const { isLoadingExportData: isSuppliersDataFetching, getExportData: getSuppliersCsvData } =
		useGetExportData("SuppliersData", orgId);
	const { isLoadingExportData: isContactDataFetching, getExportData: getSupplierContactsCsvData } =
		useGetExportData("SupplierContactsData", orgId);
	const { isLoadingExportData: isAddressesDataFetching, getExportData: getSupplierAddressesCsvData } =
		useGetExportData("SupplierAddressesData", orgId);

	// GET TEMPLATES
	const { isLoadingCsvTemplate: isSupplierTemplateFetching, getCsvTemplate: getSupplierCsvTemplate } =
		useGetCsvTemplate("SupplierTemplate");
	const { isLoadingCsvTemplate: isContactTemplateFetching, getCsvTemplate: getSupplierContactCsvTemplate } =
		useGetCsvTemplate("SupplierContactTemplate");
	const { isLoadingCsvTemplate: isAddressesTemplateFetching, getCsvTemplate: getSupplierAddressCsvTemplate } =
		useGetCsvTemplate("SupplierAddressTemplate");

	// UPLOAD CSV FILE
	const {
		mutate: uploadContactsCsv,
		error: uploadContactsCsvError,
		isError: isUploadContactsCsvError,
		isPending: isUploadContactsCsvPending,
		isSuccess: isUploadContactsCsvSuccess,
	} = useUploadContactsCsv();

	const {
		mutate: uploadSuppliersCsv,
		error: uploadSuppliersCsvError,
		isError: isUploadSuppliersCsvError,
		isPending: isUploadSuppliersCsvPending,
		isSuccess: isUploadSuppliersCsvSuccess,
	} = useUploadSuppliersCsv();

	const {
		mutate: uploadAddressesCsv,
		error: uploadAddressesCsvError,
		isError: isUploadAddressesCsvError,
		isPending: isUploadAddressesCsvPending,
		isSuccess: isUploadAddressesCsvSuccess,
	} = useUploadAddressesCsv();

	const currentName = useMemo(() => {
		if (isContacts) return "contacts";
		if (isSuppliers) return "suppliers";
		if (isAddresses) return "addresses";
	}, [isContacts, isSuppliers, isAddresses]);

	// GET DATA
	const handleDownloadData = async () => {
		if (isSuppliers) {
			await getSuppliersCsvData();
		}

		if (isContacts) {
			await getSupplierContactsCsvData();
		}

		if (isAddresses) {
			await getSupplierAddressesCsvData();
		}
	};

	// GET TEMPLATES
	const handleDownloadTemplate = async () => {
		if (isSuppliers) {
			await getSupplierCsvTemplate();
		}

		if (isContacts) {
			await getSupplierContactCsvTemplate();
		}

		if (isAddresses) {
			await getSupplierAddressCsvTemplate();
		}
	};

	// UPLOAD CSV FILE
	const handleUploadFile = () => {
		if (orgId && currentFile) {
			const formData = new FormData();
			formData.append("file", currentFile);

			if (isContacts) {
				uploadContactsCsv({ organisationId: orgId, body: formData });
			}

			if (isSuppliers) {
				uploadSuppliersCsv({ organisationId: orgId, body: formData });
			}

			if (isAddresses) {
				uploadAddressesCsv({ organisationId: orgId, body: formData });
			}
		}
	};

	useEffect(() => {
		if (
			isUploadContactsCsvError ||
			isUploadAddressesCsvError ||
			isUploadSuppliersCsvError ||
			isUploadContactsCsvSuccess ||
			isUploadSuppliersCsvSuccess ||
			isUploadAddressesCsvSuccess
		) {
			handleClearFile();
		}
	}, [
		isUploadContactsCsvError,
		isUploadAddressesCsvError,
		isUploadSuppliersCsvError,
		isUploadContactsCsvSuccess,
		isUploadSuppliersCsvSuccess,
		isUploadAddressesCsvSuccess,
		handleClearFile,
	]);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Import {currentName}</CommonPageTitle>
					<CommonPageActions>
						<Link to="/purchases/suppliers" className="link link--secondary">
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#cancel" />
							</svg>
							Cancel
						</Link>
					</CommonPageActions>
				</CommonPageHeader>
				<CommonPageMain isSimple>
					<h2 className="import__title">Step 1</h2>
					<div className="import__top">
						<div className="import__card">
							<div className="import__icon">
								<svg width="140" height="140" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/illustrations.svg#suppliers" />
								</svg>
							</div>
							<h3 className="import__subTitle">Export {currentName}</h3>
							<p className="import__description">
								Download your {currentName} in a CSV file to add or edit {currentName}.
							</p>
							<Button
								type="button"
								onClick={handleDownloadData}
								disabled={isContactDataFetching || isSuppliersDataFetching || isAddressesDataFetching}
								isLoading={isContactDataFetching || isSuppliersDataFetching || isAddressesDataFetching}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#export" />
								</svg>
								Export
							</Button>
						</div>
						<p className="import__or">-OR-</p>
						<div className="import__card">
							<div className="import__icon">
								<svg width="140" height="140" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/illustrations.svg#template" />
								</svg>
							</div>
							<h3 className="import__subTitle">Download Template</h3>
							<p className="import__description">Download a blank CSV template to add your {currentName}.</p>
							<Button
								type="button"
								onClick={handleDownloadTemplate}
								disabled={
									isContactTemplateFetching || isSupplierTemplateFetching || isAddressesTemplateFetching
								}
								isLoading={
									isContactTemplateFetching || isSupplierTemplateFetching || isAddressesTemplateFetching
								}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#export" />
								</svg>
								Download
							</Button>
						</div>
					</div>

					<h2 className="import__title">Step 2</h2>
					<div className="import__bottom">
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
								<Button
									type="button"
									isSecondary
									onClick={handleFileButton}
									disabled={
										isUploadContactsCsvPending || isUploadSuppliersCsvPending || isUploadAddressesCsvPending
									}
								>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#import" />
									</svg>
									Select File
								</Button>
								<Button
									type="button"
									onClick={handleUploadFile}
									disabled={
										isUploadContactsCsvPending ||
										isUploadSuppliersCsvPending ||
										isUploadAddressesCsvPending ||
										!currentFile
									}
									isLoading={
										isUploadContactsCsvPending || isUploadSuppliersCsvPending || isUploadAddressesCsvPending
									}
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
								accept=".csv"
								className="srOnly"
								ref={fileInputRef}
								onChange={handleFileChange}
							/>
						</form>
						{isUploadContactsCsvError && uploadContactsCsvError && (
							<div className="import__errors">
								<h2 className="import__text">Error</h2>
								<ImportError error={uploadContactsCsvError} />
							</div>
						)}
						{isUploadSuppliersCsvError && uploadSuppliersCsvError && (
							<div className="import__errors">
								<h2 className="import__text">Error</h2>
								<ImportError error={uploadSuppliersCsvError} />
							</div>
						)}
						{isUploadAddressesCsvError && uploadAddressesCsvError && (
							<div className="import__errors">
								<h2 className="import__text">Error</h2>
								<ImportError error={uploadAddressesCsvError} />
							</div>
						)}
					</div>
				</CommonPageMain>
			</div>
		</CommonPage>
	);
};

export default SupliersImport;
