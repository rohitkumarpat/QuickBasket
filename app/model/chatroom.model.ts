import mongoose from "mongoose";

interface Ichatroom {
    _id?: mongoose.Types.ObjectId;
    userid: mongoose.Types.ObjectId;
    deliveryboyid: mongoose.Types.ObjectId;
    orderid: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const chatroomSchema = new mongoose.Schema<Ichatroom>({
    userid: { type: mongoose.Schema.Types.ObjectId, required: true ,ref:"User"},
    deliveryboyid: { type: mongoose.Schema.Types.ObjectId, required: true ,ref:"User"},
    orderid: { type: mongoose.Schema.Types.ObjectId, required: true ,ref:"Order"},
});

const Chatroom = mongoose.models.Chatroom || mongoose.model<Ichatroom>("Chatroom", chatroomSchema);

export default Chatroom;