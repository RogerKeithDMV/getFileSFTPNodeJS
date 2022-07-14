let Client = require('ssh2-sftp-client');
const fs = require('fs');
let sftp = new Client();
const log = require('../../helpers/logger');
const rabbitmq = require('../../helpers/rabbit');

const ERROR_PROPERTY = 'Error missing property';

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}){
    try {

        log.info("Inside processTrigger()");
        log.info("Msg=" + JSON.stringify(msg));
        log.info("Config=" + JSON.stringify(cfg));
        log.info("Snapshot=" + JSON.stringify(snapshot));

        let properties = {
            host: null, 
            port: null, 
            username: null, 
            password: null, 
            path: null, 
            key: null,
            file: null
        };

        let{data}=msg;

        if(!data){
          this.emit('', '${ERROR_PROPERTY} data');
          throw new Error('${ERROR_PROPERTY} data');
        }

        Object.keys(properties).forEach((value) => {

          if (data.hasOwnProperty(value)) {

              properties[value] = data[value];

          } else if (cfg.hasOwnProperty(value)) {

              properties[value] = cfg[value];

          } else {

              log.error(`${ERROR_PROPERTY} ${value}`);

              throw new Error(`${ERROR_PROPERTY} ${value}`);

          }

      });

        log.info("The file is: " + properties.file);

        if(properties.key){
          data = await sftp.connect({
            host:properties.host,
            port:properties.port,
            username:properties.username,
            privateKey:fs.readFileSync(properties.key)
          })
          .then(() => {
            if(properties.file){
              return sftp.get(properties.path + properties.file);
            }
            else{
              return sftp.list(properties.path);
            }
          });
        }

        else{
          data = await sftp.connect({
            host:properties.host,
            port:properties.port,
            username:properties.username,
            password:properties.password
          })
          .then(() => {
            if(properties.file){
              return sftp.get(properties.path + properties.file);
            }

            else{
              return sftp.list(properties.path);
            }
          });
        }

        if(properties.file){
          const myBuffer = Buffer.from(data, 'utf-8');
          const myBase64File = myBuffer.toString('base64');

          log.info("Archivo: " + properties.file);
          log.info("Nombre del archivo disponible: " + properties.file);

          this.emit('data', {data: {"file":properties.file, "text":myBase64File}});
          log.info("respuesta: ",myBase64File);
        }

        else{
          log.info("Archivo: " + properties.file);
          log.info("Nombre del archivo disponible: " + properties.file);

          this.emit('data', {data});
          log.info("respuesta: ",{data});
        }

        this.emit('snapshot', snapshot);

        log.info('Finished api execution');
        this.emit('end');
    } catch (e) {
        log.error(`ERROR: ${e}`);
        this.emit('error', e);
        await rabbitmq.producerMessage(e);
    }

    finally{
      //log.info("Entando a finally");
      sftp.end();
      //log.info("Termina finally");
    }
};
