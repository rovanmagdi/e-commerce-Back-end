const { model, Schema } = require("mongoose");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const userSchema = new Schema({
  firstName: { type: String, required: true, minlength: 3 },
  lastName: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:{ type:Boolean,default:false}
   })


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    var user = this;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  }
});
process.env.SECERT_TOKEN;

userSchema.methods.generatetoken = function () {
  const token = jwt.sign({ _id: this._id,isAdmin:this.isAdmin }, `${process.env.SECERT_TOKEN}`);
  return token;
};
const userModel = model("user", userSchema);

module.exports = userModel;
