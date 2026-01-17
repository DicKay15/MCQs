"use client";

interface ProgressStep {
  label: string;
  status: "pending" | "active" | "complete";
}

interface ControlledProgressProps {
  steps: ProgressStep[];
  title?: string;
}

export function ControlledProgress({ steps }: ControlledProgressProps) {
  // Find the current active step
  const activeStep = steps.find((s) => s.status === "active");

  if (!activeStep) {
    return null;
  }

  return (
    <div className="py-4">
      <p className="text-sm font-medium shimmer-text">
        {activeStep.label}
      </p>
      <style jsx>{`
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #6b7280 0%,
            #6b7280 40%,
            #0066ff 50%,
            #6b7280 60%,
            #6b7280 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </div>
  );
}
