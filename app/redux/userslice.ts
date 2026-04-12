    import { createSlice } from "@reduxjs/toolkit";
    import mongoose from "mongoose";

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
    }

    interface Iuseslice {
        user: IUser | null;
    }

    const initalstate={
        user:null
    } as Iuseslice



    const userslice = createSlice({
        name:"user",
        initialState:initalstate,
        reducers:{ 
            setUser:(state,action)=>{
                state.user=action.payload
            }

        }
    })

    export const {setUser}=userslice.actions
    export default userslice.reducer

