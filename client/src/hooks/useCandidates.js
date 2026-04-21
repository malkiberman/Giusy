import { useEffect, useMemo, useState } from 'react';
import { fetchCandidates } from '../services/api';

export default function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    let mounted = true;

    async function loadCandidates() {
      setLoading(true);
      setError('');
      try {
        const list = await fetchCandidates();
        if (mounted) setCandidates(list);
      } catch (apiError) {
        if (mounted) {
          setError('לא הצלחנו לטעון מועמדים מהשרת.');
          setCandidates([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCandidates();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: candidates.length,
      above80: candidates.filter((candidate) => candidate.score > 80).length,
      mid: candidates.filter((candidate) => candidate.score >= 50 && candidate.score <= 80).length,
      below50: candidates.filter((candidate) => candidate.score < 50).length,
    }),
    [candidates],
  );

  const filtered = useMemo(() => {
    let list = [...candidates];

    list = list.filter((candidate) => candidate.score >= scoreRange[0] && candidate.score <= scoreRange[1]);
    if (roleFilter !== 'all') list = list.filter((candidate) => String(candidate.recommendedRole) === roleFilter);

    return list.sort((a, b) => b.score - a.score);
  }, [candidates, scoreRange, roleFilter]);

  return { candidates, loading, error, scoreRange, setScoreRange, roleFilter, setRoleFilter, filtered, stats };
}
