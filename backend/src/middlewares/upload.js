import multer from "multer";
import path from "path";

// Storage configuration for property images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.fieldname == "propertyImages") {
            cb(null, "uploads/propertyImages");
        } else if (file.fieldname == "propertyPapers") {
            cb(null, "uploads/propertyPapers");
        }
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    }
});

// Multer middleware to handle both images and PDFs
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 } // 10MB limit for all files
}).fields([
    { name: "propertyImages", maxCount: 5 }, // Expect up to 5 images
    { name: "propertyPapers", maxCount: 1 }  // Expect 1 PDF file
]);

export default upload;
