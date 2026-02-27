import { cn } from "@/lib/utils";

interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description: string;
  examples: { score: number; text: string }[];
}

export default function ScoreSlider({ value, onChange, label, description, examples }: ScoreSliderProps) {
  return (
    <div className="rounded-md border border-[#3B28A0]/10 bg-white p-5">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[#3B28A0]/60">
        {label}
      </div>
      <p className="mb-4 text-sm text-[#3B28A0]/70">{description}</p>

      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map((score) => (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={cn(
              "flex-1 rounded-md border-2 py-3 text-center text-lg font-bold transition-all",
              value === score
                ? "border-[#3B28A0] bg-[#3B28A0] text-white scale-105"
                : "border-[#3B28A0]/20 bg-[#EDEAFA] text-[#3B28A0] cursor-pointer"
            )}
            data-testid={`score-${label.toLowerCase().replace(/\s/g, '-')}-${score}`}
          >
            {score}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        {examples.map((ex) => (
          <div
            key={ex.score}
            className={cn(
              "flex items-start gap-2 text-xs rounded-md px-2 py-1.5 transition-colors",
              value === ex.score ? "bg-[#EDEAFA] text-[#3B28A0]" : "text-[#3B28A0]/50"
            )}
          >
            <span className="font-bold shrink-0">{ex.score}p:</span>
            <span>{ex.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
