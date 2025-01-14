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
  index: number;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDismiss?: () => void;
  onDelete?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  index,
  onDragStart,
  onDragOver,
  onDismiss,
  onDelete,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      className={`transition-all duration-200 ${
        index === 0 ? "scale-100" : "scale-98"
      }`}
    >
      <Card
        className={`
          ${index === 0 ? "ring-2 ring-blue-500 shadow-lg" : "shadow-sm"}
          hover:shadow-md transition-shadow
        `}
      >
        <div className="flex">
          <div className="py-4 px-3 cursor-grab hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <CardContent className="p-4">
              {index === 0 ? (
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
            {index === 0 && onDismiss && (
              <CardFooter className="p-4 pt-0">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={onDismiss}
                >
                  <X className="w-4 h-4 mr-2" />
                  Dismiss Session
                </Button>
              </CardFooter>
            )}
          </div>

          <div className="flex items-center pr-4">
            {index > 0 && onDelete && (
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
