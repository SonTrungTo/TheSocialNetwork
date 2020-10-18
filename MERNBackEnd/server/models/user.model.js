import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: "Username is required"
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill in a valid email address'],
        required: "Email is required"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: 'Hashed password is required'
    },
    salt: String
});

UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function (password) {
        if (!password) {
            return '';
        }
        try {
            return require('crypto')
                    .createHmac('sha256', this.salt)
                    .update(password)
                    .digest('hex');
        } catch (err) {
            return '';
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

UserSchema.path(hashed_password).validate(function (v) {
    const password_pattern =
    /^(?=*[a-z])(?=*[A-Z])(?=*\d)(?=*[!#%?$@&=].{8,})$/;
    if (this._password && !password_pattern.test(this._password)) {
        this.invalidate('password', 'Password must contain 1 digit, ' +
        '1 lowercase letter(a-z), 1 uppercase letter(A-Z), ' +
        'and 1 special character(!#%?$"&=) and at least 8 characters long.');
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required');
    }
}, null);

export default mongoose.model('User', UserSchema);