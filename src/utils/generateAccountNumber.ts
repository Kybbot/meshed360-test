export const generateAccountNumber = (name: string) => {
	const cleanedName = name.trim().toUpperCase();

	// Extract first two characters of the first and last word
	const nameParts = cleanedName.split(" ");
	let prefix = nameParts[0].substring(0, 2);
	if (nameParts.length > 1) {
		prefix += nameParts[nameParts.length - 1].substring(0, 2);
	} else {
		prefix += "XX"; // Default if only one word in name
	}

	// Generate a random 6-digit number
	const randomNumber = Math.floor(100000 + Math.random() * 900000);

	// Combine prefix and random number
	return `${prefix}${randomNumber}`;
};
