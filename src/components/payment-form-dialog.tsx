'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface PaymentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentFormDialog({ isOpen, onClose }: PaymentFormDialogProps) {

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process payment here.
    // For this simulation, we just call the onClose callback.
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-shadow-glow">Complete Your Payment</DialogTitle>
          <DialogDescription>
            Enter your payment details to finalize the R100 request fee.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="**** **** **** ****" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input id="expiry-date" placeholder="MM / YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="***" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-holder">Card Holder Name</Label>
            <Input id="card-holder" placeholder="John Doe" />
          </div>
          
          <DialogFooter>
            <Button type="submit" className="w-full font-bold">
              Pay R100
            </Button>
          </DialogFooter>
        </form>

        <div className="relative my-4">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background px-2 text-sm text-muted-foreground">
            OR
          </span>
        </div>

        <div className="space-y-3">
            <Button variant="outline" className="w-full font-bold" onClick={onClose}>
                {/* In a real app, this would initiate PayPal checkout */}
                Pay with PayPal
            </Button>
             <Button variant="outline" className="w-full font-bold" onClick={onClose}>
                {/* In a real app, this would initiate another payment method */}
                Pay with Google Pay
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
