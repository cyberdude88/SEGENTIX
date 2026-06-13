"use client";

export default function SplitText({
  text,
  className,
  charClassName = "char",
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.28em]">
          {w.split("").map((c, ci) => (
            <span
              key={ci}
              className={`${charClassName} inline-block will-change-transform`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {c}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
