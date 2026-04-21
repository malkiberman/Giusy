import { useEffect, useState } from 'react';
import { fetchCandidateById } from '../services/api';

export default function useCandidate(id) {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadCandidate() {
      setLoading(true);
      setError('');
      try {
        // fetchCandidateById already merges Conversation data via conversationId,
        // so the normalized candidate includes scores, summary, insights, and qa.
        const data = await fetchCandidateById(id);
        if (mounted) setCandidate(data);
      } catch (apiError) {
        if (mounted) {
          setCandidate(null);
          setError('לא הצלחנו לטעון את המועמד מהשרת.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCandidate();
    return () => {
      mounted = false;
    };
  }, [id]);

  return { candidate, loading, error };
}
