import prisma from "@/lib/db/prisma";
import type { SearchOptions, SearchResult, EmbeddingConfig } from "@/types/search";

const DEFAULT_CONFIG: EmbeddingConfig = {
  model: "text-embedding-3-small",
  dimensions: 1536,
  maxTokens: 8192,
};

/**
 * EmbeddingService handles generation of vector embeddings and
 * semantic search via pgvector in PostgreSQL.
 */
export class EmbeddingService {
  private config: EmbeddingConfig;

  constructor(config: EmbeddingConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Generate an embedding vector for the given text.
   * In production, calls OpenAI's embedding API.
   * For now, returns a mock vector for development.
   */
  async generate(text: string): Promise<number[]> {
    // Truncate text to maxTokens (rough estimate: 1 token ≈ 4 chars)
    const maxChars = this.config.maxTokens * 4;
    const truncated = text.slice(0, maxChars);

    // In production: call OpenAI API
    // const response = await openai.embeddings.create({
    //   model: this.config.model,
    //   input: truncated,
    //   dimensions: this.config.dimensions,
    // });
    // return response.data[0].embedding;

    // Mock: generate a deterministic-ish vector based on text content
    return this.mockEmbedding(truncated);
  }

  /**
   * Generate embeddings for multiple texts in batch.
   */
  async generateBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((text) => this.generate(text)));
  }

  /**
   * Index an embedding for a given entity in the database.
   * Updates the vector column of the corresponding entity table.
   */
  async index(entityType: string, entityId: string, embedding: number[]): Promise<void> {
    const vectorStr = `[${embedding.join(",")}]`;

    switch (entityType) {
      case "task":
        await prisma.$executeRawUnsafe(
          `UPDATE tasks SET embedding = $1::vector WHERE id = $2`,
          vectorStr,
          entityId
        );
        break;
      case "note":
        await prisma.$executeRawUnsafe(
          `UPDATE notes SET embedding = $1::vector WHERE id = $2`,
          vectorStr,
          entityId
        );
        break;
      case "meeting_summary":
        await prisma.$executeRawUnsafe(
          `UPDATE meeting_summaries SET embedding = $1::vector WHERE id = $2`,
          vectorStr,
          entityId
        );
        break;
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }

  /**
   * Perform semantic search across indexed entities using cosine similarity.
   * Returns results ordered by relevance (highest score first).
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const queryEmbedding = await this.generate(query);
    const vectorStr = `[${queryEmbedding.join(",")}]`;
    const limit = options?.limit ?? 10;
    const threshold = options?.threshold ?? 0.5;
    const entityTypes = options?.entityTypes ?? ["task", "note", "meeting_summary"];

    const results: SearchResult[] = [];

    if (entityTypes.includes("task")) {
      const taskResults: Array<{ id: string; name: string; score: number }> =
        await prisma.$queryRawUnsafe(
          `SELECT id, name, 1 - (embedding <=> $1::vector) as score
           FROM tasks
           WHERE embedding IS NOT NULL
           AND 1 - (embedding <=> $1::vector) > $2
           ORDER BY score DESC
           LIMIT $3`,
          vectorStr,
          threshold,
          limit
        );
      results.push(
        ...taskResults.map((r) => ({
          entityType: "task",
          entityId: r.id,
          score: r.score,
          snippet: r.name,
        }))
      );
    }

    if (entityTypes.includes("note")) {
      const noteResults: Array<{ id: string; title: string; score: number }> =
        await prisma.$queryRawUnsafe(
          `SELECT id, title, 1 - (embedding <=> $1::vector) as score
           FROM notes
           WHERE embedding IS NOT NULL
           AND 1 - (embedding <=> $1::vector) > $2
           ORDER BY score DESC
           LIMIT $3`,
          vectorStr,
          threshold,
          limit
        );
      results.push(
        ...noteResults.map((r) => ({
          entityType: "note",
          entityId: r.id,
          score: r.score,
          snippet: r.title,
        }))
      );
    }

    if (entityTypes.includes("meeting_summary")) {
      const summaryResults: Array<{ id: string; overview: string; score: number }> =
        await prisma.$queryRawUnsafe(
          `SELECT id, overview, 1 - (embedding <=> $1::vector) as score
           FROM meeting_summaries
           WHERE embedding IS NOT NULL
           AND 1 - (embedding <=> $1::vector) > $2
           ORDER BY score DESC
           LIMIT $3`,
          vectorStr,
          threshold,
          limit
        );
      results.push(
        ...summaryResults.map((r) => ({
          entityType: "meeting_summary",
          entityId: r.id,
          score: r.score,
          snippet: r.overview.slice(0, 100),
        }))
      );
    }

    // Sort all results by score descending and take top N
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Generate a mock embedding for development/testing.
   * Creates a deterministic vector based on text content hash.
   */
  private mockEmbedding(text: string): number[] {
    const vector: number[] = new Array(this.config.dimensions);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    for (let i = 0; i < this.config.dimensions; i++) {
      hash = ((hash << 5) - hash + i) | 0;
      vector[i] = (hash % 1000) / 1000;
    }
    return vector;
  }
}

/** Singleton instance */
export const embeddingService = new EmbeddingService();
