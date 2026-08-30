import { useState } from 'react';
import { api } from '../lib/api';
import { useStore } from '../store/useStore';

/** Button that adds both flashcard directions for a vocab word to the SRS deck. */
export function AddToDeck({ wordId, compact }: { wordId: string; compact?: boolean }) {
  const inDeck = useStore((s) => s.cardStates.has(`vocab:${wordId}:ar-en`));
  const refreshCounts = useStore((s) => s.refreshCounts);
  const [busy, setBusy] = useState(false);

  if (inDeck) {
    return <span className="in-deck small" title="Already in your review deck">✓ in deck</span>;
  }
  return (
    <button
      className="btn small-btn"
      disabled={busy}
      title="Add this word's flashcards to your review deck"
      onClick={async (e) => {
        e.stopPropagation();
        setBusy(true);
        try {
          await api.addCards([
            { id: `vocab:${wordId}:ar-en`, type: 'vocab-ar-en' },
            { id: `vocab:${wordId}:en-ar`, type: 'vocab-en-ar' },
          ]);
          await refreshCounts();
        } finally {
          setBusy(false);
        }
      }}
    >
      {compact ? '+' : '+ add to deck'}
    </button>
  );
}
