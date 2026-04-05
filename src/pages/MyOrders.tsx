import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { getOrdersByPhone, requestCancel, type Order } from "@/lib/sheets";
import { useToast } from "@/hooks/use-toast";

export default function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return;
    setLoading(true);
    try {
      const res = await getOrdersByPhone(phone);
      setOrders(res);
      setSearched(true);
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to fetch orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await requestCancel(orderId);
      toast({ title: "Cancel request sent" });
      handleSearch();
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed", variant: "destructive" });
    }
  };

  const statusColor = (s: string) => {
    if (s === "Cancelled") return "destructive";
    if (s === "Delivered") return "default";
    return "secondary";
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">My Orders</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Label htmlFor="lookup-phone">Enter your phone number</Label>
          <div className="flex gap-2 mt-2">
            <Input id="lookup-phone" placeholder="10-digit number" maxLength={10}
              value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
            <Button onClick={handleSearch} disabled={!/^[6-9]\d{9}$/.test(phone) || loading} className="gap-1">
              <Search className="h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && orders.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No orders found for this number.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <Badge variant={statusColor(order.status)}>{order.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{order.createdAt}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.product}{item.option !== "-" ? ` (${item.option})` : ""} x{item.quantity}</span>
                    <span className="font-medium">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <span className="font-semibold text-primary text-lg">₹{order.total}</span>
                <div className="flex items-center gap-2">
                  {order.cancelRequest !== "No" && (
                    <Badge variant={order.cancelRequest === "Approved" ? "destructive" : "secondary"}>
                      Cancel: {order.cancelRequest}
                    </Badge>
                  )}
                  {order.status === "Pending" && order.cancelRequest === "No" && (
                    <Button variant="outline" size="sm" onClick={() => handleCancel(order.id!)}>
                      Request Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
