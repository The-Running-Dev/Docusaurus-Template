#!/usr/bin/env tsx
/**
 * Build-time validation script for GitHub Configuration System
 *
 * This script validates the GitHub configuration and demonstrates
 * various usage patterns during the build process.
 */

import {
  getGitHubConfig,
  getRepositoryInfo,
  getGitHubUrls,
  getProjectMetadata,
  getRepositoryUrl,
  getApiUrl
} from '../src/config/GitHubConfig/configLoader';
import {
  validateGitHubUrls,
  assertValidGitHubConfig
} from '../src/config/GitHubConfig/validation';

async function validateConfiguration() {
  console.log('🔍 Validating GitHub Configuration System...\n');

  try {
    // 1. Load and validate configuration
    const config = getGitHubConfig();
    assertValidGitHubConfig(config);
    console.log('✅ Configuration Structure is Valid');

    // 2. Display configuration summary
    const { repo, organization, project } = getRepositoryInfo();
    const { license, description, topics, defaultBranch } =
      getProjectMetadata();

    console.log('\n📋 Configuration Summary:');
    console.log(`   Repository: ${repo}`);
    console.log(`   Organization: ${organization}`);
    console.log(`   Project: ${project}`);
    console.log(`   License: ${license}`);
    console.log(`   Default Branch: ${defaultBranch}`);
    console.log(`   Topics: ${topics.join(', ')}`);
    console.log(`   Description: ${description}`);

    // 3. Validate URLs
    console.log('\n🔗 Validating URLs...');
    const urlValidation = await validateGitHubUrls(config);

    if (urlValidation.invalid.length > 0) {
      console.log('❌ Invalid URLs Found:');

      urlValidation.invalid.forEach((invalid) =>
        console.log(`   - ${invalid}`)
      );

      process.exit(1);
    }

    console.log(`✅ All ${urlValidation.valid.length} URLs are Valid`);

    // 4. Test URL utilities
    console.log('\n🛠️  Testing URL Utilities...');
    const { repository, issues, api } = getGitHubUrls();
    const readmeUrl = getRepositoryUrl(`/blob/${defaultBranch}/README.md`);
    const contributorsApi = getApiUrl('/contributors');

    console.log(`   Repository: ${repository}`);
    console.log(`   Issues: ${issues}`);
    console.log(`   API: ${api}`);
    console.log(`   README: ${readmeUrl}`);
    console.log(`   Contributors API: ${contributorsApi}`);

    // 5. Test immutability
    console.log('\n🔒 Testing Immutability...');
    const immutabilityTests = [
      () => Object.isFrozen(config),
      () => Object.isFrozen(config.urls),
      () => Object.isFrozen(config.metadata),
      () => Object.isFrozen(config.metadata.topics)
    ];

    const immutableResults = immutabilityTests.map((test) => test());
    if (immutableResults.every(Boolean)) {
      console.log('✅ Configuration is Properly Immutable');
    } else {
      console.log('❌ Configuration Immutability Test Failed');

      process.exit(1);
    }

    // 6. Generate build info
    console.log('\n📊 Build Information:');
    console.log(`   Build Time: ${new Date().toISOString()}`);
    console.log(`   Configuration Version: 1.0.0`);
    console.log(`   Node Version: ${process.version}`);

    // 7. Generate environment variables for CI/CD
    console.log('\n🌍 Environment Variables for CI/CD:');
    console.log(`export GITHUB_REPOSITORY="${repo}"`);
    console.log(`export GITHUB_OWNER="${organization}"`);
    console.log(`export GITHUB_PROJECT="${project}"`);
    console.log(`export GITHUB_DEFAULT_BRANCH="${defaultBranch}"`);
    console.log(`export PROJECT_LICENSE="${license}"`);
    console.log(`export PROJECT_DESCRIPTION="${description}"`);

    console.log(
      '\n🎉 GitHub Configuration System validation completed successfully!'
    );
  } catch (error) {
    console.error('\n❌ Configuration Validation Failed:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateConfiguration().catch((error) => {
    console.error('Validation Script Failed:', error);
    process.exit(1);
  });
}

export { validateConfiguration };
