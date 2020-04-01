const chalk = require('chalk')

module.exports = {

    emptyRedisCache: async (redisClient) => {
        return new Promise((resolve, reject) => {
            redisClient.flushdb((err, success) => {
                if (success) {
                    // Cache de bulunan verileri temizle
                    console.error(chalk.cyanBright.bold('Redis Cache Reset'));
                    resolve(true);
                } else {
                    console.error(chalk.redBright.bold('Redis Cache Can Not Reset'));
                    reject(false);
                }
            });
        });
    }
}
