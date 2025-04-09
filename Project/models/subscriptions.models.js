import mongoose from "mongoose";

const subscriptionsSchema = mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",                          // who is subscibing
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",                     // to whom subscriber is subscribing
    }
},{timestamps:true});

export const subscriptions = mongoose.model("subscriptions",subscriptionsSchema);