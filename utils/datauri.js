import DataUri from "datauri/parser.js";
import path from "path";

const getdaturi=(file)=>{

    const parser=new DataUri();
    const extName=path.extname(file.originalname).toString();
    // console.log(extName);
    return parser.format(extName,file.buffer)
}

export default getdaturi;