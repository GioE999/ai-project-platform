export interface SearchOptions {
  limit?: number;
  entityTypes?: string[];
  threshold?: number;
}

export interface SearchResult {
  entityType: string;
  entityId: string;
  score: number;
  snippet: string;
}

export interface EmbeddingConfig {
  model: "text-embedding-3-small" | "text-embedding-3-large";
  dimensions: 1536 | 3072;
  maxTokens: number;
}
