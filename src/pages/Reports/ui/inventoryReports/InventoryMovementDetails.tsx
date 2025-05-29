import ReportTamplate from "../ReportTamplate";

const InventoryMovementDetails = () => {
	return (
		<ReportTamplate
			reportApiKey="getInventoryMovementDetails"
			layoutOptionsName="inventoryMovementDetailsLayoutOptions"
			title="Inventory Movement Details"
		/>
	);
};

export default InventoryMovementDetails;
