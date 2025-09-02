/**
 * Dependency Injection module exports
 */

export { DIContainer, container, type IDIContainer, type ServiceLifetime } from './container';
export { SERVICE_TOKENS, type ServiceToken } from './tokens';
export {
  configureContainer,
  getService,
  isContainerReady,
  resetContainer
} from './containerConfig';