const emailValidator = require('validator')

const form = (userdata) => {
    return new Promise((resolve, reject) => {
        let message = []
        // Are password is empty?
        if (userdata.password == '' || userdata.repassword == '' || userdata.username == '' || userdata.email == '') {
            console.log('Cannot be empty field!');
            message.push('Cannot be empty field!')
        }
        // Are password is compatible?
        if (userdata.password != userdata.repassword) {
            console.log('Password don\'t match');
            message.push('Password don\'t match')
        }
        // Email validation
        if (emailValidator.isEmail(userdata.email) == false) {
            console.log('Email not available!');
            message.push('Email not available!')
        }

        if (message) {
            reject(message)
        } else {
            resolve('Ok')
        }
    })
}

module.exports = { form }