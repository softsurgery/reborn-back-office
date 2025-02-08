import { useMediaQuery } from "@/hooks/useMediaQuery";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface UseDialogOptions {
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  className?: string;
  onToggle?: () => void;
}

interface UseDialogReturn {
  DialogFragment: React.ReactNode;
  openDialog: () => void;
  closeDialog: () => void;
}
export function useDialog({
  children,
  className = "",
  title,
  description,
  onToggle,
}: UseDialogOptions): UseDialogReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1500px)");

  const openDialog = (): void => setIsOpen(true);
  const closeDialog = (): void => setIsOpen(false);
  const onOpenChange = (b: boolean) => {
    setIsOpen(b);
    onToggle?.();
  };

  if (typeof window === "undefined" || typeof document === "undefined") {
    return { DialogFragment: null, openDialog, closeDialog };
  }

  const DialogFragment = ReactDOM.createPortal(
    <React.Fragment>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className={cn(className)}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
          <DrawerContent className="my-5 px-2">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {children}
          </DrawerContent>
        </Drawer>
      )}
    </React.Fragment>,
    document.body
  );

  return { DialogFragment, openDialog, closeDialog };
}
