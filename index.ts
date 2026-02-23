import express from 'express';
import {connectRedis} from './redis';
import {createLeakyBucket} from './rate-limiter';
async function redisStart(){
    try{
        await connectRedis();
        const app=express();
        app.use(createLeakyBucket);
        app.get("/",(req,res)=>{
            res.json({message:"Hello"});
        })
        app.listen(3000,()=>{
            console.log('Server running on port 3000');
        })
    }
    catch(err){
        console.error('failed to start server',err);
        process.exit(1);
    }
};

redisStart();