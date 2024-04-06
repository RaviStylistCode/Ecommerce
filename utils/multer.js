import multer from "multer";
// import {v4 as uuid} from "uuid"


// const storage= multer.diskStorage({
//     destination(req,file,callback){
//         callback(null,"./uploads/")
//     },
//     filename(req,file,callback){
//         const id=uuid();
//         callback(null,id+file.originalname)
//     }
// });

const storage=multer.memoryStorage();

const fileupload=multer({storage}).single('photo');

export default fileupload;