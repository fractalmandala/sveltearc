/**
 * Fast Levenshtein distance calculation
 */
export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Find the closest matches from a list or set of candidates
 */
export function findClosestMatches(target, candidates, maxResults = 3, maxDistance = 6) {
  const list = Array.isArray(candidates) ? candidates : Array.from(candidates);
  const scored = [];

  for (const item of list) {
    const dist = levenshtein(target.toLowerCase(), item.toLowerCase());
    if (dist <= maxDistance) {
      scored.push({ item, dist });
    }
  }

  scored.sort((a, b) => a.dist - b.dist);
  return scored.slice(0, maxResults).map(s => s.item);
}

/**
 * Find closest token from a numeric pixel scale
 */
export function findClosestScaleToken(valStr, scaleMap) {
  const num = parseInt(valStr.replace(/[^0-9]/g, ""), 10);
  if (isNaN(num)) return null;

  let closest = null;
  let minDiff = Infinity;

  for (const [scalePx, token] of Object.entries(scaleMap)) {
    const scaleNum = parseInt(scalePx.replace(/[^0-9]/g, ""), 10);
    const diff = Math.abs(num - scaleNum);
    if (diff < minDiff) {
      minDiff = diff;
      closest = { px: scalePx, token, diff };
    }
  }

  return closest;
}
