import {NextFunction, Request,Response} from "express";
import {connectRedis} from './redis';
const Capacity=15;
// let count=0;
export async function createLeakyBucket(req:Request,res:Response,next:NextFunction){
    try{
        const redis=await connectRedis();
        const userId=req.ip;
        const length=await redis.lLen(`auth-data:${userId}`);
        if(length>Capacity){
            return res.status(429).json({
                message:"Too many login attempts."
            });
        }
        await redis.rpush(`auth-data:${userId}`,Date.now().toString());
        await redis.lpop(`auth-data:${userId}`);
        next();
    }
    catch(err){
        console.error('Error occured ',err);
    }
}