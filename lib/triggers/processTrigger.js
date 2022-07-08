let Client = require('ssh2-sftp-client');
const fs = require('fs');
let sftp = new Client();
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
            key
        } = cfg;

        let{data}=msg;
        let{file}=data;

        let _data;

        if(key){
          _data = await sftp
          .connect({host: host,
            port: port,
            username: username,
            privateKey: fs.readFileSync(key)
          })
          .then(() => {
            if(file){
              return sftp.get(path + file);
            }
            else{
              return sftp.list(path);
            }
          });
        }

        else{
          _data = await sftp
          .connect({host: host,
            port: port,
            username: username,
            password: password
          })
          .then(() => {
            if(file){
              return sftp.get(path + file);
            }
            else{
              return sftp.list(path);
            }
          });
        }

        sftp.end();

        if(file){
          const myBuffer = Buffer.from(_data, 'utf-8');
          const myBase64File = myBuffer.toString('base64');

          this.emit('data', {"file":file, "text":myBase64File});
          console.log("respuesta: ",data);
        }

        else{
          this.emit('data', {_data});
          console.log("respuesta: ",{_data});
        }

        this.emit('snapshot', snapshot);

        log.info('Finished api execution');
        this.emit('end');
    } catch (e) {
        log.error(`ERROR: ${e}`);
        this.emit('error', e);
        await rabbitmq.producerMessage(e);
    }
};
