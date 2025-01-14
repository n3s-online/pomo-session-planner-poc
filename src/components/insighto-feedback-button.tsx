import { ThumbsUp } from "lucide-react";

export function InsightoFeedbackButton() {
  return (
    <a
      href="https://insigh.to/b/session-planner"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-0 right-0 z-50 flex items-center gap-1 rounded-tl-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <ThumbsUp size={12} />
      <span className="hidden sm:inline">Feedback</span>
    </a>
  );
}
