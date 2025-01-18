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
import { useAtomValue, useSetAtom } from "jotai";
import {
  deleteAllSessionsAtom,
  deleteAllCompletedSessionsAtom,
  nonCompletedSessionsAtom,
} from "@/stores/sessions-store";

export function ClearSessionsButton() {
  const nonCompletedSessions = useAtomValue(nonCompletedSessionsAtom);
  const deleteAllCompletedSessions = useSetAtom(deleteAllCompletedSessionsAtom);
  const deleteAllSessions = useSetAtom(deleteAllSessionsAtom);
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
        Clear existing sessions. Your break count will reset as well.
        <DialogFooter className="flex flex-col md:flex-row gap-2">
          {nonCompletedSessions.length > 0 ? (
            <>
              <Button
                onClick={() => {
                  deleteAllCompletedSessions();
                  setOpen(false);
                }}
                variant="destructive"
              >
                Keep Pending
              </Button>
              <Button
                onClick={() => {
                  deleteAllSessions();
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
                  deleteAllSessions();
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
