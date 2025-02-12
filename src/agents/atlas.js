import { BaseAgent } from './baseAgent.js';
import atlasConfig from '../config/atlas.character.json';

export class AtlasAgent extends BaseAgent {
  constructor() {
    super(atlasConfig);
  }

  async analyze(content) {
    return `[Atlas] Analyzing from a strategic perspective: ${content}`;
  }

  // Implement other specialized methods
}
