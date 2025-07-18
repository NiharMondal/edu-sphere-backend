import { model, Schema } from "mongoose";
import { IModule } from "./module.interface";

const moduleSchema = new Schema<IModule>(
	{
		title: {
			type: String,
			required: [true, "Module name is required"],
			unique: [true, "Module title should be unique"],
		},

		index: {
			type: Number,
			default: 1, // auto-incremented
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		course: {
			type: Schema.Types.ObjectId,
			required: [true, "Course ID is required"],
			ref: "Course",
		},
		lectures: [
			{
				type: Schema.Types.ObjectId,
				ref: "Lecture",
			},
		],
	},
	{ timestamps: true }
);

moduleSchema.pre("save", async function (next) {
	if (!this.isNew) return next(); // Only run on new documents

	const Module = model("Module"); // Get the Module model
	const lastModule = await Module.findOne({ course: this.course }) // Find the last module in the course
		.sort("-index")
		.select("index");

	this.index = lastModule ? lastModule.index + 1 : 1; // Increment index

	next();
});

export const Module = model<IModule>("Module", moduleSchema);
