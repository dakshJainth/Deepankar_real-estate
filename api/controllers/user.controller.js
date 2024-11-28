import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test = (req,res)=>{
    res.json({
        msg:"API route is working",
    });
}

export const test2 = (req,res) =>{
    res.json({
        msg:req.params,
    })
}

export const updateUser = async (req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, "you can only update your own account"))

    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true});

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);

        
    } catch (error) {
        next(error);
    }
}


export const deleteUser = async (req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,"You can only delete your own account"));

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted').clearCookie('access_token');
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req,res,next) =>{
    if(req.user.id === req.params.id){
       
        try {
            const listings = await Listing.find({userRef: req.params.id});
            if (listings.length === 0) {
                // Handle the case where no listings were found for the user.
                res.status(404).json({ message: 'No listings found for this user.' });
            } else {
                // Return the found listings.
                res.status(200).json(listings);
            }
           
            
        } catch (error) {
          
                // Handle the error and send an appropriate response, e.g., 500 Internal Server Error.
            res.status(500).json({ error: 'Internal Server Error' });
    
        }
    }
    else{
        return  next(errorHandler(401, 'you can only view your own listings'));
    }
}