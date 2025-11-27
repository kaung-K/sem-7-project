import Base from "../models/Base.js";
import Subscription from "../models/Subscription.js"
import { checkAuthorization } from "./Authorization.js";

export const getAdminDashboard = async(req,res) => {// This will response with an object
    checkAuthorization(req,res);
    try{
        console.log(req.user);
        
        if(req.user.role === 'admin'){
            const users = await Base.countDocuments({$or : [{role : "user"},{role : "creator"}]});
            const creators = await Base.countDocuments({role: "creator"});
            const subscriptions = await Subscription.countDocuments({active: true});
            const dashboardData = {
                users,
                creators,
                subscriptions
            }
            return res.status(200).json(dashboardData);
        }else{
            return res.status(401).json({message : "Unauthorized access"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Cannot get Dashboard Data"});
    }
};

export const getAllUsers = async(req,res) => {
    checkAuthorization(req,res);
    try{
        const userArray = await Base.find({role : "user"}, '-password').lean();
        const creatorArray = await Base.find({role: "creator"},'-password').lean();
        const arr = {
            users: userArray,
            creators: creatorArray
        }
        return res.status(200).json(arr);
    }catch(err){
        console.error(err);
        return res.status(500).json({message : "Cannot get User Data"});
    }
    
}