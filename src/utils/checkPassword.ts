import bcrypt from "bcrypt";
import { envConfig } from "../config";

//comparing password with new password
export const comparePassword = async (newPass: string, oldPass: string) => {
	const result = await bcrypt.compare(newPass, oldPass);

	return result;
};

// make password into hash form
export const hashPassword = async (pass: string) => {
	const result = await bcrypt.hash(pass, envConfig.salt_round);
	return result;
};
