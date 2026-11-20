/* Avatar con iniciales; los colores vienen del propio candidato (mock data). */
const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
};

export default function CandidateAvatar({ candidate, size = 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZES[size]}`}
      style={{ background: candidate.avatarBg, color: candidate.avatarColor }}
    >
      {candidate.initials}
    </span>
  );
}
