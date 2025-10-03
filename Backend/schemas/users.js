const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, default: () => require('uuid').v4() },
    age: {
        type: Number,
        min: 0
    },
    Firstname: {
        type: String,
        required: true
    },
    Lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    apiKey: {
        type: String
    },
    role: { type: String, enum:['admin','user'], default:'admin' }
});

const User = mongoose.model('User', userSchema);

const saveUser = (user, callback) => {
    const { email, age, password, apiKey } = user;
    const newUser = new User({ email, age, password, apiKey });
    // Guardamos en MongoDB
    newUser.save()
    .then(() => {
        console.log('✅ Nuevo user creado!');
        return callback(null, newUser);
    })
    .catch(err => {
        console.error(err);
        return callback(err);
    });
}

const findAllUsers = (callback) => { 
    User.find()
    .then(results => {
        console.log('📋 Todos los users:', results);
        return callback(null, results);
    })
    .catch(err => {
        console.error(err);
        return callback(err);
    });
}


const findUserByApiKey = (apiKey, callback) => { 
    User.findOne({ apiKey })
   .then(result => {
    console.log('🔍 Encontrado:', result);
    return callback(null, result);
   })
   .catch(err => {
    console.error(err);
    console.log('🔍 Error:', err);
    return callback(err);
   });
}

const findUserByEmail = (email, callback) => { 
    User.findOne({ email })
   .then(result => {
    console.log('🔍 Encontrado:', result);
    return callback(null, result);
   })
   .catch(err => {
    console.error(err);
    console.log('🔍 Error:', err);
    return callback(err);
   });
}


const updateUser = (apiKey, user, callback) => { 
    User.findOneAndUpdate({ apiKey }, user, { new: true })
    .then(result => {
        console.log('🔍 Actualizado:', result);
        return callback(null, result);
    })
    .catch(err => {
        console.error(err);
        return callback(err);
    });
}


module.exports = {
    User,
    saveUser,
    findAllUsers,
    findUserByApiKey,
    findUserByEmail,
    updateUser
};