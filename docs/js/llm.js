/**
 * llm.js — OpenRouter LLM integration
 *
 * Two features:
 * 1. AI Journal Coach (Today tab) — responds to daily reflections
 * 2. Socratic Tutor (Learn tab) — answers questions about concepts
 *
 * Uses OpenRouter free tier (rate limited but zero cost).
 * API key stored in Firebase profile, not hardcoded.
 */

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free model — Llama 3.3 70B or fallback
const DEFAULT_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

let apiKey = null;

/**
 * Set the OpenRouter API key.
 */
export function setApiKey(key) {
  apiKey = key;
}

/**
 * Get the current API key.
 */
export function getApiKey() {
  return apiKey;
}

/**
 * Send a message to the LLM and get a response.
 * @param {string} systemPrompt - System instructions
 * @param {string} userMessage - User's message
 * @param {string} model - Model to use (default: free Llama)
 * @returns {Promise<string>} AI response text
 */
export async function chat(systemPrompt, userMessage, model = DEFAULT_MODEL) {
  if (!apiKey) {
    throw new Error('No API key set. Add your OpenRouter API key in Profile → Settings.');
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Productivity Playbook'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}

/**
 * AI Journal Coach — responds to a daily reflection.
 * Connects the reflection to psychology concepts.
 */
export async function journalCoach(reflection, recentContext = '') {
  const systemPrompt = `You are a wise, direct personal coach who understands psychology deeply. You have expertise in:
- Cognitive biases (anchoring, framing, loss aversion, confirmation bias)
- Motivation science (SDT: autonomy, competence, relatedness)
- Self-efficacy (Bandura)
- Negotiation and communication
- Behavioral economics

When the user shares their daily reflection:
1. Acknowledge what they did (briefly, 1 sentence)
2. Connect it to a relevant psychology concept (name it specifically)
3. Ask ONE probing question that helps them think deeper

Tone: Warm but direct. Like a smart friend, not a therapist. Keep responses under 150 words.
${recentContext ? `\nRecent context about the user:\n${recentContext}` : ''}`;

  return chat(systemPrompt, reflection);
}

/**
 * Socratic Tutor — answers questions about a concept.
 * Has the concept content as context.
 */
export async function socraticTutor(question, conceptContent, conceptTitle) {
  const systemPrompt = `You are a Socratic tutor teaching psychology at a graduate level. You are currently discussing the concept: "${conceptTitle}".

Here is the full content about this concept:

${conceptContent}

When the student asks a question:
1. Answer it accurately using the content above
2. Connect to related concepts when relevant
3. Ask a follow-up Socratic question that pushes deeper understanding
4. Use specific experiments and findings from the content as evidence

Tone: Intellectually rigorous but approachable. Like a great professor in office hours.
Keep responses under 200 words.`;

  return chat(systemPrompt, question);
}
