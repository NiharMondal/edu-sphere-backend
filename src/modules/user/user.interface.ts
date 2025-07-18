type TRole = "student" | "instructor" | "admin";

export interface IUser {
	name: string;
	email: string;
	avatar: string;
	password: string;
	phone: string;
	role: TRole;
	isDeleted: boolean;
}
