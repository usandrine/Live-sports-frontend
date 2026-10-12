interface SportFilterProps {
  selectedSport: string | null;
  onSportChange: (sport: string | null) => void;
}

const SPORTS = [
  { key: null, label: 'All', icon: '🏆' },
  { key: 'football', label: 'Football', icon: '⚽' },
  { key: 'basketball', label: 'Basketball', icon: '🏀' },
  { key: 'cricket', label: 'Cricket', icon: '🏏' },
];

export default function SportFilter({ selectedSport, onSportChange }: SportFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by sport"
      className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      {SPORTS.map((sport) => {
        const active = selectedSport === sport.key;
        return (
          <button
            key={sport.key ?? 'all'}
            role="tab"
            aria-selected={active}
            onClick={() => onSportChange(sport.key)}
            className={`chip ${active ? 'chip-active' : ''}`}
          >
            <span className={active ? '' : 'opacity-80 grayscale-[30%]'}>{sport.icon}</span>
            {sport.label}
          </button>
        );
      })}
    </div>
  );
}
