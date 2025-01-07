import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IOrder } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore, useWebSocketStore } from "@/state";
import MenuItemDialogOrder from "@/components/default/menuItemDialogOrder";
import { MenuItemIngredientsPopup } from "@/components/default/order-menu-ingredient";

interface OrderCardProp {
  data: IOrder;
}

export default function OrderCard({ data }: OrderCardProp) {
  const { changeOrderState } = useAppStore();
  const { sendMessage } = useWebSocketStore();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "processing":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const onChangeOrderState = async (state: string) => {
    await changeOrderState(data._id.toString(), state);
  };

  const onDeleteMenuItem = (id: string) => {
    const datareq = {
      orderId: data._id,
      menuItemId: id,
    };
    sendMessage({
      msgType: "remove-menu-item",
      payload: datareq,
    });
  };

  return (
    <>
      <div className="min-h-52 flex flex-row bg-white hover:drop-shadow-lg">
        <div className="flex flex-row w-1/3 border">
          <div className={`w-2 ${getStatusColor(data.status)}`}></div>
          <div className="w-full flex flex-col p-4">
            <div className="flex flex-col h-1/4">
              <h1 className="text-2xl font-semibold">
                Order No: #{data._id.slice(-4)}
              </h1>
              <h1 className="text-sm text-gray-400">
                {formatDate(data.updatedAt)}
              </h1>
            </div>
            <hr className="mt-2" />
            <div className="flex flex-col justify-center h-2/4">
              <h1 className="text-md">
                Customer Name:{" "}
                <span className="font-semibold">{data.customerName}</span>
              </h1>
              <hr />
              <h1 className="text-md">
                Customer No:{" "}
                <span className="font-semibold">{data.customerNumber}</span>
              </h1>
              <hr />
              <h1 className="text-md">
                Price:{" "}
                <span className="font-semibold">
                  Rs: {data.totalPrice.$numberDecimal}
                </span>
              </h1>
              <hr />
            </div>
            <div className="flex flex-row items-center h-1/4 justify-between gap-y-2">
              <div>
                <Badge
                  className={`${getStatusColor(data.status)} items-center`}
                >
                  {data.status}
                </Badge>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button size="sm" className="bg-red-400">
                      {" "}
                      Next {">>"}{" "}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Change state</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        onChangeOrderState("pending");
                      }}
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        onChangeOrderState("processing");
                      }}
                    >
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        onChangeOrderState("completed");
                      }}
                    >
                      Complete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        onChangeOrderState("cancelled");
                      }}
                    >
                      Cancle
                    </DropdownMenuItem>
                    <DropdownMenuLabel>Edit Order</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-2/3 border">
          <div className="flex flex-row bg-red-100 h-1/6">
            <div className="w-2/3 border border-red-200 text-red-400 p-2">
              Items
            </div>
            <div className="w-1/3 border border-red-200 text-red-400 p-2">
              Quantity
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-2rem)]">
            {data.menuItem.map((item) => (
              <div
                key={item._id}
                className="flex flex-row h-1/6 hover:bg-gray-200 "
              >
                <div className="w-4/6 border p-2">{item.id.name}</div>
                <div className="w-1/6 justify-center border p-2">
                  {item.quantity}
                </div>
                <div className="w-1/6 justify-center border p-2">
                  <MenuItemIngredientsPopup
                    menuItem={item.id}
                    onDeleteMenuItem={onDeleteMenuItem}
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center flex-row h-1/6 py-4 ">
              <MenuItemDialogOrder orderId={data._id} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
