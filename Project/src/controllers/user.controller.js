import { asyncHandler } from "../utils/ayncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../../models/user.models.js";
import { uploadOnChoudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
const generateAccessAndRefreshTokens = async(userId)=>{
    try {
       const user =  await User.findById(userId);
       const AcessToken = user.generateAccessToken();
       const RefreshToken = user.generateRequestToken();

       user.refreshToken = RefreshToken;
       await  user.save({validateBeforeSave: false});
       
       return {AcessToken , RefreshToken};

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access Token")
    }
}
const registerUser = asyncHandler(async (req,res) => {
     // get uer details from frontend
     //validation - not empty
     // already existc by username and email
     // check does it have avatar and images
     // check for the upload it to cloudinary or not
     // create the user object -- create entry in mongo db
     // remove the password and refresh  token field
     // check for user creation  
     // return res or send error

    const {fullName,email,username,password} = req.body; //i camm br from url,body....

    if([fullName,email,username,password].some((field)=> field?.trim()===""))
        throw new ApiError(400,"All fields are reaquired")
    
    const existingUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existingUser) throw new ApiError(409,"User with email or username Already Exist");

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    if(!avatarLocalPath) throw new ApiError(400,"Avatar file is Req");
    
    const avatar = await uploadOnChoudinary(avatarLocalPath);
    const coverImage = await uploadOnChoudinary(coverImageLocalPath);
    
    if(!avatar) throw new ApiError(409,"Avatar file is required");

    const user  = await User.create({fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password:password,
        username:username.toLowerCase(),
        email:email,
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken ");

    if(!createdUser) throw new ApiError(500,"Something went wrong while conecting server");

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User added Successfully")
    )
}) 

const loginUser = asyncHandler( async (req,res)=>{
       // req from user 
       // check for the user name and pasword
       // check the username is there in the db by find one
       // check password is there by checkpassword 
       // access and referesh token
       // send cookie
       const {username,password,email} = req.body;

       if(!username && !email) throw new ApiError(400,"username and password are requiired");

       const user =  await  User.findOne({
        $or: [{username} || {email}]
       })

       if(!user) throw new ApiError(400, "user does not  exist");

       const ispasswordCorrect = await user.isPasswordCorrect(password);
       
       if(!ispasswordCorrect) throw new ApiError(401,"Invalid user credentails");

       const {AcessToken,RefreshToken} = await generateAccessAndRefreshTokens(user._id);
       
       const loggedUser = await User.findById(user._id).select("-password -refreshToken");

       const options ={
            httpOnly:true, // cookies are only modified in backend
            secure:true
       }

       return res.status(200)
       .cookie("accessToken",AcessToken,options)
       .cookie("refreshToken",RefreshToken,options)
       .json(new ApiResponse(200,{loggedUser,RefreshToken},"user is logged In sucessfully")
       )
    })
    const loggedOutUser = asyncHandler(async (req,res)=>{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken :undefined
                }
            }
        )
        const options= {
            httpOnly : true,
            secure : true,
        }
        return res.
        status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,"user suceesssfully logged out"))
    })

    const refershAccessToken   = asyncHandler(async (req,res) =>{
        try {
            const incomingRefresh = req.cookies?.refreshToken || req.body?.refreshToken;
            if(!incomingRefresh) throw new ApiError(401,"unauthorized request");
    
            const decodedToken = jwt.verify(incomingRefresh,process.env.REFRESH_TOKEN_SECRET);
    
            const user = await User.findById(decodedToken)
    
            if(!user) throw new ApiError(401,"Invalid request Token");
    
            if(incomingRefresh !== user?.refreshToken) throw new ApiError(401 , "Refresh token is expired");
    
            const options  = {
                httpsOnly:true,
                secure: true,
            }
            
            const {AcessToken,RefreshToken}  = await generateAccessAndRefreshTokens(user._id);
            
            return res.status(200)
           .cookie("accessToken",AcessToken,options)
           .cookie("refreshToken",RefreshToken,options)
           .json(new ApiResponse(200,{loggedUser,RefreshToken},"Token is refershed succesfully")
           )
        } catch (error) {
            throw new ApiError(401,error?.message || "Invalid refresh token")
        }

    })

    const changePassword = asyncHandler(async (req,res)=>{
        const {oldpassword,newpassword,confPassword} = req.body;

        if(newpassword !== confPassword) throw new ApiError(401,"conform Password is not matched with new Password")
        const user = await User.findById(req.user?._id);

        if(!user) throw new ApiError(401,"user is not logged in")
        
        const isPasswordCorrect = await user.isPasswordCorrect(oldpassword)
        if(!isPasswordCorrect) throw new ApiError(401,"old password is not correct");

        user.password = newpassword;
        await user.save({validateBeforeSave:false});

        return res.status(200)
        .json(new ApiResponse(200,"PasswordChange successfully"));
    })

    const getcurrentUser = asyncHandler(async (req,res)=>{
        const user  = req.user;
        if(!user) throw  new ApiError(401,"no current user exist");

        const currentUser = User.findById(user._id);
        
        if(!currentUser) new ApiError(401,"no current user exist");

        return res.status(201)
        .json(new ApiResponse(201,currentUser,"Current User is fetched successfuly"));
    })

    const updateAccount = asyncHandler(async (req,res) =>{
            const {fullName,email}  = req.body;

            const user = req.user;

            if(!user) new ApiError(500,"something went wrong");

            const coverImage  = req.files?.coverImage[0].path;
            const avatar  = req.files?.avatar[0].path;

            const update = User.findByIdAndUpdate(
                user._id,
                {
                    $set:{
                        ...(fullName && { fullName }),
                        ...(email && { email }),
                        ...(coverImage && { coverImage }),
                        ...(avatar && { avatar }),
                    },
                },
                {new : true}
            )
            user.save();

            return res.status(201)
            .json(new ApiResponse(201,"Update Account Successfully"));
    })
export {registerUser,loginUser,loggedOutUser,refershAccessToken,changePassword,getcurrentUser,updateAccount};