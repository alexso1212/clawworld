import os from 'node:os';
import path from 'node:path';

function normalize(targetPath) {
  return path.resolve(String(targetPath || '').trim());
}

export function resolveSkillRoots({
  homeDir = os.homedir(),
  openclawHome,
  workspaceRoot,
  codexHome = process.env.CODEX_HOME || path.join(homeDir, '.codex'),
} = {}) {
  const candidates = [
    workspaceRoot,
    openclawHome ? path.join(openclawHome, 'skills') : '',
    codexHome ? path.join(codexHome, 'skills') : '',
    path.join(homeDir, '.agents', 'skills'),
  ]
    .map((entry) => String(entry || '').trim())
    .filter(Boolean)
    .map(normalize);

  const deduped = [];
  const seen = new Set();
  for (const candidate of candidates) {
    if (seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    deduped.push(candidate);
  }
  return deduped;
}

function labelForRoot(root, { homeDir, openclawHome, workspaceRoot, codexHome }) {
  const normalizedRoot = normalize(root);
  const normalizedHome = normalize(homeDir);
  const normalizedOpenclaw = openclawHome ? normalize(openclawHome) : '';
  const normalizedWorkspace = workspaceRoot ? normalize(workspaceRoot) : '';
  const normalizedCodex = codexHome ? normalize(codexHome) : '';

  if (normalizedRoot === normalizedWorkspace) {
    return 'workspace/**/* SKILL.md';
  }
  if (normalizedOpenclaw && normalizedRoot === normalize(path.join(normalizedOpenclaw, 'skills'))) {
    return '.openclaw/skills';
  }
  if (normalizedCodex && normalizedRoot === normalize(path.join(normalizedCodex, 'skills'))) {
    return normalizedRoot.startsWith(normalizedHome) ? '.codex/skills' : `${normalizedRoot}/**/* SKILL.md`;
  }
  if (normalizedRoot === normalize(path.join(normalizedHome, '.agents', 'skills'))) {
    return '.agents/skills';
  }
  if (normalizedRoot.startsWith(normalizedHome + path.sep)) {
    return `${normalizedRoot.slice(normalizedHome.length + 1).replaceAll(path.sep, '/')}/**/* SKILL.md`;
  }
  return `${normalizedRoot.replaceAll(path.sep, '/')}/**/* SKILL.md`;
}

export function describeSkillRoots(roots, params = {}) {
  return roots.map((root) => labelForRoot(root, {
    homeDir: params.homeDir,
    openclawHome: params.openclawHome,
    workspaceRoot: params.workspaceRoot,
    codexHome: params.codexHome || process.env.CODEX_HOME || path.join(params.homeDir || os.homedir(), '.codex'),
  })).join(' + ');
}

function prefixRank(pathValue, preferredRoots) {
  const normalizedPath = normalize(pathValue);
  const matchedIndex = preferredRoots.findIndex((root) => normalizedPath === normalize(root) || normalizedPath.startsWith(`${normalize(root)}${path.sep}`));
  return matchedIndex === -1 ? Number.MAX_SAFE_INTEGER : matchedIndex;
}

export function dedupeSkillItems(items, preferredRoots = []) {
  const bestByTitle = new Map();

  for (const item of items) {
    const key = String(item?.title || item?.path || '').trim().toLowerCase();
    if (!key) {
      continue;
    }

    const current = bestByTitle.get(key);
    if (!current) {
      bestByTitle.set(key, item);
      continue;
    }

    const currentRank = prefixRank(current.path, preferredRoots);
    const nextRank = prefixRank(item.path, preferredRoots);
    if (nextRank < currentRank) {
      bestByTitle.set(key, item);
      continue;
    }
    if (nextRank > currentRank) {
      continue;
    }

    const currentTime = current.updatedAt ? Date.parse(current.updatedAt) : 0;
    const nextTime = item.updatedAt ? Date.parse(item.updatedAt) : 0;
    if (nextTime > currentTime) {
      bestByTitle.set(key, item);
    }
  }

  return [...bestByTitle.values()].sort((left, right) => String(left.title || '').localeCompare(String(right.title || '')));
}
