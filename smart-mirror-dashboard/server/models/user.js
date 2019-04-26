const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        hide: true
    }
});


var User = module.exports = mongoose.model('smartUser', UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserById = function(id, callback){
    User.findById(id,callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query,callback);
}

module.exports.createUser =  function(newUser, callback){
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err) throw err;
        // Set hashed password
        newUser.password = hash;
        //create user
        console.log('idhar')
        newUser.save(callback);
        console.log('udhar')
    });
}


module.exports.changePassword =  function(newUser, callback){
    bcrypt.hash(newUser.password, 10, function(err, hash){
        console.log('in bcrypt')
        console.log(newUser);
        console.log(hash);
        newUser.password = hash;
        User.findOne({email: newUser.email}, function (err, user) {
            console.log(user)
            user.password = newUser.password;
            console.log(user)
            user.save(callback);
        });
    });
}
