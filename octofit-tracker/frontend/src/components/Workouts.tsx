import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type WorkoutSuggestion = { _id?: string; title: string; focus?: string; minutes?: number; reason?: string };
type WorkoutState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; suggestions: WorkoutSuggestion[] };

export default function Workouts() {
  const [state, setState] = useState<WorkoutState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    const userEmail = 'mona@example.com';
    getJson<{ suggestions: WorkoutSuggestion[] }>(`/api/workouts/suggestions/${encodeURIComponent(userEmail)}`)
      .then(({ suggestions }) => {
        if (active) setState({ status: 'loaded', suggestions });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });
    return () => { active = false; };
  }, []);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Workout suggestions</h2>
        <p>Recommend workouts from activity patterns.</p>
        {state.status === 'loading' && <p role="status">Loading workout suggestions...</p>}
        {state.status === 'error' && <p role="alert">Unable to load workout suggestions.</p>}
        {state.status === 'loaded' && state.suggestions.length === 0 && <p>No workout suggestions yet.</p>}
        {state.status === 'loaded' && state.suggestions.length > 0 && (
          <ul className="list-group">
            {state.suggestions.map((suggestion, index) => (
              <li className="list-group-item" key={suggestion._id ?? `${suggestion.title}-${index}`}>
                <strong>{suggestion.title}</strong>
                {suggestion.focus && <span> · {suggestion.focus}</span>}
                {suggestion.minutes !== undefined && <span> · {suggestion.minutes} minutes</span>}
                {suggestion.reason && <p className="mb-0">{suggestion.reason}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
