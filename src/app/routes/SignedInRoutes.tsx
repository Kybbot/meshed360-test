import { FC, lazy, Suspense } from "react";
import * as Sentry from "@sentry/react";
import { Route, Routes } from "react-router";

import { MainLayout } from "../lauouts/MainLayout";

import { PageLoader } from "@/components/shared/PageLoader";

import Dashboard from "@/pages/Dashboard";

// Customers
import Customers from "@/pages/Customers/Customers";
import NewCustomer from "@/pages/Customers/NewCustomer";
import EditCustomer from "@/pages/Customers/EditCustomer";
import CustomersImport from "@/pages/Customers/CustomersImport";

// Sale Orders
import Orders from "@/pages/Orders/Orders";
import NewOrder from "@/pages/Orders/NewOrder";
import EditOrder from "@/pages/Orders/EditOrder";

// Suppliers
import Suppliers from "@/pages/Suppliers/Suppliers";
import NewSupplier from "@/pages/Suppliers/NewSupplier";
import EditSupplier from "@/pages/Suppliers/EditSupplier";
import SuppliersImport from "@/pages/Suppliers/SuppliersImport";

// Inventory
import Products from "@/pages/Products/Products";
import NewProduct from "@/pages/Products/NewProduct";
import EditProduct from "@/pages/Products/EditProduct";
import ProductsImport from "@/pages/Products/ProductsImport";

const StockControl = lazy(() => import("@/pages/StockControl/StockControlList"));
const StockAdjustment = lazy(() => import("@/pages/StockControl/StockAdjustment"));
const StockTransfer = lazy(() => import("@/pages/StockControl/StockTransfer"));
const StockTake = lazy(() => import("@/pages/StockControl/StockTake"));

const StockAvailability = lazy(() => import("@/pages/StockAvailability/StockAvailability"));
const OnOrderDetails = lazy(() => import("@/pages/StockAvailability/OnOrderDetails"));
const AllocatedDetails = lazy(() => import("@/pages/StockAvailability/AllocatedDetails"));

// Purchase Orders
import PurchaseOrders from "@/pages/PurchaseOrders/PurchaseOrders";
import NewPurchaseOrder from "@/pages/PurchaseOrders/NewPurchaseOrder";
import EditPurchaseOrder from "@/pages/PurchaseOrders/EditPurchaseOrder";

// Production
const AssembliesList = lazy(() => import("@/pages/Assembly/AssembliesList"));
const NewAssembly = lazy(() => import("@/pages/Assembly/NewAssembly"));
const EditAssembly = lazy(() => import("@/pages/Assembly/EditAssembly"));

//Automations
const Automation = lazy(() => import("@/pages/Automations/Automation"));
const AutomationsList = lazy(() => import("@/pages/Automations/AutomationsList"));

// Settings
import GeneralSetting from "@/pages/Settings/GeneralSetting";
const Brands = lazy(() => import("@/pages/Settings/Brands"));
const SalesReps = lazy(() => import("@/pages/Settings/SalesReps"));
const SalesDefaults = lazy(() => import("@/pages/Settings/SalesDefaults"));
const PurchaseDefaults = lazy(() => import("@/pages/Settings/PurchaseDefaults"));
const Currencies = lazy(() => import("@/pages/Settings/Currencies"));
const ProfileSettings = lazy(() => import("@/pages/Settings/ProfileSettings"));
const Warehouses = lazy(() => import("@/pages/Settings/Warehouses"));
const Categories = lazy(() => import("@/pages/Settings/Categories"));
const PriceLists = lazy(() => import("@/pages/Settings/PriceLists/PriceLists"));
const PriceListImport = lazy(() => import("@/pages/Settings/PriceLists/PriceListImport"));
const PaymentTerms = lazy(() => import("@/pages/Settings/PaymentTems"));
const UnitsOfMeasure = lazy(() => import("@/pages/Settings/UnitsOfMeasure"));
const StockPickers = lazy(() => import("@/pages/Settings/StockPickers"));
const Carriers = lazy(() => import("@/pages/Settings/Carriers"));
const DocumentNumbering = lazy(() => import("@/pages/Settings/DocumentNumbering"));
const DocumentTemplates = lazy(() => import("@/pages/Settings/DocumentTemplates"));
const DefaultAccountMapping = lazy(() => import("@/pages/Settings/DefaultAccountMapping"));
import UsersRoles from "@/pages/Settings/UsersRoles";

// Integrations
const Integrations = lazy(() => import("@/pages/Integrations/Integrations"));
const Xero = lazy(() => import("@/pages/Integrations/Xero"));

