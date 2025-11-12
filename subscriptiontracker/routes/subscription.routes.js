import { Router } from "express";
import { AuthorizationMiddleware } from "../middlewares/auth.middlewares.js";
import { cancelSubscription, createsubscription, deletesubscription, getsubscription, getSubscriptionByid, getSubscriptionsByUser, getUpcomingRenewals, updateSubscription } from "../controllers/subscription.controller.js";
const subscriptionrouter = Router();
subscriptionrouter.get("/", AuthorizationMiddleware,getsubscription);
subscriptionrouter.get("/upcoming-renewals",AuthorizationMiddleware,getUpcomingRenewals)
subscriptionrouter.get("/:id", AuthorizationMiddleware,getSubscriptionByid);
subscriptionrouter.delete("/:id", AuthorizationMiddleware,deletesubscription);
subscriptionrouter.post("/",AuthorizationMiddleware ,createsubscription)
subscriptionrouter.get("/user/:userId", AuthorizationMiddleware,getSubscriptionsByUser);

subscriptionrouter.put("/:id", AuthorizationMiddleware,updateSubscription)
subscriptionrouter.put("/:id/cancel", AuthorizationMiddleware,cancelSubscription)
export default subscriptionrouter;
