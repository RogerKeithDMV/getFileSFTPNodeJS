let Client = require('ssh2-sftp-client');

async function SFTPServerConnection({host, port, username, password, path, file, key}){
  return new Promise(function(resolve, reject) {
    if(key){
    sftp
    .connect({host: host,
      port: port,
      username: username,
      privateKey: fs.readFileSync(key)
    })
    .then(() => {
      if(fileReq){
        return sftp.get(path + file);
      }
      else{
        return sftp.list(path);
      }
    })
    .then(resolve)  
    .then(() => sftp.end())
    .catch(reject)
  }
  else{
    sftp
    .connect({host: host,
      port: port,
      username: username,
      password: password
    })
    .then(() => {
      if(file){
        return sftp.get(pathReq + file);
      }
      else{
        return sftp.list(pathReq);
      }
    })
    .then(resolve)
    .then(() => sftp.end())
    .catch(reject)
  }
  });
}

module.exports={SFTPServerConnection}