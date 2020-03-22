const usersCollection = require('../db').collection("users")
const validator = require("validator")

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function () {
    if (typeof(this.data.username) != "string") {this.data.username = ""}
    if (typeof(this.data.email) != "string") {this.data.email = ""}
    if (typeof(this.data.password) != "string") {this.data.password = ""}

    // get rid of any other properties
    this.data = {
        username: this.data.username.trim().toLowerCase(), // will trip all spaces
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}


User.prototype.validate = function() {
    if (this.data.username == "") {this.errors.push("You must provide a username.")}
    if (this.data.username !== "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
    if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email adress.")}
    if (this.data.password == "") {this.errors.push("You must provide a password.")}
    if (this.data.password.length > 0 && this.data.password.length < 8) {this.errors.push("Password must be at least 8 characters.")}
    if (this.data.password.length > 100) {this.errors.push("Password can not exceed 100 characters.")}
    if (this.data.username.length > 0 && this.data.username.length < 2) {this.errors.push("Username must be at least 2 characters.")}
    if (this.data.username.length > 30) {this.errors.push("Username can not exceed 30 characters.")}
}
User.prototype.register = function () {
    // step 1 - val user data
    this.cleanUp()
    this.validate()
    // step 2 - only if are no val error -> save the user data into datadase
    if (!this.errors.length) {
        usersCollection.insertOne(this.data)
    }
}

module.exports = User