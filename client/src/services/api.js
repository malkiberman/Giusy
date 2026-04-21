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
  const body = { ...(payload.candidate || {}), answers: payload.answers };
  const data = await firstSuccessful(
    ['/api/candidates'],
    { method: 'POST', body: JSON.stringify(body) },
  );
  return normalizeCandidate(data);
}

export async function fetchCandidates() {
  const data = await firstSuccessful(['/api/candidates']);
  const list = Array.isArray(data) ? data : data?.candidates || [];
  return normalizeCandidates(list);
}

export async function fetchCandidateById(id) {
  const allCandidates = await request('/api/candidates');
  const list = Array.isArray(allCandidates) ? allCandidates : allCandidates?.candidates || [];
  const candidate = list.find((c) => String(c._id) === String(id) || String(c.id) === String(id));

  if (!candidate) {
    const err = new Error('Candidate not found');
    err.status = 404;
    throw err;
  }

  try {
    const analysis = await request(`/api/analysis/${id}`);
    return normalizeCandidate({ ...candidate, analysis });
  } catch {
    return normalizeCandidate(candidate);
  }
}

export async function fetchConversationById(id) {
  return request(`/api/analysis/${id}`);
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
