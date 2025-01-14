import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Session } from "@/types/session";

type FormInputs = {
  title: string;
  description: string;
};

interface CreateSessionCardProps {
  onNewSession: (session: Omit<Session, "id">) => void;
}

export const CreateSessionCard: React.FC<CreateSessionCardProps> = ({
  onNewSession,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormInputs>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    onNewSession({
      title: data.title.trim(),
      description: data.description.trim() || undefined,
    });
    reset();
  });

  return (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            {...register("title", { required: true })}
            type="text"
            placeholder="Enter session title..."
          />
          <div className="flex items-center gap-2">
            <Input
              {...register("description")}
              type="text"
              placeholder="Enter session description (optional)..."
              className="flex-1"
            />
            <Button type="submit" disabled={!isValid}>
              <Plus className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
