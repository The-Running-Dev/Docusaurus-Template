#!/usr/bin/env tsx
/**
 * Schema System Test
 *
 * Simple test to verify the new distributed schema system works correctly
 */

import { validateData, getRegisteredKeys, hasSchema } from '../src/schemas';

function testSchemaSystem() {
  console.log('🧪 Testing Schema System...\n');

  try {
    // 1. Check if schemas are registered
    const keys = getRegisteredKeys();
    console.log('📋 Registered Schemas:', keys);

    if (keys.length === 0) {
      console.log('❌ No Schemas Registered!');
      return;
    }

    // 2. Test individual schema availability
    const expectedSchemas = [
      'themes',
      'navbarLinks',
      'badgeConfig',
      'github',
      'version',
      'projects',
      'Features'
    ];
    expectedSchemas.forEach((key) => {
      const exists = hasSchema(key);
      console.log(
        `${exists ? '✅' : '❌'} Schema '${key}': ${exists ? 'Registered' : 'not found'}`
      );
    });

    // 3. Test validation with valid data
    console.log('\n🧪 Testing Validation with Valid Data...');

    const validThemeData = {
      defaultTheme: 'light',
      themes: [
        { name: 'light', displayName: 'Light Mode', cssFile: 'light.css' }
      ]
    };

    if (hasSchema('themes')) {
      const result = validateData('themes', validThemeData);
      console.log('✅ Theme Validation Passed:', result);
    }

    // 4. Test validation with invalid data
    console.log('\n🧪 Testing Validation with Invalid Data...');

    const invalidData = { invalidField: 'test' };

    try {
      validateData('themes', invalidData);
      console.log('❌ Should Have Failed Validation!');
    } catch (error) {
      console.log(
        '✅ Validation Correctly Failed:',
        (error as Error).message.substring(0, 100) + '...'
      );
    }

    // 5. Test unknown schema key
    console.log('\n🧪 Testing Unknown Schema Key...');

    try {
      const result = validateData('unknownSchema', { data: 'test' });
      console.log('⚠️  Unknown Schema Returned Data As-Is:', result);
    } catch (error) {
      console.log('❌ Unexpected Error:', error);
    }

    console.log('\n🎉 Schema System Test Completed Successfully!');
  } catch (error) {
    console.error('\n❌ Schema System Test Failed:');
    console.error(error instanceof Error ? error.message : String(error));

    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  (async () => {
    try {
      await testSchemaSystem();
    } catch (error) {
      console.error('Test Script Failed:', error);

      process.exit(1);
    }
  })();
}

export { testSchemaSystem };
