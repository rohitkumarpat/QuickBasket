import mongoose from "mongoose";

interface Order {
    id:mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    item :[
        {
          groceryId: mongoose.Types.ObjectId;
           name: string;
              price: number;
              unit: string;
              image: string;
            quantity: number;
        }
    ]
    ispaid: boolean;
    totalamount: number;
    paymentMethod: "cod"|"online";
    address:{
        fullName: string;
        city: string;
        state: string;
        postalCode: string;
        fulladdress: string;
        mobile: string;
        latitude: number;
        longitude: number;
    }
    status: "pending" | "out-for-delivery" | "delivered" | "cancelled";
    createdAt?: Date;
    updatedAt?: Date;
   
    }


    const orderSchema = new mongoose.Schema<Order>(
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            item: [
                {
                    groceryId: { type: mongoose.Schema.Types.ObjectId, ref: "Grocery", required: true },
                    name: { type: String, required: true },
                    price: { type: Number, required: true },
                    unit: { type: String, required: true },
                    image: { type: String, required: true },
                    quantity: { type: Number, required: true },
                },
            ],
            ispaid: 
            { 
                type: Boolean, default: false 
            },
            totalamount: { type: Number, required: true },
            paymentMethod: { type: String, enum: ["cod", "online"], required: true },
            address: {
                fullName: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                postalCode: { type: String, required: true },
                fulladdress: { type: String, required: true },
                mobile: { type: String, required: true },
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true },
            },
            status: { type: String, enum: ["pending", "out-for-delivery", "delivered", "cancelled"], default: "pending" },
        },
        { timestamps: true }
    );

const Order=mongoose.models.Order || mongoose.model<Order>("Order", orderSchema);

export default Order;