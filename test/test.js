let Client = require('ssh2-sftp-client');
const express = require('express');
const { request } = require('express');
const rabbitmq = require('../helpers/rabbit');
const fs = require('fs');

let sftp = new Client();
const app = express();
app.use(express.json());

var hostReq="";
var portReq="";
var usernameReq="";
var passwordReq="";
var pathReq="";
var fileReq="";
var boolFile=false;
var keyReq=""

app.post('/', async(req, res)=>{
  hostReq=req.body.host;
  portReq=req.body.port;
  usernameReq=req.body.username;
  passwordReq=req.body.password;
  pathReq=req.body.path;
  fileReq=req.body.file;
  nameNewFileReq=req.body.nameNewFile;
  base64Req=req.body.base64;
  keyReq=req.body.key;

  try{
    const result = await SFTPServerConnection();
    console.log("respuesta: "+result);

    if(boolFile){
        const myFile=result;
        const myBuffer = Buffer.from(myFile, "utf-8");
        const myBase64File = myBuffer.toString('base64');

        //await rabbitmq.producerMessage(myBase64File);
      res.json({filename:fileReq, text:myBase64File});
    }

    else{
      //await rabbitmq.producerMessage(result);
      res.json(result);
    }
  }

  catch(err){
    res.status(500).json(err);
  }
})

app.listen(3000, ()=>{
  console.log("Server ejecutandose en el puerto 3000");
});

async function SFTPServerConnection(){
  return new Promise(function(resolve, reject) {
    if(keyReq){
    sftp
    .connect({host: hostReq,
      port: portReq,
      username: usernameReq,
      privateKey: fs.readFileSync(keyReq)
    })
    .then(() => {
      if(fileReq){
        boolFile=true;
        return sftp.get(pathReq + fileReq);
      }
      else{
        boolFile=false;
        return sftp.list(pathReq);
      }
    })
    .then(resolve)  
    .then(() => sftp.end())
    .catch(reject)
  }
  else{
    console.log("Usa Pass");
    sftp
    .connect({host: hostReq,
      port: portReq,
      username: usernameReq,
      password: passwordReq
    })
    .then(() => {
      if(fileReq){
        boolFile=true;
        return sftp.get(pathReq + fileReq);
      }
      else{
        boolFile=false;
        return sftp.list(pathReq);
      }
    })
    .then(resolve)
    .then(() => sftp.end())
    .catch(reject)
  }
  });
}