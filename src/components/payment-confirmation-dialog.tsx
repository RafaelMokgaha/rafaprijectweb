'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PaymentConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
}: PaymentConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="bg-background/80 backdrop-blur-xl border-primary/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl text-shadow-glow">Payment Required</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-primary-foreground/80">
            A payment of R100 is required to submit a game request.
            <br />
            <br />
            Please confirm you want to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onConfirm}>Confirm & Proceed</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
