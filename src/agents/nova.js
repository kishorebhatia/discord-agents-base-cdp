import { BaseAgent } from './baseAgent.js';
import novaConfig from '../config/nova.character.json';

export class NovaAgent extends BaseAgent {
  constructor() {
    super(novaConfig);
  }

  async analyze(content) {
    return `[Nova] Creative analysis: ${content}`;
  }

  // Implement other specialized methods
}
