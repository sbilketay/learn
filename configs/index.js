var config = {
    port: 3000,
    // If the Remember me option is not selected
    cookieExpirationTimeRememberTrue: 1000 * 60 * 60 * 24 * 30, // 1 mounth
    // Remember me option is selected
    cookieExpirationTimeRememberFalse: 1000 * 60 * 30, // 30 minute
    // Token Settings
    tookenExpirationTime: 1000 * 60 * 60 * 24 * 30, // 1 mounth
    secret: "shhh",
    // Avatar upload settings
    avatarNameLength: 15,
    avatarSizeLimit: 250000, // 250 KB
    avatarFileTypes: /jpeg|jpg|png/,
    // Mailjet Settings
    mailJetApiKey: '185f338a7b978248f0ae84bce534ce13',
    mailJetSecretKey: '15a4649f1a0c968b42d4bc0afc6d9cdd',
    // Mongo Settings
    mongodburl: 'mongodb://localhost:27017/jwt',
    // mongodburl: 'mongodb://mongo:27017/jwt' //server
    // The Movie DB api key
    tmdbApiKey: 'd9d6007d1bcf12043db5a085ae3e5bbb',
    // Flixinfo api default language
    defaultLanguage: 'en-EN',
}

module.exports = config
