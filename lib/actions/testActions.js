const log = require("../../helpers/logger");

module.exports.process =  async function run(msg, cfg, snapshot) {
    console.log('Incoming message is %s', JSON.stringify(msg));
    log.info('msg', JSON.stringify(msg));
    log.info('cfg', JSON.stringify(cfg));
    log.info('snapshot', JSON.stringify(snapshot));
    await this.emit('end');
    console.log('Execution finished');
};