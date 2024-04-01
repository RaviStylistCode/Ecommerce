import multer from "multer";
import {v4 as uuid} from "uuid"
// import path from "path";

const storage= multer.diskStorage({
    destination(req,file,callback){
        // callback(null,path.join(__dirname,'uploads'))
        callback(null,'uploads')
    },
    filename(req,file,callback){
        const id=uuid();
        callback(null,id+file.originalname)
    }
});

const fileupload=multer({storage}).single('photo')

export default fileupload;