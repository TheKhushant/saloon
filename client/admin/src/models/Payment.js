import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({

  bookingId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Booking"
  },

  amount:Number,

  method:String,

  status:{
    type:String,
    default:"pending"
  }

},{timestamps:true});

export default mongoose.model("Payment", paymentSchema);