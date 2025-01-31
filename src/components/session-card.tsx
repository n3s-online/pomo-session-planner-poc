import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, ChevronDown, Pencil, Save } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PendingSession, Session } from "@/types/session";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SessionForm } from "./session-form";
import { useAtomValue, useSetAtom } from "jotai";
import {
  deleteSessionAtom,
  completeSessionAtom,
  editSessionAtom,
} from "@/stores/sessions-store";
import { useElapsedTime } from "@/hooks/useElapsedTime";
import { timerSettingsAtom } from "@/stores/settings-store";

interface SessionCardProps {
  session: Session;
  activeSession: boolean;
}

const formatCompletionDate = (date: Date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  activeSession,
}) => {
  const timerSettings = useAtomValue(timerSettingsAtom);
  const [isEditing, setIsEditing] = useState(false);
  const elapsedTime = useElapsedTime(
    session.sessionStartDate && new Date(session.sessionStartDate)
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: session.id,
    disabled: session.completed,
    transition: {
      duration: 200,
      easing: "ease",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: [
      transform ? `transform ${transition}` : "",
      "box-shadow 200ms ease",
    ]
      .filter(Boolean)
      .join(", "),
  };

  const deleteSession = useSetAtom(deleteSessionAtom);
  const completeSession = useSetAtom(completeSessionAtom);
  const editSession = useSetAtom(editSessionAtom);

  const handleDelete = () => deleteSession(session.id);
  const handleComplete = () => completeSession(session.id);
  const handleEdit = (updates: Partial<PendingSession>) => {
    editSession({ id: session.id, updates });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (activeSession && isEditing) {
      setIsEditing(false);
    }
  }, [isEditing, activeSession]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${session.completed ? "opacity-50" : ""}
        ${isDragging ? "z-50" : "z-0"}
      `}
    >
      <Card
        className={`
          ${
            activeSession
              ? "ring-2 ring-blue-500 shadow-lg hover:shadow-xl bg-gradient-to-br from-green-100 to-blue-100"
              : "ring-0 shadow-sm hover:shadow-md bg-gradient-to-br from-white to-white"
          }
          ${session.completed ? "select-none" : ""}
          ${
            !isDragging && !activeSession
              ? "transform scale-[0.98]"
              : "transform scale-100"
          }
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="flex">
          <div
            {...attributes}
            {...listeners}
            className={`py-4 px-3 cursor-grab text-gray-400 hover:text-gray-600 transition-colors ${
              session.completed ? "pointer-events-none" : ""
            }`}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <CardContent className="p-4">
              {isEditing ? (
                <SessionForm
                  onSubmit={handleEdit}
                  onCancel={handleCancelEdit}
                  initialData={session}
                  submitLabel="Save"
                  submitIcon={<Save className="w-4 h-4 mr-2" />}
                />
              ) : activeSession ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg text-gray-900">
                      {session.title}
                    </h3>
                    {timerSettings.enabled && session.sessionStartDate && (
                      <span className="text-sm font-medium text-gray-600">
                        {elapsedTime?.minutes}:
                        {elapsedTime?.seconds.toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  {session.description && (
                    <p className="text-sm text-gray-500">
                      {session.description}
                    </p>
                  )}
                </div>
              ) : (
                <Collapsible>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-medium text-lg text-gray-900">
                        {session.title}
                        {session.completed &&
                          session.actualLength !== undefined && (
                            <span className="ml-2 text-sm text-gray-500">
                              ({session.actualLength} min
                              {session.breakAfterLength !== undefined &&
                                ` + ${session.breakAfterLength} min break`}
                              )
                            </span>
                          )}
                      </h3>
                      {session.completed && (
                        <h3 className="text-sm font-medium text-gray-600">
                          {session.sessionEndDate &&
                            `${formatCompletionDate(
                              new Date(session.sessionEndDate)
                            )}`}
                        </h3>
                      )}
                    </div>
                    {session.description && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                  {session.description && (
                    <CollapsibleContent className="pt-2">
                      <p className="text-sm text-gray-500">
                        {session.description}
                      </p>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              )}
            </CardContent>
            {activeSession && !session.completed && (
              <CardFooter className="p-4 pt-0">
                <div className="flex flex-row w-full gap-2 sm:gap-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDelete}
                    size="responsive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Dismiss
                    <span className="hidden md:block"> Session</span>
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleComplete}
                    size="responsive"
                  >
                    Complete
                    <span className="hidden md:block"> Session</span>
                  </Button>
                </div>
              </CardFooter>
            )}
          </div>

          <div className="flex items-center pr-4">
            {!activeSession && !session.completed && (
              <>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600"
                  onClick={handleDelete}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
