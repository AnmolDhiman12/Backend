import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required: true,
        lowercase:true,
        index:true, // for SEARCHING 
        trim: true,
    },
    email:{
        type:String,
        unique:true,
        required: true,
        lowercase:true,
        trim: true,
    },
    fullName:{
            type:String,
            required: true,
            lowercase:true,
            trim: true,
            index:true,
    },
    avatar:{
        type:String, //cloudary
        required: true,
        lowercase:true,
    },
    coverImage:{
        type:String, 
    },
    password:{
        type:String, 
        required: [true,'Password is required']
    },
    refreshToken:{
        type:String, 
    },
    watchHistorty:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video"
    }
    ],
},{timestamps:true})


UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password =await bcrypt.hash(this.password,10)
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password) //return true,false
}
UserSchema.methods.generateAccessToken = function(){
    return  jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRE
    })
}
UserSchema.methods.generateRequestToken = function(){
    return  jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRE
    })
}
export const User = mongoose.model("User",UserSchema);