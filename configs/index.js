var config = {
    port: 3000,
    cookieExpirationTime: 1000 * 60 * 60 * 24 * 30, // 1 mounth
    tookenExpirationTime: 1000 * 60 * 60 * 24 * 30, //1 mounth
    secret: "shhh",
    mongodburl: 'mongodb://localhost:27017/jwt',
    // mongodburl: 'mongodb://mongo:27017/authmongo' //server
}

module.exports = config