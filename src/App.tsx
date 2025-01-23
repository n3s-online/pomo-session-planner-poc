import SessionPlanner from "@/components/session-planner";
import { InsightoFeedbackButton } from "./components/insighto-feedback-button";
import { TooltipProvider } from "./components/ui/tooltip";
import { useSetAtom } from "jotai";
import { playSoundAtom } from "./stores/sessions-store";
import { useEffect } from "react";

function App() {
  const playSoundCheck = useSetAtom(playSoundAtom);
  useEffect(() => {
    const interval = setInterval(() => {
      playSoundCheck();
    }, 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  return (
    <TooltipProvider>
      <SessionPlanner />
      <InsightoFeedbackButton />
    </TooltipProvider>
  );
}

export default App;
