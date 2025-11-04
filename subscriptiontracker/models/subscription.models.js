import mongoose from "mongoose";
const subscriptionSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,"Subscription name is required"],
    trim:true,
    minlength:[3,"Subscription name must be at least 3 characters long"],
    maxlength:[100,"Subscription name can be at most 100 characters long"]
 
},
price:{
    type:Number,
    required:[true,"Subscription price is required"],
    min:[0,"Subscription price cannot be negative"]
},
currency:{
    type:String,
    enum:["USD","EUR","GBP","INR","JPY","PKR"],
    default:"USD"
},
frequency:{
    type:String,
    enum:["monthly","yearly","weekly","daily"],
    default:"monthly"
},
category:{
    type:String,
    enum:["entertainment","productivity","education","health","other","technology"],
    required:[true,"Subscription category is required"]
    
},
paymentmethod:{
    type:String,
   required:[true,"Payment method is required"],
},
status:{
    type:String,
    enum:["active","inactive","canceled","expired"],
    default:"active"
},
startdate:{
    type:Date,
    required:[true,"Subscription start date is required"],
    validate:{
        validator:function(value){
            return value<=new Date();
        }
    }
},
renewaldate:{
    type:Date,

    validate:{
        validator:function(value){
            return value>this.startdate;
        },
        message:"Renewal date must be after start date"
    }
    
},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"Subscription must be associated with a user"]
}


},{timestamps:true})
subscriptionSchema.pre("save",function(next){
if(!this.renewaldate){
    const renewalperiods={
        daily:1,
        weekly:7,
        monthly:30,
        yearly:365
    };
    this.renewaldate=new Date(this.startdate);
    this.renewaldate.setDate(this.renewaldate.getDate()+renewalperiods[this.frequency]);

}
if(this.renewaldate<new Date()){
    this.status="expired";
}
next();
}
)
const Subscription=mongoose.model("Subscription",subscriptionSchema)
export default Subscription;