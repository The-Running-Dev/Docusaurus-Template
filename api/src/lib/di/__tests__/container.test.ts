import { DIContainer } from '../container';

describe('DIContainer', () => {
  let container: DIContainer;

  beforeEach(() => {
    container = new DIContainer();
  });

  describe('register and resolve', () => {
    test('should register and resolve singleton service', () => {
      let instanceCount = 0;
      const factory = () => ({ id: ++instanceCount });

      container.register('test-service', factory, 'singleton');

      const instance1 = container.resolve<{ id: number }>('test-service');
      const instance2 = container.resolve<{ id: number }>('test-service');

      expect(instance1).toBe(instance2);
      expect(instance1.id).toBe(1);
    });

    test('should register and resolve transient service', () => {
      let instanceCount = 0;
      const factory = () => ({ id: ++instanceCount });

      container.register('test-service', factory, 'transient');

      const instance1 = container.resolve<{ id: number }>('test-service');
      const instance2 = container.resolve<{ id: number }>('test-service');

      expect(instance1).not.toBe(instance2);
      expect(instance1.id).toBe(1);
      expect(instance2.id).toBe(2);
    });

    test('should default to singleton lifetime', () => {
      let instanceCount = 0;
      const factory = () => ({ id: ++instanceCount });

      container.register('test-service', factory);

      const instance1 = container.resolve('test-service');
      const instance2 = container.resolve('test-service');

      expect(instance1).toBe(instance2);
    });
  });

  describe('registerInstance', () => {
    test('should register pre-created instance', () => {
      const instance = { id: 1 };
      container.registerInstance('test-service', instance);

      const resolved = container.resolve('test-service');
      expect(resolved).toBe(instance);
    });
  });

  describe('error handling', () => {
    test('should throw when registering duplicate service', () => {
      container.register('test-service', () => ({}));

      expect(() => {
        container.register('test-service', () => ({}));
      }).toThrow("Service 'test-service' is already registered");
    });

    test('should throw when resolving unregistered service', () => {
      expect(() => {
        container.resolve('unknown-service');
      }).toThrow("Service 'unknown-service' is not registered");
    });
  });

  describe('utility methods', () => {
    test('should check if service is registered', () => {
      expect(container.isRegistered('test-service')).toBe(false);

      container.register('test-service', () => ({}));

      expect(container.isRegistered('test-service')).toBe(true);
    });

    test('should return registered tokens', () => {
      container.register('service1', () => ({}));
      container.register('service2', () => ({}));

      const tokens = container.getRegisteredTokens();
      expect(tokens).toContain('service1');
      expect(tokens).toContain('service2');
      expect(tokens).toHaveLength(2);
    });

    test('should clear all registrations', () => {
      container.register('service1', () => ({}));
      container.register('service2', () => ({}));

      container.clear();

      expect(container.getRegisteredTokens()).toHaveLength(0);
      expect(container.isRegistered('service1')).toBe(false);
    });
  });
});