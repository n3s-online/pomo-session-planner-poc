import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Session } from "@/types/session";
import { sessionFormSchema, SessionFormData } from "@/types/session-schema";

interface SessionFormProps {
  onSubmit: (data: Omit<Session, "id" | "completed">) => void;
  onCancel?: () => void;
  initialData?: Partial<SessionFormData>;
  submitLabel?: string;
  submitIcon?: React.ReactNode;
}

export const SessionForm: React.FC<SessionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = "Add Session",
  submitIcon = <Plus className="w-4 h-4 mr-2" />,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit({
      title: data.title,
      description: data.description || undefined,
    });
    if (!initialData) {
      reset();
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          {...register("title")}
          type="text"
          placeholder="Enter session title..."
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          {...register("description")}
          type="text"
          placeholder="Enter session description (optional)..."
          className="flex-1"
        />
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {submitIcon}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};
