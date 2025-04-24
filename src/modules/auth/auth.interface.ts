export interface IRegisterUser {
	name: string;
	email: string;
	password: string;
	role: string;
}

export interface IChangePassword {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}
