import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export function ClearSessionsButton({
  hasNonCompletedSessions,
  onKeepNonCompleted,
  onDeleteAll,
}: {
  hasNonCompletedSessions: boolean;
  onKeepNonCompleted: () => void;
  onDeleteAll: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Clear</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear Sessions</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-col md:flex-row gap-2">
          {hasNonCompletedSessions ? (
            <>
              <Button
                onClick={() => {
                  onKeepNonCompleted();
                  setOpen(false);
                }}
                variant="destructive"
              >
                Keep Pending
              </Button>
              <Button
                onClick={() => {
                  onDeleteAll();
                  setOpen(false);
                }}
                variant="destructive"
              >
                Delete All
              </Button>
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  onDeleteAll();
                  setOpen(false);
                }}
                variant="destructive"
              >
                Clear
              </Button>
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
