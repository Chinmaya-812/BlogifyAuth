import multer from "multer";


const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.random() * 1e9;
        cb(null, file.originalname + '-' + uniqueSuffix);
        // console.log("File :- ",file);

    }
})

export const upload = multer({ storage: storage });