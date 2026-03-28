import mongoose, { Schema } from "mongoose";

interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    role: "user" | "deliveryboy" | "admin";
    createdAt: Date;
    image?: string;
    isOAuth?: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
         required: function (this: IUser & { isOAuth?: boolean }) {
        return !this.isOAuth; 
      },
    },
    role: {
        type: String,
        enum: ["user", "deliveryboy", "admin"],
        default: "user"
    },

    image: {
        type: String,
        default: ""
    },

     isOAuth: {             
    type: Boolean,
    default: false
  },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;