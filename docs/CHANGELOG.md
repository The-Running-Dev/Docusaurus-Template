# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-16

### 🆕 New Features

- **404 Error Page**: Custom animated 404 page with interactive excuse generator, cat facts spinner, and emergency navigation
- **Related Resources Component**: Reusable component for contextual navigation with configurable button types and external link safety
- **Demo Pages**: Comprehensive interactive demos for all major components (GitHub Links, Portfolio, Projects, Reader Mode, etc.)
- **Schema System Demo**: Interactive schema validation testing with live examples and error handling
- **Focus Management**: Theme switcher dropdown now properly closes when focus leaves the component
- **Component Documentation**: Complete markdown documentation for 404 page and Related Resources component
- **NavBarLinks Position Default**: NavBarLinks now default to `position: 'left'` when not specified, with `withDefaultPosition` utility function

### � Bug Fixes

- **Theme Switcher Focus**: Fixed dropdown not hiding when component loses focus - added onBlur event handler with proper focus detection
- **Theme Initialization**: Enhanced theme initialization with feature flag integration for better conditional loading
- **Documentation Links**: Updated all demo navigation to properly link to live component pages

### 🎨 Enhancements

- **Demo Navigation**: Consolidated demo system with proper links to live component instances
- **Interactive Examples**: All demos now reference actual working components with real data
- **User Experience**: Improved focus management and accessibility across theme switching interface
- **NavBarLinks Default Behavior**: Enhanced type safety and usability with automatic position defaulting and utility functions

### � Documentation Updates

- **404 Error Page Documentation**: Complete technical guide covering animations, interactivity, and customization options
- **Related Resources Documentation**: Comprehensive usage examples and TypeScript interface documentation
- **Demo Integration**: Updated navigation system to properly showcase live components vs demo pages

## [1.0.0] - 2025-08-15

### 🚨 BREAKING CHANGES

- **Configuration System**: Replaced TypeScript configuration classes with YAML-based system
- **Schema Validation**: All configuration now requires Zod schema validation
- **Component Architecture**: Components now use data-driven patterns with YAML configuration

### ✨ Added

- **Portfolio Component**: Professional project showcase with filtering and categorization (`/portfolio`)
- **Projects Component**: Advanced project listing with search, URL state management (`/projects`)
- **CV Component**: Professional timeline display with configurable experience data (`/cv`)
- **Schema System**: Unified Zod-based validation for all YAML configuration files
- **Component System**: Data-driven architecture with feature flag integration
- **YAML Configuration**: User-friendly configuration files with automatic validation
- **Live Component Pages**: Interactive components with real data at `/portfolio`, `/projects`, `/cv`
- **Demo System**: Comprehensive demo pages with live component references at `/demos/`

### 🔧 Fixed

- **Theme Compatibility**: Theme switcher now works correctly on all routes
- **Demo Architecture**: Demo pages now reference live components instead of embedding duplicates
- **Configuration Loading**: Automatic YAML loading with schema validation and error handling

### 🔄 Changed

- **Configuration Files**: From TypeScript classes to YAML files in `config/` directory
- **Component Data Loading**: From static imports to validated YAML data loading
- **Demo Structure**: Demo pages now showcase live components with clear navigation
- **Documentation**: Updated all documentation to reflect YAML-based configuration system

### 🗑️ Removed

- **TypeScript Config Classes**: Replaced with YAML files and schema validation
- **Inline Configuration**: All configuration now centralized in `config/` directory
- **Migration Guides**: Removed outdated migration documentation

### 🏗️ Technical Improvements

- **Component Architecture**: ThemeSwitcher now uses `useBaseUrl` for proper path resolution
- **Performance**: Pre-computed theme URLs for better rendering performance
- **Type Safety**: Enhanced TypeScript interfaces with proper entity separation
- **Code Organization**: Cleaner separation between configuration and runtime logic

### 📚 Documentation

- **Updated Theme System Docs**: Comprehensive v1.0 feature documentation
- **Migration Guide**: Step-by-step upgrade instructions from v0.x
- **API Reference**: Updated component interfaces and configuration options
- **Examples**: New examples showcasing v1.0 capabilities

### 🔧 Developer Experience

- **Better Debugging**: Clear error messages and fallback behaviors
- **Simplified Setup**: Automatic theme detection reduces manual configuration
- **Improved Tooling**: Enhanced pre-build process with better feedback

## [Unreleased] - 2025-08-06

### Added

- **ESLint Configuration**: Modern ESLint v9 with flat config format and TypeScript support
- **Code Quality Gates**: Comprehensive formatting and linting validation in CI/CD
- **Developer Scripts**: New quality assurance commands (`lint`, `format`, `check-all`)
- **Artifacts Build**: Configurable output directory for production builds (now uses `./artifacts`)

### Changed

- **Build Process**: Production builds now output to `./artifacts` directory via `build:prod` script
- **Code Formatting**: Enhanced code consistency with Prettier integration and automated formatting
- **TypeScript Configuration**: Improved type safety and error resolution for Docusaurus runtime
- **Component Architecture**: Consolidated configuration approach using static TypeScript classes

### Improved

- **Theme System**: Enhanced theme loading and management with better error handling
- **Badge Configuration**: More robust badge templating and variable resolution
- **Pre-Build Process**: Improved content preparation with better error reporting
- **Component Integration**: Streamlined component registration and navbar integration

### Technical Enhancements

- **ESLint Rules**: Configured for TypeScript with relaxed strictness for better Docusaurus compatibility
- **Code Style**: Consistent formatting across all TypeScript and React components
- **Build Pipeline**: Automated pre-build step integration with theme and content generation
- **Type Safety**: Enhanced TypeScript interfaces and configuration validation

### Documentation

- **API Reference**: Updated component interfaces and configuration options
- **Examples**: Refreshed code examples with current syntax and best practices
- **Migration Guide**: Added guidance for upgrading from previous template versions
- **Development Workflow**: Enhanced developer experience documentation

### Breaking Changes

None in this release. All changes are backward compatible.

### Fixed

- **Theme Loading**: Resolved theme switching edge cases and improved persistence
- **Component Registration**: Fixed navbar component registration and type safety
- **Build Process**: Enhanced reliability of pre-build content generation
- **Configuration**: Improved validation and error handling in static config classes
