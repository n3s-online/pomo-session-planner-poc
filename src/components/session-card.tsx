import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Session } from "@/types/session";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SessionCardProps {
  session: Session;
  activeSession: boolean;
  onDismiss?: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  activeSession,
  onDismiss,
  onDelete,
  onComplete,
}) => {
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
              : "shadow-sm hover:shadow-md"
          }
          ${session.completed ? "select-none" : ""}
          ${!isDragging && !activeSession ? "transform scale-[0.98]" : ""}
          transition-[shadow,transform] duration-200 ease-in-out
        `}
      >
        <div className="flex">
          <div
            {...attributes}
            {...listeners}
            className={`py-4 px-3 cursor-grab hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors ${
              session.completed ? "pointer-events-none" : ""
            }`}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <CardContent className="p-4">
              {activeSession ? (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg text-gray-900">
                    {session.title}
                  </h3>
                  {session.description && (
                    <p className="text-sm text-gray-500">
                      {session.description}
                    </p>
                  )}
                </div>
              ) : (
                <Collapsible>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg text-gray-900">
                      {session.title}
                    </h3>
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
                    onClick={onDismiss}
                    size="responsive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Dismiss
                    <span className="hidden md:block"> Session</span>
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={onComplete}
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
            {!activeSession && !session.completed && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-600"
                onClick={onDelete}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
