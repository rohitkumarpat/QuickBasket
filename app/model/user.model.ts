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
    mobile?: string;

    location: {
    type: {
        type: StringConstructor;
        enum: string[];
        default: string;
    };
    coordinates: {
        type: NumberConstructor[];
        default: number[];
    };
}

socketid?: string| null;
isonline?: boolean;
    
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

    mobile: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    location: {
        type:{
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
        },

        socketid: {
            type: String,
            default: null
        },
        isonline: {
            type: Boolean,
            default: false
        }
        
});

userSchema.index({ location: "2dsphere" });
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;