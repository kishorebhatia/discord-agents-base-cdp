import { AtlasAgent } from './agents/atlas.js';
import { NovaAgent } from './agents/nova.js';
import dotenv from 'dotenv';
import createLogger from './utils/logger.js';

dotenv.config();

const systemLogger = createLogger('System');

async function startAgents() {
  try {
    systemLogger.info('Starting Discord agents...');
    
    const atlas = new AtlasAgent();
    const nova = new NovaAgent();

    atlas.client.once('ready', () => {
      systemLogger.info('Atlas is online', { username: atlas.client.user.tag });
    });

    nova.client.once('ready', () => {
      systemLogger.info('Nova is online', { username: nova.client.user.tag });
    });

    // Message handling with reward system
    atlas.client.on('messageCreate', async (message) => {
      try {
        if (message.mentions.has(atlas.client.user)) {
          atlas.logger.info('Message received', { 
            userId: message.author.id,
            content: message.content 
          });

          // Analyze message quality
          const quality = await atlas.analyzeMessageQuality(message.content);
          if (quality > 0.8) { // High-quality threshold
            const txHash = await atlas.rewardUser(message.author.id, "10000000000000000000");
            message.reply(`Thank you for your high-quality input! You've been rewarded with 10 ATLAS tokens. TX: ${txHash}`);
          }
        }
      } catch (error) {
        atlas.logger.error('Error processing message:', { error: error.message });
        message.reply('Sorry, I encountered an error processing your message.');
      }
    });

    nova.client.on('messageCreate', async (message) => {
      try {
        if (message.mentions.has(nova.client.user)) {
          nova.logger.info('Message received', { 
            userId: message.author.id,
            content: message.content 
          });

          const quality = await nova.analyzeMessageQuality(message.content);
          if (quality > 0.8) {
            const txHash = await nova.rewardUser(message.author.id, "10000000000000000000");
            message.reply(`Thanks for your creative input! You've been rewarded with 10 NOVA tokens. TX: ${txHash}`);
          }
        }
      } catch (error) {
        nova.logger.error('Error processing message:', { error: error.message });
        message.reply('Sorry, I encountered an error processing your message.');
      }
    });

    await Promise.all([
      atlas.client.login(process.env.ATLAS_TOKEN),
      nova.client.login(process.env.NOVA_TOKEN)
    ]);

  } catch (error) {
    systemLogger.error('Failed to start agents:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

startAgents();
