// const databaseHelper = require('../services/helper/database');
// const redisHelper = require('../services/helper/redis');
// const chalk = require('chalk')
// const redis = require('redis');
// let redisClient;

// if(process.env.REDIS_URL){
//     redisClient = redis.createClient(process.env.REDIS_URL);
// }else{
//     redisClient = redis.createClient();
// }

// const init = () => {
//     // Set Redis Client Name
//     redisClient.client('SETNAME', 'rateflix');
//     // Redis Connect 
//     redisClient.on('connect', () => console.log(chalk.cyanBright.bold('Redis is live!')))
//     // Redis Error Connect
//     redisClient.on('error', (error) => console.log(chalk.redBright.bold('Redis is kill!') + error))
// }

// const initCache = async (cacheLength, expTime) => {
//     // Cache'i temizle
//     await redisHelper.emptyRedisCache(redisClient);
//     // Cache'e yeni verileri koy
//     const result = await databaseHelper.getMediaForRedisCache(cacheLength, expTime);
//     result.forEach((media) => {
//         redisClient.setex(media.netflix_id, expTime, JSON.stringify(media), (err, res) => { });
//     })
// }

// const searchRedisCache = async (netflix_id) => {
//     return new Promise((resolve, reject) => {
//         redisClient.get(netflix_id, (error, data) => {
//             if (error) {
//                 reject(error)
//             } else {
//                 resolve(JSON.parse(data))
//             }
//         });
//     })

// }

// module.exports = { initCache, searchRedisCache, init }