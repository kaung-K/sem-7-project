import {Creator} from "../models/Creator.js";
import User from "../models/User.js"; // ✅ Correct for default export
import {createCheckoutSession} from "../Util/StripeHandler.js";
import { checkAuthorization } from "./Authorization.js";

export const subscribeToCreator = async(req,res) => {
    try {
        checkAuthorization(req,res);
        const creator = await Creator.findById(req.params.creatorId);
        let subscriber;
        if(req.user.role=="user") subscriber = await User.findById(req.user.id).select('email');
        if(req.user.role=="creator") subscriber = await Creator.findById(req.user.id).select('email');
        if(!creator) {
            console.log("No creator found.");
            return res.status(404).json({message: "Creator not found"});
        }
        const session = await createCheckoutSession(creator,subscriber.email);
        res.json({url: session.url});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};  