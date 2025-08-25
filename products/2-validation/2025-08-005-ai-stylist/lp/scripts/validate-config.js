#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'configs', 'config.json');

function validateConfig() {
  try {
    // Check if config file exists
    if (!fs.existsSync(configPath)) {
      console.error('❌ Config file not found: configs/config.json');
      console.log('💡 Create one by copying from configs/authentic-life-ai.json');
      process.exit(1);
    }

    // Read and parse JSON
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);

    // Basic structure validation
    const requiredSections = ['meta', 'theme', 'content', 'assets'];
    const missingSections = requiredSections.filter(section => !config[section]);

    if (missingSections.length > 0) {
      console.error(`❌ Missing required sections: ${missingSections.join(', ')}`);
      process.exit(1);
    }

    // Validate theme colors
    if (!config.theme.colors || !config.theme.colors.primary) {
      console.error('❌ Missing required theme colors');
      process.exit(1);
    }

    // Validate content sections
    if (!config.content.hero || !config.content.hero.title) {
      console.error('❌ Missing required hero section');
      process.exit(1);
    }

    console.log('✅ Config validation passed!');
    console.log(`📄 Title: ${config.meta.title}`);
    console.log(`🎨 Primary color: ${config.theme.colors.primary}`);
    console.log(`📝 Hero title: ${config.content.hero.title}`);

  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('❌ Invalid JSON syntax in config.json');
      console.log('💡 Use a JSON validator online or in your code editor');
      console.log(`📍 Error: ${error.message}`);
    } else {
      console.error('❌ Error validating config:', error.message);
    }
    process.exit(1);
  }
}

validateConfig();