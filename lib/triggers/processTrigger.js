const axios = require("axios").default;
const log = require('../../helpers/logger');
const rabbitmq = require('../../helpers/rabbit');

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}){
    try {

        log.info("Inside processTrigger()");
        log.info("Config=" + JSON.stringify(cfg));

        let {
            host, 
            port, 
            username, 
            password, 
            path, 
            file
        } = cfg;

        let {data} = await new Promise(function(resolve, reject) {
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
        
              
        this.emit('data', {data});
        console.log("respuesta: ",data);
        this.emit('snapshot', snapshot);

        log.info('Finished api execution');
        this.emit('end');
    } catch (e) {
        log.error(`ERROR: ${e}`);
        this.emit('error', e);
        await rabbitmq.producerMessage(e);
    }
};