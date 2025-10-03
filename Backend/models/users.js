const User = require('../schemas/users');


const loginUser = (email, password, callback) => {
    return User.findUserByEmail(email, (err, user) => {
        if(err){
            return callback(err);
        }
        if(!user){
            return callback(null, null);
        }
        if(user.password !== password){
            return callback(null, null);
        }
        return callback(null, user);
    });
};


const getAllUsers = (callback) => { 
    return User.findAllUsers(callback);
}

const getUserById = (id, callback) => {
    return User.findUserById(id, callback);
}

const getUserByApiKey = (id, callback) => {
    return User.findUserByApiKey(id, callback);
}

const getUserByEmail = (email, callback) => {
    return User.findUserByEmail(email, callback);
}

const saveUser = (user, callback) => {
    return User.saveUser(user, callback);
}

const updateUser = (id, user, callback) => {
    return User.updateUser(id, user, callback);
}

module.exports = {
    loginUser,
    getAllUsers,
    getUserById,
    getUserByApiKey,
    getUserByEmail,
    saveUser,
    updateUser
}