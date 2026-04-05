import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WHATSAPP_NUMBER, UPI_ID } from "@/lib/constants";
import type { OrderItem } from "@/lib/sheets";
import { CheckCircle, MessageCircle, Smartphone } from "lucide-react";

interface OrderSuccessProps {
  orderId: number;
  total: number;
  items: OrderItem[];
  customerName: string;
  onNewOrder: () => void;
}

export default function OrderSuccess({ orderId, total, items, customerName, onNewOrder }: OrderSuccessProps) {
  const itemsText = items.map((i) => `${i.product}${i.option ? ` (${i.option})` : ""} x${i.quantity} = ₹${i.subtotal}`).join("\n");
  const whatsappMsg = encodeURIComponent(
    `🌸 *New Order from EVERLUSH CUSTOMS*\n\nOrder #${orderId}\nCustomer: ${customerName}\n\n${itemsText}\n\n*Total: ₹${total}*`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=Everlush%20Customs&am=${total}&cu=INR&tn=Order%20${orderId}`;

  return (
    <Card className="max-w-md mx-auto text-center">
      <CardHeader>
        <div className="flex justify-center mb-3">
          <CheckCircle className="h-16 w-16 text-success" />
        </div>
        <CardTitle className="text-2xl">Order Placed! 🎉</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-accent p-4">
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="text-3xl font-bold text-primary">#{orderId}</p>
          <p className="text-lg font-semibold mt-1">Total: ₹{total}</p>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full gap-2 bg-success hover:bg-success/90 text-success-foreground">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> Send via WhatsApp
            </a>
          </Button>

          <Button asChild variant="outline" className="w-full gap-2">
            <a href={upiUrl}>
              <Smartphone className="h-4 w-4" /> Pay ₹{total} via UPI
            </a>
          </Button>
        </div>

        <Button variant="link" onClick={onNewOrder} className="text-muted-foreground">
          Place another order
        </Button>
      </CardContent>
    </Card>
  );
}
