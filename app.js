const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./controller/user')

app.use('/users', require('./route/users'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.post('/login', async (req, res) => {
    let user = await User.login(req.body)
    res.json(user)
})
app.get('/', (req, res) => {
    res.json({
        status: 'ok'
    })
})

app.listen(3000, ()=>{
    console.log('Listening 3000');
    
})