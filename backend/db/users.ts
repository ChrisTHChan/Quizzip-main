import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: {type: String, required: true},
    authentication: {
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},
    }
})

export const UserModel = mongoose.model('User', UserSchema)

//actions to query users

export const getUsers = () => {
    return UserModel.find()
}

export const getUserByEmail = (email: String) => {
    return UserModel.findOne({email})
}

export const getUserBySessionToken = (sessionToken: String) => {
    return UserModel.findOne({
        'authentication.sessionToken': sessionToken
    })
}

export const getUserById = (id: String) => {
    return UserModel.findOne(id)
}

export const createUser = (values: Record<string, any>) => {
    return new UserModel(values).save().then(
        (user: Record<string, any>) => {
            user.toObject();
        } 
    )
}

export const deleteUserById = (id: String) => {
    return UserModel.findOneAndDelete({_id: id})
}

export const updateUserById = (id: String, values: Record<string, any>) => {
    return UserModel.findByIdAndUpdate(id, values)
}