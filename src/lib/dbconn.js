import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        if(mongoose.connection.readyState === 1) {
            console.log('Already Connect..');
            return;
        }

        return mongoose.connect(process.env.DB_URL, {
            dbName:"Notezy"
        });
    }
    catch(err) {
        console.log(err);
    }
}