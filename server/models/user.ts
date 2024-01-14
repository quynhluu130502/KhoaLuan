import * as mongoose from 'mongoose'

let userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    role: {
        required: true,
        type: String
    }
})

export default mongoose.model('User', userSchema)
