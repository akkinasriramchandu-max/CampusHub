import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    bannerImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Technical",
        "Cultural",
        "Sports",
        "Workshop",
        "Seminar",
        "Fest",
        "Other",
      ],
      default: "Other",
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
    },
    totalSeats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: 1,
    },
    seatsAvailable: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

eventSchema.virtual("isRegistrationOpen").get(function () {
  return (
    this.seatsAvailable > 0 && new Date() < new Date(this.registrationDeadline)
  );
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

export default mongoose.model("Event", eventSchema);
