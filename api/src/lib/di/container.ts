/**
 * Lightweight Dependency Injection Container
 * Supports singleton and transient lifetimes with type safety
 */

export type ServiceLifetime = 'singleton' | 'transient';

export interface ServiceRegistration<T = any> {
  factory: () => T;
  lifetime: ServiceLifetime;
  instance?: T;
}

export interface IDIContainer {
  register<T>(token: string, factory: () => T, lifetime?: ServiceLifetime): void;
  registerInstance<T>(token: string, instance: T): void;
  resolve<T>(token: string): T;
  isRegistered(token: string): boolean;
}

export class DIContainer implements IDIContainer {
  private services = new Map<string, ServiceRegistration>();

  /**
   * Register a service with a factory function
   */
  register<T>(
    token: string, 
    factory: () => T, 
    lifetime: ServiceLifetime = 'singleton'
  ): void {
    if (this.services.has(token)) {
      throw new Error(`Service '${token}' is already registered`);
    }

    this.services.set(token, {
      factory,
      lifetime,
      instance: undefined
    });
  }

  /**
   * Register a pre-created instance (always singleton)
   */
  registerInstance<T>(token: string, instance: T): void {
    if (this.services.has(token)) {
      throw new Error(`Service '${token}' is already registered`);
    }

    this.services.set(token, {
      factory: () => instance,
      lifetime: 'singleton',
      instance
    });
  }

  /**
   * Resolve a service by token
   */
  resolve<T>(token: string): T {
    const registration = this.services.get(token);
    
    if (!registration) {
      throw new Error(`Service '${token}' is not registered`);
    }

    // Return singleton instance if available
    if (registration.lifetime === 'singleton' && registration.instance) {
      return registration.instance as T;
    }

    // Create new instance
    const instance = registration.factory() as T;

    // Store singleton instance for future use
    if (registration.lifetime === 'singleton') {
      registration.instance = instance;
    }

    return instance;
  }

  /**
   * Check if a service is registered
   */
  isRegistered(token: string): boolean {
    return this.services.has(token);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Get all registered service tokens
   */
  getRegisteredTokens(): string[] {
    return Array.from(this.services.keys());
  }
}

// Global container instance
export const container = new DIContainer();