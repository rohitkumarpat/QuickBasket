import mongoose from "mongoose";

interface Imsg {
    _id:mongoose.Types.ObjectId;
    roomid:mongoose.Types.ObjectId;
    text:string;
    senderid:mongoose.Types.ObjectId;
    time:string;
    createdAt?: Date;
    updatedAt?: Date;
}

const msgSchema = new mongoose.Schema<Imsg>({
    roomid:{type:mongoose.Schema.Types.ObjectId,ref:"Chatroom",required:true},
    text:{type:String,required:true},
    senderid:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    time:{type:String,required:true},
});

const Msg = mongoose.models.Msg || mongoose.model<Imsg>("Msg",msgSchema);

export default Msg;