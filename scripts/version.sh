#!/bin/bash

# Version bump script for NextJS Video Player
# Usage: ./scripts/version.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

echo "🚀 Bumping version: $VERSION_TYPE"

# Bump version in package.json
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")

echo "📦 New version: $NEW_VERSION"

# Update CHANGELOG.md
CHANGELOG_ENTRY="## [$NEW_VERSION] - $(date +%Y-%m-%d)

### Added
- Version bump to $NEW_VERSION

### Changed
- Updated package version

### Fixed
- Bug fixes and improvements

"

# Prepend to CHANGELOG.md (after the first line)
if [ -f "CHANGELOG.md" ]; then
    echo "$CHANGELOG_ENTRY" | cat - <(tail -n +2 CHANGELOG.md) > temp && mv temp CHANGELOG.md
    echo "📝 Updated CHANGELOG.md"
fi

# Commit changes
git add package.json CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION"

# Create and push tag
git tag "v$NEW_VERSION"

echo "✅ Version bumped to $NEW_VERSION"
echo "🏷️  Tagged as v$NEW_VERSION"
echo ""
echo "To push changes and trigger release:"
echo "  git push && git push --tags"
echo ""
echo "Or push everything at once:"
echo "  git push --follow-tags"
