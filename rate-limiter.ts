import {NextFunction, Request,Response} from "express";
import {connectRedis} from './redis';
const Capacity=10;
export async function createLeakyBucket(req:Request,res:Response,next:NextFunction){
    try{
        const time=Date.now();
        const redis=await connectRedis();
        const userId=req.ip;
        const timeStamp=await redis.lRange(`auth-data:${userId}`,0,-1);
        for(const t of timeStamp){
            if(time-Number(t)>=100000){
                await redis.lPop(`auth-data:${userId}`);
            }
            else{
                break;
            }
        }
        const length=await redis.lLen(`auth-data:${userId}`);
        if(length>=Capacity){
            return res.status(429).json({
                message:"Too many login attempts."
            });
        }
        await redis.rPush(`auth-data:${userId}`,time.toString());
        next();
    }
    catch(err){
        console.error('Error occured ',err);
    }
}