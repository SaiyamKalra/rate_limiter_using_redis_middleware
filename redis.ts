import {createClient} from 'redis';

const redis=createClient({
    url:'redis://localhost:6379',
});

redis.on("connection",(err: any)=>{
    console.error("Redis Error:",err);
})

export async function connectRedis(){
    if(!redis.isOpen){
        await redis.connect();
        console.log("Redis Connected");
    }
    return redis;
}