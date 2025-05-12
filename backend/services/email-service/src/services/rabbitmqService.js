import amqplib from 'amqplib';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import emailService from './emailService.js';

let connection = null;
let channel = null;

/**
 * Initialize RabbitMQ connection and set up channels
 */
export const initializeRabbitMQ = async () => {
  try {
    // Create connection
    connection = await amqplib.connect(config.rabbitmq.url);
    logger.info('Connected to RabbitMQ server');
    
    // Create error handler for connection
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      setTimeout(reconnect, 5000);
    });
    
    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed');
      setTimeout(reconnect, 5000);
    });
    
    // Create channel
    channel = await connection.createChannel();
    
    // Configure exchange
    await channel.assertExchange(config.rabbitmq.exchange, 'direct', { durable: true });
    
    // Create main queue
    await channel.assertQueue(config.rabbitmq.queues.emailQueue, { 
      durable: true,
      arguments: {
        'x-dead-letter-exchange': config.rabbitmq.exchange,
        'x-dead-letter-routing-key': config.rabbitmq.queues.deadLetterQueue
      }
    });
    
    // Create dead letter queue
    await channel.assertQueue(config.rabbitmq.queues.deadLetterQueue, { 
      durable: true 
    });
    
    // Bind queues to exchange
    await channel.bindQueue(config.rabbitmq.queues.emailQueue, config.rabbitmq.exchange, 'email');
    await channel.bindQueue(config.rabbitmq.queues.deadLetterQueue, config.rabbitmq.exchange, config.rabbitmq.queues.deadLetterQueue);
    
    // Start consuming messages
    await consumeMessages();
    
    logger.info('RabbitMQ initialization completed');
    return { connection, channel };
  } catch (error) {
    logger.error('Failed to initialize RabbitMQ:', error);
    setTimeout(reconnect, 5000);
    throw error;
  }
};

/**
 * Reconnect to RabbitMQ in case of error
 */
const reconnect = async () => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  } catch (error) {
    logger.error('Error during RabbitMQ cleanup:', error);
  }
  
  try {
    await initializeRabbitMQ();
    logger.info('Successfully reconnected to RabbitMQ');
  } catch (error) {
    logger.error('Failed to reconnect to RabbitMQ:', error);
    setTimeout(reconnect, 5000);
  }
};

/**
 * Publish message to queue
 * 
 * @param {Object} message Message to publish
 * @returns {Promise<boolean>} Success status
 */
export const publishToQueue = async (message) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  
  try {
    const success = channel.publish(
      config.rabbitmq.exchange,
      'email',
      Buffer.from(JSON.stringify({
        ...message,
        timestamp: Date.now(),
        attempts: 0
      })),
      { persistent: true }
    );
    
    if (success) {
      logger.info(`Message published to queue: ${message.type}`);
    } else {
      logger.error('Failed to publish message to queue');
    }
    
    return success;
  } catch (error) {
    logger.error('Error publishing message to queue:', error);
    throw error;
  }
};

/**
 * Start consuming messages from the queue
 */
const consumeMessages = async () => {
  try {
    channel.prefetch(1);
    
    await channel.consume(config.rabbitmq.queues.emailQueue, async (msg) => {
      if (!msg) return;
      
      try {
        const content = JSON.parse(msg.content.toString());
        logger.info(`Processing email message: ${content.type}`, { messageId: msg.properties.messageId });
        
        // Process message based on type
        await processEmailMessage(content);
        
        // Acknowledge message
        channel.ack(msg);
        logger.info(`Successfully processed message: ${content.type}`);
      } catch (error) {
        const content = JSON.parse(msg.content.toString());
        const attempts = content.attempts || 0;
        
        if (attempts < config.rabbitmq.retryAttempts) {
          // Retry logic - requeue with increased attempt count
          logger.warn(`Retrying message (attempt ${attempts + 1}/${config.rabbitmq.retryAttempts}):`, error);
          
          // Nack without requeue
          channel.nack(msg, false, false);
          
          // Publish back to queue with increased attempt count after delay
          setTimeout(() => {
            channel.publish(
              config.rabbitmq.exchange,
              'email',
              Buffer.from(JSON.stringify({
                ...content,
                attempts: attempts + 1
              })),
              { persistent: true }
            );
          }, config.rabbitmq.retryDelay);
        } else {
          // Move to dead letter queue after max retries
          logger.error(`Max retries reached for message, moving to dead letter queue:`, error);
          channel.nack(msg, false, false);
        }
      }
    });
    
    logger.info(`Consuming messages from queue: ${config.rabbitmq.queues.emailQueue}`);
    
    // Also consume from dead letter queue for logging purposes
    await channel.consume(config.rabbitmq.queues.deadLetterQueue, (msg) => {
      if (!msg) return;
      
      try {
        const content = JSON.parse(msg.content.toString());
        logger.error(`Dead letter message received: ${content.type}`, { 
          messageData: content,
          messageId: msg.properties.messageId
        });
        
        // Acknowledge the dead letter message
        channel.ack(msg);
      } catch (error) {
        logger.error('Error processing dead letter message:', error);
        channel.nack(msg, false, false);
      }
    });
    
  } catch (error) {
    logger.error('Error setting up message consumer:', error);
    throw error;
  }
};

/**
 * Process email message based on type
 * 
 * @param {Object} message The email message to process
 */
const processEmailMessage = async (message) => {
  const { type, data } = message;
  
  switch (type) {
    case 'password-reset':
      const { email, resetLink, username } = data;
      await emailService.sendPasswordResetEmail(email, resetLink, username);
      break;
      
    case 'payment-confirmation':
      const { email: paymentEmail, username: paymentUsername, courseName, amount, transactionId, date } = data;
      await emailService.sendPaymentConfirmationEmail(
        paymentEmail,
        paymentUsername,
        courseName,
        amount,
        transactionId,
        date
      );
      break;
      
    case 'enrollment-confirmation':
      const { email: enrollEmail, username: enrollUsername, courseName: enrollCourseName, startDate, courseLink } = data;
      await emailService.sendEnrollmentConfirmationEmail(
        enrollEmail,
        enrollUsername,
        enrollCourseName,
        startDate,
        courseLink
      );
      break;
      
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};

// Handle process events for graceful shutdown
process.once('SIGINT', async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    logger.info('RabbitMQ connection closed due to SIGINT');
  } catch (error) {
    logger.error('Error during RabbitMQ shutdown:', error);
  }
});

process.once('SIGTERM', async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    logger.info('RabbitMQ connection closed due to SIGTERM');
  } catch (error) {
    logger.error('Error during RabbitMQ shutdown:', error);
  }
});
