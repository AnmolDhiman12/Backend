import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnChoudinary = async (localFilePath) =>{
    try {
        if(!localFilePath){
            console.error("Path could not find");
            process.exit(1);
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file uploaded successfully
        console.log(`File is  uploaded  succesfully ${response}`);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally temp saved file
        console.error("File  uploaded failed ",error);
    }
}

export {uploadOnChoudinary};