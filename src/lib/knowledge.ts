import fs from 'fs';
import path from 'path';

export interface KnowledgeChunk {
  id: string;
  content: string;
  source: string;
  category: string;
}

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge');

export function loadKnowledgeFiles(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const files = fs.readdirSync(KNOWLEDGE_DIR);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const category = file.replace('.md', '');
    
    // Split content into meaningful chunks by sections
    const sections = content.split(/(?=^##\s)/m).filter(Boolean);
    
    sections.forEach((section, index) => {
      const trimmedSection = section.trim();
      if (trimmedSection.length > 50) { // Only include substantial content
        chunks.push({
          id: `${category}-${index}`,
          content: trimmedSection,
          source: file,
          category,
        });
      }
    });
  }

  return chunks;
}

// Simple text similarity using word overlap (no external dependencies)
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function calculateSimilarity(query: string, text: string): number {
  const queryTokens = new Set(tokenize(query));
  const textTokens = tokenize(text);
  
  if (queryTokens.size === 0 || textTokens.length === 0) return 0;
  
  let matchCount = 0;
  const textTokenSet = new Set(textTokens);
  
  // Count matching words
  for (const token of queryTokens) {
    if (textTokenSet.has(token)) {
      matchCount++;
    }
  }
  
  // Boost for exact phrase matches
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  if (lowerText.includes(lowerQuery)) {
    matchCount += queryTokens.size;
  }
  
  return matchCount / queryTokens.size;
}

// Keyword-based intent detection
const intentKeywords: Record<string, string[]> = {
  products: ['product', 'slime', 'butter', 'cloud', 'floam', 'clear', 'galaxy', 'glow', 'magnetic', 'kit', 'price', 'cost', 'buy', 'purchase', 'collection'],
  shipping: ['ship', 'shipping', 'delivery', 'deliver', 'arrive', 'tracking', 'track', 'package', 'international', 'express', 'overnight', 'days', 'when'],
  returns: ['return', 'refund', 'exchange', 'defective', 'broken', 'damaged', 'money back', 'send back'],
  payments: ['pay', 'payment', 'credit', 'debit', 'card', 'paypal', 'apple pay', 'afterpay', 'klarna', 'checkout', 'promo', 'discount', 'code', 'gift card'],
  policies: ['policy', 'privacy', 'terms', 'safety', 'safe', 'toxic', 'children', 'kids', 'age', 'allergen', 'support', 'contact'],
  faq: ['how', 'what', 'why', 'when', 'can i', 'do you', 'is it', 'help', 'question'],
  greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you', 'bye', 'goodbye'],
};

export function detectIntent(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const matches: { category: string; score: number }[] = [];
  
  for (const [category, keywords] of Object.entries(intentKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        score++;
      }
    }
    if (score > 0) {
      matches.push({ category, score });
    }
  }
  
  // Sort by score and return top categories
  matches.sort((a, b) => b.score - a.score);
  return matches.length > 0 
    ? matches.slice(0, 2).map(m => m.category)
    : ['faq', 'products']; // Default fallback
}

export function retrieveRelevantKnowledge(
  query: string, 
  chunks: KnowledgeChunk[], 
  maxChunks: number = 3
): KnowledgeChunk[] {
  const intents = detectIntent(query);
  
  // Score all chunks
  const scoredChunks = chunks.map(chunk => {
    let score = calculateSimilarity(query, chunk.content);
    
    // Boost score for matching intent categories
    if (intents.includes(chunk.category)) {
      score *= 1.5;
    }
    
    return { chunk, score };
  });
  
  // Sort by score and return top chunks
  scoredChunks.sort((a, b) => b.score - a.score);
  
  return scoredChunks
    .slice(0, maxChunks)
    .filter(sc => sc.score > 0)
    .map(sc => sc.chunk);
}

// Cache for loaded knowledge
let cachedKnowledge: KnowledgeChunk[] | null = null;

export function getKnowledge(): KnowledgeChunk[] {
  if (!cachedKnowledge) {
    cachedKnowledge = loadKnowledgeFiles();
  }
  return cachedKnowledge;
}