// Reports
const Reports = lazy(() => import("@/pages/Reports"));
const SalesByProductDetails = lazy(() => import("@/pages/Reports/ui/salesReports/SalesByProductDetails"));
const SalesInvoicesAndCreditNotes = lazy(
	() => import("@/pages/Reports/ui/salesReports/SalesInvoicesAndCreditNotes"),
);
const ProfitBySalesRepresentative = lazy(
	() => import("@/pages/Reports/ui/salesReports/ProfitBySalesRepresentative"),
);
const PurchaseOrderDetails = lazy(() => import("@/pages/Reports/ui/purchesReports/PurchaseOrderDetails"));
const PurchaseOrderVsInvoice = lazy(() => import("@/pages/Reports/ui/purchesReports/PurchaseOrderVsInvoice"));
const StockReceivedVsInvoiced = lazy(
	() => import("@/pages/Reports/ui/purchesReports/StockReceivedVsInvoiced"),
);
const PurchaseCostAnalysis = lazy(() => import("@/pages/Reports/ui/purchesReports/PurchaseCostAnalysis"));
const InventoryMovementDetails = lazy(
	() => import("@/pages/Reports/ui/inventoryReports/InventoryMovementDetails"),
);
const ProductStockLevel = lazy(() => import("@/pages/Reports/ui/inventoryReports/ProductStockLevel"));

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

