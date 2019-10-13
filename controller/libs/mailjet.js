const configs = require('../../configs')
const mailjet = require('node-mailjet').connect(configs.mailJetApiKey, configs.mailJetSecretKey)

module.exports = {
  sendRegisterVerifyEmail: () => {
    mailjet.post("send", { 'version': 'v3.1' }).request({
        "Messages": [
          {
            "From": {
              "Email": "wisecolt@gmail.com",
              "Name": "wise"
            },
            "To": [
              {
                "Email": "wisecolt@gmail.com",
                "Name": "wise"
              }
            ],
            "Subject": "Selam",
            "TextPart": "My first Mailjet email",
            "HTMLPart": "<h3>Verify mail <a href='https://www.mailjet.com/'>Verify</a>!</h3><br />",
            "CustomID": "AppGettingStartedTest"
          }
        ]
      })
  },
  sendForgotPasswordEmail: (userId) => {
    console.log(userId);
  }
}
