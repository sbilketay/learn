var config = {
    port: 3000,
    // If the Remember me option is not selected
    cookieExpirationTimeRememberTrue: 1000 * 60 * 60 * 24 * 30, // 1 mounth
    // Remember me option is selected
    cookieExpirationTimeRememberFalse: 1000 * 60 * 30, // 30 minute
    tookenExpirationTime: 1000 * 60 * 60 * 24 * 30, // 1 mounth
    secret: "shhh",
    avatarSizeLimit: 250000, // 250 KB
    mongodburl: 'mongodb://localhost:27017/jwt',
    // mongodburl: 'mongodb://mongo:27017/jwt' //server
}

module.exports = config
