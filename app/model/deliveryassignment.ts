    import mongoose from "mongoose";


    export interface deliveryAssignment {
        _id?: mongoose.Types.ObjectId;
        orderId: mongoose.Types.ObjectId,
        broadcasterId: mongoose.Types.ObjectId[],
        assigneid: mongoose.Types.ObjectId | null,
        status: "assigned" | "broadcast" | "completed",
        acceptedAt: Date,
        createdAt?: Date;
        updatedAt?: Date;

    }

    const deliveryAssignmentSchema = new mongoose.Schema<deliveryAssignment>(
        {
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
            broadcasterId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            assigneid: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
            status: { type: String, enum: ["assigned", "broadcast", "completed"], default: "broadcast" },
            acceptedAt: { type: Date, default: null },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now }
        }
    );

    const DeliveryAssignment = mongoose.models.DeliveryAssignment || mongoose.model<deliveryAssignment>("DeliveryAssignment", deliveryAssignmentSchema);

    export default DeliveryAssignment;
