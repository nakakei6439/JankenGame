const STORAGE_KEY = 'janken_ranking';

export interface RankingItem {
  id: number;
  name: string;
  score: number;
  created_at: string;
}

export function getTopRanking(limit = 100): RankingItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const ranking: RankingItem[] = data ? JSON.parse(data) : [];
    return ranking.sort((a, b) => b.score - a.score).slice(0, limit);
  } catch {
    return [];
  }
}

export function addRankingEntry(name: string, score: number): RankingItem {
  const ranking = getTopRanking(Infinity as number);
  const entry: RankingItem = {
    id: Date.now(),
    name,
    score,
    created_at: new Date().toISOString(),
  };
  ranking.push(entry);
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ranking.slice(0, 100)));
  return entry;
}

export function resetRanking(): void {
  localStorage.removeItem(STORAGE_KEY);
}
