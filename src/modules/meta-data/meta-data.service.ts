import { Course } from "../course/course.model";
import { PaymentHistory } from "../payment/payment.model";
import { User } from "../user/user.model";

const generalInformation = async () => {
	const studentCount = await User.countDocuments({ role: "student" });
	const instructorCount = await User.countDocuments({ role: "instructor" });
	const courseCount = await Course.countDocuments();
	const totalEarning = await PaymentHistory.find();
	const subTotal = totalEarning.reduce((acc, curr) => curr.amount + acc, 0);

	return {
		students: studentCount,
		instructors: instructorCount,
		courses: courseCount,
		earnings: subTotal,
	};
};

const revenue = async () => {
	const res = await PaymentHistory.find().select("createdAt amount");
	return res;
};

export const metaDataServices = { generalInformation, revenue };
