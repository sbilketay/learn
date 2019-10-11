const UserModel = require('../models/users')
const configs = require('../configs')
const Jwt = require('./libs/jwt')
const multer = require('multer')
const path = require('path')
const pify = require('pify')

// Avatar upload and display
const avatar = {
    upload: async (req, res) => {
        const storage = multer.diskStorage({
            destination: './public/avatars',
            filename: (req, file, cb) => {
                cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
            }
        })
        // Pify, convert promise for multer.
        const upload = pify(multer({
            storage,
            limits: { fileSize: configs.avatarSizeLimit },
            fileFilter: (req, file, cb) => {
                checkFileType(file, cb)
            }
        }).single('avatar'))// Input name should be like this <input name = "avatar" type = "file" />
        // Multer filetype check
        function checkFileType(file, cb) {
            const filetypes = /jpeg|jpg|png/
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
            const mimetype = filetypes.test(file.mimetype)
            if(mimetype && extname){
                return cb(null, true)
            }else{
                cb({ message: 'only jpeg or png images!' })
            }
        }
        try {
            await upload(req, res)
            await UserModel.updateOne({ _id: req.user.userid }, { avatar: req.file.filename })
            return {
                status: 200,
                error: false,
                message: 'Upload successful!',
                data: req.file
            }
        } catch (error) {
            console.log(error.message);
            return {
                status: 409,
                error: true,
                message: 'File cannot uploaded, ' + error.message
            }
        }
    },
    // get: () => {
    // }
}

module.exports = { avatar }