const amqp = require('amqplib');

const producerMessage = async (message) => {

    const exchangeDLX = 'exchangeDLX';
    // const routingKeyDLX = 'routingKeyDLX';
    const queueDLX = 'queueDLX';

    let connection = await amqp.connect('amqp://localhost:5672');

    const ch = await connection.createChannel();

    await ch.assertExchange(exchangeDLX, 'direct', {durable: true});

    const queue = await ch.assertQueue(queueDLX, {
        exclusive: false
    });

    await ch.bindQueue(queue.queue, exchangeDLX);

    await ch.sendToQueue(queue.queue, new Buffer.from(message.toString()));

    await ch.close();

};

module.exports = {
    producerMessage
};
