import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    testLabel: String, 
    test: [
        {
            question: String,
            choices: [String],
            answer: String,
        }
    ],
})

testSchema.virtual('id').get(function() {
    return this._id;
});

const forgotPasswordSchema = new mongoose.Schema({
    email: {type: String, required: true},
    passcode: {type: Number, required: true},
    salt: {type: String, required: true},
    expirationDate: {type: Date, expires: 0}
})

const UserTierSchema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    tier: {type: String, required: true },
    generationsLeft: {type: Number, required: true},
    subscriptionId: {type: String},
    customerId: {type:String},
    createdAt: {type: Date, default: Date.now()},
    expirationDate: {type: Date, expires: 0}
})

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: {type: String, required: true},
    freeTrialUsed: {type: Boolean, default: false},
    authentication: {
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String , select: false},
    },
    testsLibrary: [testSchema]
})

export const UserModel = mongoose.model('User', UserSchema)
export const ForgotPasswordModel = mongoose.model('ForgotPasswordPasscode', forgotPasswordSchema)
export const UserTierModel = mongoose.model('UserTierObject', UserTierSchema)

//userTierObject db methods

export const createUserTierObject = (values: Record<string, any>) => {
    return new UserTierModel(values).save().then(
        (user: Record<string, any>) => {
            user.toObject();
        } 
    )
}

export const getUserTierObject = (email: String, username: String) => {
    return UserTierModel.findOne({'email': email, 'username': username})
}

export const deleteUserTierObject = (email: String, username: String) => {
    return UserTierModel.findOneAndDelete({'email': email, 'username': username})
}

//forgotPassword db methods

export const createForgotPasswordPasscode = (values: Record<string, any>) => {
    return new ForgotPasswordModel(values).save().then(
        (user: Record<string, any>) => {
            user.toObject();
        } 
    )
}

export const getForgotPasswordObjectByEmail = (email: String) => {
    return ForgotPasswordModel.findOne({'email': email})
}

export const deleteForgotPasswordObjectByEmail = (email: String) => {
    return ForgotPasswordModel.findOneAndDelete({'email': email})
}

//user db methods

export const createUser = (values: Record<string, any>) => {
    return new UserModel(values).save().then(
        (user: Record<string, any>) => {
            user.toObject();
        } 
    )
}

export const getUsers = () => {
    return UserModel.find()
}

export const getUserByEmail = (email: String) => {
    return UserModel.findOne({'email': email})
}

export const getUserBySessionToken = (sessionToken: String) => {
    return UserModel.findOne({'authentication.sessionToken': sessionToken})
}

export const getUserById = (id: String) => {
    return UserModel.findOne({_id: id})
}

export const deleteUserById = (id: String) => {
    return UserModel.findOneAndDelete({_id: id})
}

export const updateUserById = (id: String, values: Record<string, any>) => {
    return UserModel.findByIdAndUpdate({_id: id}, values)
}