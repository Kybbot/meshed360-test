import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";

import { useUploadProductsCsv } from "../api/mutations/useUploadProdutsCsv";

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

const ProductsImport: FC = () => {
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
	const { isLoadingExportData: isProductDataFetching, getExportData: getProductsCsvData } = useGetExportData(
		"ProductsData",
		orgId,
	);

	// GET TEMPLATE
	const { isLoadingCsvTemplate: isProductTemplateFetching, getCsvTemplate: getProductCsvTemplate } =
		useGetCsvTemplate("ProductTemplate");

	// UPLOAD CSV FILE
	const {
		mutate: uploadProductsCsv,
		error: uploadProductsCsvError,
		isError: isUploadProductsCsvError,
		isPending: isUploadProductsCsvPending,
		isSuccess: isUploadProductsCsvSuccess,
	} = useUploadProductsCsv();

	// GET DATA
	const handleDownloadData = async () => {
		await getProductsCsvData();
	};

	// GET TEMPLATE
	const handleDownloadTemplate = async () => {
		await getProductCsvTemplate();
	};

	// UPLOAD CSV FILE
	const handleUploadFile = () => {
		if (orgId && currentFile) {
			const formData = new FormData();
			formData.append("file", currentFile);

			uploadProductsCsv({ organisationId: orgId, body: formData });
		}
	};
	useEffect(() => {
		if (isUploadProductsCsvError || isUploadProductsCsvSuccess) {
			handleClearFile();
		}
	}, [isUploadProductsCsvError, isUploadProductsCsvSuccess, handleClearFile]);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Import Products</CommonPageTitle>
					<CommonPageActions>
						<Link to="/inventory/products" className="link link--secondary">
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
									<use xlinkHref="/icons/illustrations.svg#products" />
								</svg>
							</div>
							<h3 className="import__subTitle">Export Products</h3>
							<p className="import__description">
								Download your products in a CSV file to add or edit products.
							</p>
							<Button
								type="button"
								onClick={handleDownloadData}
								disabled={isProductDataFetching}
								isLoading={isProductDataFetching}
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
							<p className="import__description">Download a blank CSV template to add your products.</p>
							<Button
								type="button"
								onClick={handleDownloadTemplate}
								disabled={isProductTemplateFetching}
								isLoading={isProductTemplateFetching}
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
									disabled={isUploadProductsCsvPending}
								>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#import" />
									</svg>
									Select File
								</Button>
								<Button
									type="button"
									onClick={handleUploadFile}
									isLoading={isUploadProductsCsvPending}
									disabled={isUploadProductsCsvPending || !currentFile}
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
						{isUploadProductsCsvError && uploadProductsCsvError && (
							<div className="import__errors">
								<h2 className="import__text">Error</h2>
								<ImportError error={uploadProductsCsvError} />
							</div>
						)}
					</div>
				</CommonPageMain>
			</div>
		</CommonPage>
	);
};

export default ProductsImport;
