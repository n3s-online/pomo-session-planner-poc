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

interface SessionCardProps {
  session: Session;
  activeSession: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDismiss?: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  activeSession,
  onDragStart,
  onDragOver,
  onDismiss,
  onDelete,
  onComplete,
}) => {
  return (
    <div
      draggable={!session.completed}
      onDragStart={session.completed ? undefined : onDragStart}
      onDragOver={session.completed ? undefined : onDragOver}
      className={`
        transition-all duration-200
        ${
          session.completed
            ? "opacity-50 pointer-events-none"
            : activeSession
            ? "scale-100"
            : "scale-98"
        }
      `}
    >
      <Card
        className={`
          ${activeSession ? "ring-2 ring-blue-500 shadow-lg" : "shadow-sm"}
          hover:shadow-md transition-shadow
        `}
      >
        <div className="flex">
          <div className="py-4 px-3 cursor-grab hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
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
              <CardFooter className="p-4 pt-0 flex flex-row gap-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={onDismiss}
                >
                  <X className="w-4 h-4 mr-2" />
                  Dismiss Session
                </Button>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={onComplete}
                >
                  Complete Session
                </Button>
              </CardFooter>
            )}
          </div>

          <div className="flex items-center pr-4">
            {!activeSession && onDelete && (
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
