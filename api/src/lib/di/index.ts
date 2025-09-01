/**
 * Dependency Injection module exports
 */

export { DIContainer, container, type IDIContainer, type ServiceLifetime } from './container.js';
export { SERVICE_TOKENS, type ServiceToken } from './tokens.js';
export { 
  configureContainer, 
  getService, 
  isContainerReady, 
  resetContainer 
} from './containerConfig.js';