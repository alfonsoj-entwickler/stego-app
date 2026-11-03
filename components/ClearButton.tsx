interface ClearButtonProps {
  onClick: () => void;
}

export function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-bold text-lg hover:bg-[#003D99] active:scale-95 transition-all"
      aria-label="Clear image"
    >
      ✕
    </button>
  );
}
