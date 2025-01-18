import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Session } from "@/types/session";
import { SessionForm } from "./session-form";
import { useSetAtom } from "jotai";
import { addSessionAtom } from "@/stores/sessions-store";

export const CreateSessionCard: React.FC = () => {
  const addSession = useSetAtom(addSessionAtom);

  const handleSubmit = (data: Omit<Session, "id" | "completed">) => {
    addSession(data);
  };

  return (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="p-4">
        <SessionForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
};
