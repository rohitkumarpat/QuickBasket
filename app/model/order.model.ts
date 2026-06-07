import mongoose from "mongoose";

export interface Order {
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
      assignment?: mongoose.Types.ObjectId | null;
    assignmentdeliveryboyId?: mongoose.Types.ObjectId | null;
    status: "pending" | "out-for-delivery" | "delivered" | "cancelled";
    deliveryotp:string|null;
    deliveryotpverfication:boolean;
    deliveryat:Date|null;
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


            
            assignment: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAssignment", default: null },

            assignmentdeliveryboyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

            status: { type: String, enum: ["pending", "out-for-delivery", "delivered", "cancelled"], default: "pending" },

            deliveryotp: { type: String, default: null },
            deliveryotpverfication: { type: Boolean, default: false },
            deliveryat: { type: Date, default: null },
            
        },
        { timestamps: true }
    );

const Order=mongoose.models.Order || mongoose.model<Order>("Order", orderSchema);

export default Order;