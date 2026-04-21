import { normalizeCandidate, normalizeCandidates } from '../utils/candidateViewModel';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const err = new Error(data?.message || `HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return data;
}

async function firstSuccessful(paths, options = {}) {
  let lastError = null;

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    try {
      return await request(path, options);
    } catch (error) {
      lastError = error;
      if (error.status !== 404) {
        throw error;
      }
      if (i < paths.length - 1) {
        console.warn(`[API] ${path} returned 404, falling back to ${paths[i + 1]}`);
      }
    }
  }

  throw lastError || new Error('No API path succeeded.');
}

export async function submitInterview(payload) {
  const data = await firstSuccessful(
    ['/conversation'],
    { method: 'POST', body: JSON.stringify(payload) },
  );
  return normalizeCandidate(data);
}

export async function fetchCandidates() {
  const data = await firstSuccessful(['/candidates', '/conversations']);
  const list = Array.isArray(data) ? data : data?.items || data?.candidates || [];
  return normalizeCandidates(list);
}

export async function fetchCandidateById(id) {
  const candidate = await firstSuccessful([`/candidates/${id}`, `/conversations/${id}`]);

  // Candidate model has conversationId; merge conversation data before normalizing
  // so scores, summary, insights, rawAnswers, etc. are all available in one pass.
  const conversationId = candidate.conversationId;
  if (conversationId) {
    try {
      const conversation = await request(`/conversations/${conversationId}`);
      // Conversation fields take precedence for analysis; candidate fields win for identity.
      return normalizeCandidate({ ...conversation, ...candidate, conversationId });
    } catch {
      // Conversation unavailable — normalize with whatever we have.
    }
  }

  return normalizeCandidate(candidate);
}

export async function fetchConversationById(id) {
  return request(`/conversations/${id}`);
}

export async function createCandidate(payload) {
  const data = await request('/api/candidates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeCandidate(data);
}

export async function fetchAnalysis(candidateId) {
  return request(`/api/analysis/${candidateId}`);
}
