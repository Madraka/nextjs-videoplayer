# 🔒 File Schema Validation System

## 📋 Automated Validation Rules

This system ensures strict compliance with our file schema and naming conventions.

### **Validation Script** (`scripts/validate-schema.js`)

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Forbidden patterns
const FORBIDDEN_PATTERNS = [
  /v\d+/,           // version numbers (v1, v2, etc.)
  /new|old/i,       // new/old suffixes
  /legacy|temp/i,   // legacy/temp patterns
  /backup|draft/i,  // backup/draft patterns
  /alpha|beta/i,    // alpha/beta patterns
  /experimental/i   // experimental patterns
];

// Required patterns for different file types
const NAMING_PATTERNS = {
  components: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.tsx$/,
  hooks: /^use-[a-z][a-z0-9]*(-[a-z0-9]+)*\.ts$/,
  utilities: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.ts$/,
  types: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.ts$/,
  contexts: /^[a-z][a-z0-9]*(-[a-z0-9]+)*-context\.tsx$/
};

// Directory structure validation
const REQUIRED_DIRECTORIES = [
  'src/types',
  'src/core',
  'src/plugins',
  'src/components/ui',
  'src/components/player',
  'src/components/controls',
  'src/components/overlays',
  'src/hooks',
  'src/contexts',
  'src/utilities',
  'src/constants',
  'src/presets',
  'src/schemas'
];

// Allowed file locations
const DIRECTORY_RULES = {
  'use-*.ts': ['src/hooks'],
  '*-context.tsx': ['src/contexts'],
  'components': ['src/components/**'],
  'types': ['src/types'],
  'utilities': ['src/utilities'],
  'constants': ['src/constants']
};

class SchemaValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateFileNaming(filePath) {
    const fileName = path.basename(filePath);
    const directory = path.dirname(filePath);
    
    // Check for forbidden patterns
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(fileName)) {
        this.errors.push(`Forbidden pattern in file: ${filePath}`);
        return false;
      }
    }

    // Check naming conventions based on file type
    if (filePath.includes('/hooks/') && fileName.startsWith('use-')) {
      if (!NAMING_PATTERNS.hooks.test(fileName)) {
        this.errors.push(`Invalid hook naming: ${filePath}`);
        return false;
      }
    }

    if (filePath.includes('/components/') && fileName.endsWith('.tsx')) {
      if (!NAMING_PATTERNS.components.test(fileName)) {
        this.errors.push(`Invalid component naming: ${filePath}`);
        return false;
      }
    }

    if (fileName.endsWith('-context.tsx')) {
      if (!NAMING_PATTERNS.contexts.test(fileName)) {
        this.errors.push(`Invalid context naming: ${filePath}`);
        return false;
      }
    }

    return true;
  }

  validateDirectoryStructure() {
    for (const dir of REQUIRED_DIRECTORIES) {
      if (!fs.existsSync(dir)) {
        this.errors.push(`Missing required directory: ${dir}`);
      }
    }
  }

  validateImportStructure(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for forbidden import patterns
      const forbiddenImports = [
        /from ['"].*v\d+.*['"]/,
        /from ['"].*-new.*['"]/,
        /from ['"].*-old.*['"]/,
        /from ['"].*legacy.*['"]/
      ];

      for (const pattern of forbiddenImports) {
        if (pattern.test(content)) {
          this.errors.push(`Forbidden import pattern in: ${filePath}`);
        }
      }

      // Check for default exports (prefer named exports)
      if (/export\s+default\s+/.test(content) && !filePath.includes('page.tsx')) {
        this.warnings.push(`Consider using named exports instead of default in: ${filePath}`);
      }

    } catch (error) {
      this.warnings.push(`Could not read file for import validation: ${filePath}`);
    }
  }

  validateTypeScriptCompliance(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;

    try {
      // Check if file has proper TypeScript types
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for any types
      const hasAnyType = /:\s*any\b/.test(content);
      if (hasAnyType) {
        this.warnings.push(`Usage of 'any' type found in: ${filePath}`);
      }

    } catch (error) {
      this.warnings.push(`Could not validate TypeScript in: ${filePath}`);
    }
  }

  validateExportStructure(filePath) {
    const fileName = path.basename(filePath);
    const directory = path.dirname(filePath);

    // Check if directory has index.ts file for proper exports
    if (fileName !== 'index.ts' && !filePath.includes('/app/')) {
      const indexPath = path.join(directory, 'index.ts');
      if (!fs.existsSync(indexPath)) {
        this.warnings.push(`Missing index.ts file in directory: ${directory}`);
      }
    }
  }

  scanDirectory(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        if (!file.name.startsWith('.') && !file.name.includes('node_modules')) {
          this.scanDirectory(fullPath);
        }
      } else {
        this.validateFileNaming(fullPath);
        this.validateImportStructure(fullPath);
        this.validateTypeScriptCompliance(fullPath);
        this.validateExportStructure(fullPath);
      }
    }
  }

  validate() {
    console.log('🔍 Starting file schema validation...\n');

    // Validate directory structure
    this.validateDirectoryStructure();

    // Scan all source files
    if (fs.existsSync('src')) {
      this.scanDirectory('src');
    }

    // Report results
    this.reportResults();

    return this.errors.length === 0;
  }

  reportResults() {
    console.log('📊 Validation Results:\n');

    if (this.errors.length === 0) {
      console.log('✅ All files comply with schema rules!');
    } else {
      console.log(`❌ Found ${this.errors.length} schema violations:\n`);
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Found ${this.warnings.length} warnings:\n`);
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }

    console.log('\n' + '='.repeat(50));
  }
}

// CLI usage
if (require.main === module) {
  const validator = new SchemaValidator();
  const isValid = validator.validate();
  process.exit(isValid ? 0 : 1);
}

module.exports = SchemaValidator;
```

### **Pre-commit Hook** (`.husky/pre-commit`)

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running file schema validation..."
node scripts/validate-schema.js

if [ $? -ne 0 ]; then
  echo "❌ Schema validation failed! Please fix the issues before committing."
  exit 1
fi

echo "✅ Schema validation passed!"
```

### **GitHub Action** (`.github/workflows/schema-validation.yml`)

```yaml
name: File Schema Validation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  validate-schema:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run schema validation
      run: node scripts/validate-schema.js
      
    - name: Check TypeScript compilation
      run: npm run type-check
```

### **VSCode Settings** (`.vscode/settings.json`)

```json
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/**": true,
    "**/dist/**": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.tsx": "typescriptreact",
    "*.ts": "typescript"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.exclude": {
    "**/*-v*.ts": true,
    "**/*-v*.tsx": true,
    "**/*-new.*": true,
    "**/*-old.*": true,
    "**/*-legacy.*": true,
    "**/*-temp.*": true
  }
}
```

---

## 🚨 Enforcement Actions

### **Automated Checks**
1. **Pre-commit validation**: Blocks commits with schema violations
2. **CI/CD pipeline**: Fails builds on schema violations  
3. **Pull request checks**: Prevents merging non-compliant code
4. **IDE warnings**: VSCode highlights forbidden patterns

### **Manual Review Process**
1. **Architecture review**: Required for any schema changes
2. **Code review**: Must verify schema compliance
3. **Documentation update**: Schema changes require doc updates

---

## 📋 Quick Reference Commands

```bash
# Validate current schema compliance
npm run schema:validate

# Fix common naming issues automatically
npm run schema:fix

# Generate index.ts files for new directories
npm run schema:generate-indexes

# Check for forbidden patterns in git history
npm run schema:audit-history
```

---

**🔒 This validation system is MANDATORY and cannot be bypassed without architecture team approval.**
