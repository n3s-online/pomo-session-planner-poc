import SessionPlanner from "@/components/session-planner";
import { InsightoFeedbackButton } from "./components/insighto-feedback-button";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <SessionPlanner />
      <InsightoFeedbackButton />
    </TooltipProvider>
  );
}

export default App;
