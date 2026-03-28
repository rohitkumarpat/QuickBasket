import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;

if(!mongodbUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables");
}

let cache = global.mongoose;
if(!cache) {
    cache = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
    if(cache.conn) {
        return cache.conn;
    }
    if(!cache.promise) {
        cache.promise = mongoose.connect(mongodbUrl).then((mongoose) => {
            return mongoose.connection;
        }).catch((error) => {
            cache.promise = null;
            throw error;
        });
    }
    cache.conn = await cache.promise;
    return cache.conn;
};

export default connectToDatabase;