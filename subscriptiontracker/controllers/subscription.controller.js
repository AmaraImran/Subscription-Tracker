import Subscription from "../models/subscription.models.js";

export const createsubscription=async(req,res,next)=>{
try {
    const subscription=await Subscription.create({
        ...req.body,
        user:req.user._id
    })
    res.status(200).json({success:true,data:subscription})

} catch (error) {
    next(error);
}


}
export const getsubscription=async(req,res,next)=>{
    try {
        // if(!req.params.id.toString()){
        //     const error=new Error("You are not authorizd!")
        //     error.statusCode=401
        //     throw error
        // }
        const subscription=await Subscription.find()
        res.status(200).json({
            success:true,
            data:subscription
        })
    } catch (error) {
        next(error)
    }
}
export const deletesubscription=async(req,res,next)=>{
    try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
   

    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      deletedSubscription: subscription,
    });
  } catch (error) {
    next(error);
  }
}
export const getSubscriptionByid=async(req,res,next)=>{
    try {
        const subscription=await Subscription.findById(req.params.id)
        if(!subscription) return res.status(400).json({success:false,message:"Subscription not found!"})
      res.status(200).json({success:true,data:subscription})

    } catch (error) {
        next(error)
    }
}
// ✅ Get upcoming renewals (within 7 days)
export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const subscriptions = await Subscription.find({
      renewaldate: { $gte: today, $lte: nextWeek },
      status: "active",
    }).populate("user", "email");

    res.status(200).json({
      success: true,
      message: "Upcoming renewals within next 7 days",
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error) {
    next(error);
  }
};


// ✅ Cancel a subscription
export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);
    if (!subscription)
      return res.status(404).json({ success: false, message: "Subscription not found" });

    if (subscription.status === "canceled")
      return res.status(400).json({ success: false, message: "Subscription already canceled" });

    subscription.status = "canceled";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription canceled successfully",
      subscription,
    });
  } catch (error) {
    next(error);
  }
};


export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the subscription by ID
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Update fields directly from the request body
    subscription.name = req.body.name || subscription.name;
    subscription.price = req.body.price || subscription.price;
    subscription.currency = req.body.currency || subscription.currency;
    subscription.frequency = req.body.frequency || subscription.frequency;
    subscription.category = req.body.category || subscription.category;
    subscription.paymentmethod = req.body.paymentmethod || subscription.paymentmethod;
    subscription.renewaldate = req.body.renewaldate || subscription.renewaldate;

    // Save the updated subscription
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all subscriptions of the logged-in user
export const getSubscriptionsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId; // from URL param

    // Find subscriptions that belong to this user
    const subscriptions = await Subscription.find({ user: userId });

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
