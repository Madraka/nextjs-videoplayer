#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<USAGE
Usage: ./scripts/release.sh [patch|minor|major] [--no-push] [--skip-checks]

Options:
  patch|minor|major  Version bump type (default: patch)
  --no-push          Do not push commit/tag to remote
  --skip-checks      Skip release:check before versioning
USAGE
}

BUMP_TYPE="patch"
NO_PUSH="false"
SKIP_CHECKS="false"

for arg in "$@"; do
  case "$arg" in
    patch|minor|major)
      BUMP_TYPE="$arg"
      ;;
    --no-push)
      NO_PUSH="true"
      ;;
    --skip-checks)
      SKIP_CHECKS="true"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg"
      usage
      exit 1
      ;;
  esac
done

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree is not clean. Commit or stash changes before release."
  exit 1
fi

if [ "$SKIP_CHECKS" = "false" ]; then
  echo "Running release quality checks..."
  pnpm run release:check
fi

CURRENT_VERSION="$(node -p "require('./packages/player/package.json').version")"
echo "Current player version: $CURRENT_VERSION"

echo "Bumping player version: $BUMP_TYPE"
npm --prefix packages/player version "$BUMP_TYPE" --no-git-tag-version

NEW_VERSION="$(node -p "require('./packages/player/package.json').version")"
TAG="v${NEW_VERSION}"
echo "New player version: $NEW_VERSION"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag already exists: $TAG"
  exit 1
fi

if [ -f "packages/player/CHANGELOG.md" ]; then
  TODAY="$(date +%Y-%m-%d)"
  TMP_FILE="$(mktemp)"
  {
    echo "## [$NEW_VERSION] - $TODAY"
    echo
    echo "### Changed"
    echo "- Release $NEW_VERSION"
    echo
    tail -n +2 packages/player/CHANGELOG.md
  } > "$TMP_FILE"
  mv "$TMP_FILE" packages/player/CHANGELOG.md
fi

git add packages/player/package.json packages/player/CHANGELOG.md

git commit -m "release(player): $TAG"
git tag "$TAG"

echo "Created commit + tag: $TAG"

if [ "$NO_PUSH" = "false" ]; then
  git push origin main
  git push origin "$TAG"
  echo "Pushed commit and tag to origin"
else
  echo "Skipping push (--no-push)"
fi

echo "Release completed: $TAG"
