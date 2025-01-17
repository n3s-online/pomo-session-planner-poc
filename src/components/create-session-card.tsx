import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Session } from "@/types/session";
import { SessionForm } from "./session-form";

interface CreateSessionCardProps {
  onNewSession: (session: Omit<Session, "id">) => void;
}

export const CreateSessionCard: React.FC<CreateSessionCardProps> = ({
  onNewSession,
}) => {
  const handleSubmit = (data: Omit<Session, "id" | "completed">) => {
    onNewSession({ ...data, completed: false });
  };

  return (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="p-4">
        <SessionForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
};