export const SignedInRoutes: FC = () => {
	return (
		<SentryRoutes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Dashboard />} />

				{/* Customers */}
				<Route path="sales/customers" element={<Customers />} />
				<Route path="sales/customers/new" element={<NewCustomer />} />
				<Route path="sales/customers/edit/:customerId" element={<EditCustomer />} />
				<Route path="sales/customers/import/contacts" element={<CustomersImport isContacts />} />
				<Route path="sales/customers/import/customers" element={<CustomersImport isCustomers />} />
				<Route path="sales/customers/import/addresses" element={<CustomersImport isAddresses />} />

				{/* Sale Orders */}
				<Route path="sales/orders" element={<Orders />} />
				<Route path="sales/orders/new" element={<NewOrder />} />
				<Route path="sales/orders/edit/:orderId" element={<EditOrder />} />

				{/* Suppliers */}
				<Route path="purchases/suppliers" element={<Suppliers />} />
				<Route path="purchases/suppliers/new" element={<NewSupplier />} />
				<Route path="purchases/suppliers/edit/:supplierId" element={<EditSupplier />} />
				<Route path="purchases/suppliers/import/contacts" element={<SuppliersImport isContacts />} />
				<Route path="purchases/suppliers/import/suppliers" element={<SuppliersImport isSuppliers />} />
				<Route path="purchases/suppliers/import/addresses" element={<SuppliersImport isAddresses />} />

				{/* Purchase Orders */}
				<Route path="purchases/orders" element={<PurchaseOrders />} />
				<Route path="purchases/orders/new" element={<NewPurchaseOrder />} />
				<Route path="purchases/orders/edit/:orderId" element={<EditPurchaseOrder />} />

				<Route
					path="purchases/automations"
					element={
						<Suspense fallback={<PageLoader />}>
							<AutomationsList />
						</Suspense>
					}
				/>

				<Route
					path="purchases/automations/new"
					element={
						<Suspense fallback={<PageLoader />}>
							<Automation isAdd />
						</Suspense>
					}
				/>

				{/* Production */}
				<Route
					path="production/assembly"
					element={
						<Suspense fallback={<PageLoader />}>
							<AssembliesList />
						</Suspense>
					}
				/>
				<Route
					path="production/assembly/new"
					element={
						<Suspense fallback={<PageLoader />}>
							<NewAssembly />
						</Suspense>
					}
				/>
				<Route
					path="production/assembly/edit/:assemblyId"
					element={
						<Suspense fallback={<PageLoader />}>
							<EditAssembly />
						</Suspense>
					}
				/>

				{/* Inventory */}
				<Route path="inventory/products" element={<Products />} />
				<Route path="inventory/products/new" element={<NewProduct />} />
				<Route path="inventory/products/import" element={<ProductsImport />} />
				<Route path="inventory/products/edit/:productId" element={<EditProduct />} />

				<Route
					path="inventory/stockControl"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockControl />
						</Suspense>
					}
				/>
				<Route
					path="inventory/stockAdjustment/new"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockAdjustment isAdd />
						</Suspense>
					}
				/>
				<Route
					path="inventory/stockAdjustment/edit/:stockAdjustmentId"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockAdjustment />
						</Suspense>
					}
				/>

				<Route
					path="inventory/stockTransfer/new"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockTransfer isAdd />
						</Suspense>
					}
				/>
				<Route
					path="inventory/stockTransfer/edit/:stockTransferId"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockTransfer />
						</Suspense>
					}
				/>

				<Route
					path="inventory/stockTake/new"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockTake isAdd />
						</Suspense>
					}
				/>
				<Route
					path="inventory/stockTake/edit/:stockTakeId"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockTake />
						</Suspense>
					}
				/>

				<Route
					path="inventory/stockAvailability"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockAvailability />
						</Suspense>
					}
				/>
				<Route
					path="inventory/stockAvailability/on-order/:productId/:locationId"
					element={
						<Suspense fallback={<PageLoader />}>
							<OnOrderDetails />
						</Suspense>
					}
				/>
				<Route
					path="inventory/stockAvailability/allocated/:productId/:locationId"
					element={
						<Suspense fallback={<PageLoader />}>
							<AllocatedDetails />
						</Suspense>
					}
				/>

				{/* Settings */}
				<Route path="settings/general-settings" element={<GeneralSetting />} />
				<Route
					path="settings/general-settings/brands"
					element={
						<Suspense fallback={<PageLoader />}>
							<Brands />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/sales-reps"
					element={
						<Suspense fallback={<PageLoader />}>
							<SalesReps />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/sales-defaults"
					element={
						<Suspense fallback={<PageLoader />}>
							<SalesDefaults />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/currencies"
					element={
						<Suspense fallback={<PageLoader />}>
							<Currencies />
						</Suspense>
					}
				/>

				<Route
					path="settings/general-settings/profile"
					element={
						<Suspense fallback={<PageLoader />}>
							<ProfileSettings />
						</Suspense>
					}
				/>

				<Route
					path="settings/general-settings/purchase-defaults"
					element={
						<Suspense fallback={<PageLoader />}>
							<PurchaseDefaults />
						</Suspense>
					}
				/>

				<Route
					path="settings/general-settings/warehouses"
					element={
						<Suspense fallback={<PageLoader />}>
							<Warehouses />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/categories"
					element={
						<Suspense fallback={<PageLoader />}>
							<Categories />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/pricelist-names"
					element={
						<Suspense fallback={<PageLoader />}>
							<PriceLists />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/pricelist-names/import"
					element={
						<Suspense fallback={<PageLoader />}>
							<PriceListImport />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/payment-terms"
					element={
						<Suspense fallback={<PageLoader />}>
							<PaymentTerms />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/units-of-measure"
					element={
						<Suspense fallback={<PageLoader />}>
							<UnitsOfMeasure />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/stock-pickers"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockPickers />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/carriers"
					element={
						<Suspense fallback={<PageLoader />}>
							<Carriers />
						</Suspense>
					}
				/>
				<Route
					path="/settings/general-settings/default-account-mapping"
					element={
						<Suspense fallback={<PageLoader />}>
							<DefaultAccountMapping />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/document-numbering"
					element={
						<Suspense fallback={<PageLoader />}>
							<DocumentNumbering />
						</Suspense>
					}
				/>
				<Route
					path="settings/general-settings/document-templates"
					element={
						<Suspense fallback={<PageLoader />}>
							<DocumentTemplates />
						</Suspense>
					}
				/>
				<Route path="settings/users-roles" element={<UsersRoles />} />

				{/* Integrations */}
				<Route
					path="integrations"
					element={
						<Suspense fallback={<PageLoader />}>
							<Integrations />
						</Suspense>
					}
				/>
				<Route
					path="integrations/xero"
					element={
						<Suspense fallback={<PageLoader />}>
							<Xero />
						</Suspense>
					}
				/>

				{/* Reports */}
				<Route
					path="reports"
					element={
						<Suspense fallback={<PageLoader />}>
							<Reports />
						</Suspense>
					}
				/>
				<Route
					path="reports/sales/by-product-details"
					element={
						<Suspense fallback={<PageLoader />}>
							<SalesByProductDetails />
						</Suspense>
					}
				/>
				<Route
					path="reports/sales/invoices-and-credit-notes"
					element={
						<Suspense fallback={<PageLoader />}>
							<SalesInvoicesAndCreditNotes />
						</Suspense>
					}
				/>
				<Route
					path="reports/sales/profit-by-sales-representatives"
					element={
						<Suspense fallback={<PageLoader />}>
							<ProfitBySalesRepresentative />
						</Suspense>
					}
				/>
				<Route
					path="reports/purchase/purchase-order-details"
					element={
						<Suspense fallback={<PageLoader />}>
							<PurchaseOrderDetails />
						</Suspense>
					}
				/>
				<Route
					path="reports/purchase/purchase-order-vs-invoice"
					element={
						<Suspense fallback={<PageLoader />}>
							<PurchaseOrderVsInvoice />
						</Suspense>
					}
				/>
				<Route
					path="reports/purchase/cost-analysis"
					element={
						<Suspense fallback={<PageLoader />}>
							<PurchaseCostAnalysis />
						</Suspense>
					}
				/>
				<Route
					path="reports/purchase/stock-received-vs-invoiced"
					element={
						<Suspense fallback={<PageLoader />}>
							<StockReceivedVsInvoiced />
						</Suspense>
					}
				/>
				<Route
					path="reports/inventory/product-stock-level"
					element={
						<Suspense fallback={<PageLoader />}>
							<ProductStockLevel />
						</Suspense>
					}
				/>
				<Route
					path="reports/inventory/movement-details"
					element={
						<Suspense fallback={<PageLoader />}>
							<InventoryMovementDetails />
						</Suspense>
					}
				/>

				<Route path="*" element={<Dashboard />} />
			</Route>
		</SentryRoutes>
	);
};
