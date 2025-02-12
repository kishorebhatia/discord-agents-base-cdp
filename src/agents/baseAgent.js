import { Client, GatewayIntentBits } from 'discord.js';
import { CoinbaseWallet } from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';
import createLogger from '../utils/logger.js';

export class BaseAgent {
  constructor(config) {
    this.character = config;
    this.logger = createLogger(config.name);
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });
    this.setupWallet();
    this.setupErrorHandlers();
  }

  setupErrorHandlers() {
    this.client.on('error', error => {
      this.logger.error('Discord client error:', { error: error.message, stack: error.stack });
    });

    this.client.on('warn', warning => {
      this.logger.warn('Discord client warning:', { warning });
    });

    process.on('unhandledRejection', error => {
      this.logger.error('Unhandled promise rejection:', { error: error.message, stack: error.stack });
    });
  }

  async setupWallet() {
    try {
      const wallet = new CoinbaseWallet({
        appName: `${this.character.name} Agent`,
        defaultChainId: 8453
      });
      this.wallet = wallet;
      this.logger.info('Wallet setup completed', { address: await wallet.getAddress() });
    } catch (error) {
      this.logger.error('Wallet setup failed:', { error: error.message });
      throw error;
    }
  }

  async rewardUser(userId, amount) {
    try {
      const tokenContract = new ethers.Contract(
        this.tokenAddress,
        this.tokenAbi,
        this.wallet
      );
      
      const tx = await tokenContract.transfer(userId, amount);
      await tx.wait();
      
      this.logger.info('Reward sent successfully', { userId, amount, txHash: tx.hash });
      return tx.hash;
    } catch (error) {
      this.logger.error('Reward transfer failed:', { error: error.message });
      throw error;
    }
  }
}
