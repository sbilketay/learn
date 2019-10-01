const jwt = require('jsonwebtoken');
const TokenKey = "11233423325";


const verify = async (token) => {
    try {
        let decoded = await jwt.verify(token, TokenKey);
        return decoded;    
    } catch (error) {
        return false;
    }
}


const create = async (payload) => {
    let token = await jwt.sign(payload, TokenKey);
    return token;
}

module.exports = {
    verify,
    create
}