import bcrypt from "bcrypt";

export const checkPassword = async (newPass: string, oldPass: string) => {
	const result = await bcrypt.compare(newPass, oldPass);

	return result;
};
