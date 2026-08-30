import { useState } from 'react';
import { speak } from '../lib/tts';
import { Icon } from './Icons';

export function AudioButton({ text, label }: { text: string; label?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      className="audio-btn"
      title={failed ? 'No Arabic voice available — see Settings' : `Play “${label ?? text}”`}
      onClick={async (e) => {
        e.stopPropagation();
        const ok = await speak(text);
        setFailed(!ok);
      }}
    >
      <Icon name={failed ? 'speakerOff' : 'speaker'} size={17} />
    </button>
  );
}
