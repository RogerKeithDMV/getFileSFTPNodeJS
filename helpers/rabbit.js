require('dotenv').config();
const amqp = require('amqplib');
const log = require('./logger');

module.exports.producerMessage = async (message) => {

    try{
        const exchangeDLX = 'exchangeDLX';
        const queueDLX = 'queueDLX';

        let connection = await amqp.connect(process.env.URI_RABBITMQ);

        const ch = await connection.createChannel();

        await ch.assertExchange(exchangeDLX, 'direct', {durable: true});

        const queue = await ch.assertQueue(queueDLX, {
            exclusive: false
        });

        await ch.bindQueue(queue.queue, exchangeDLX);

        await ch.sendToQueue(queue.queue, new Buffer.from(message.toString()));

        await ch.close();
    }catch (e){
        log.error(`ERROR on rabbit: ${e}`);
    }
};
