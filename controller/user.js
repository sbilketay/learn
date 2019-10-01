const Jwt = require('./jwt')


const login = async (userdata) => {
    
  let token = await Jwt.create({email: userdata.email})
  console.log(token);
  
  
}

module.exports = {login}