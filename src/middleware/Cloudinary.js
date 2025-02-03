import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOIDINARY_CLOUD_NAME,
    api_key: process.env.CLOIDINARY_API_NAME,
    api_secret: process.env.CLOIDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // console.log(response);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("There is something error in Upload on Cloudinary--->", error)
        return null;
    }
}

export default uploadOnCloudinary;