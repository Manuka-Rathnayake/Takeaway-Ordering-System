import { useAppStore } from "@/state";
import OrderCard from "./orderCard";
import { useMemo } from "react";



export default function PendingOrderPage() {
  const { pendingOrder } = useAppStore();


  const combinedArry = useMemo(() => {
    return pendingOrder.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateA - dateB;
    });
  }, [pendingOrder]);

  return (
    <>
      <div className="flex flex-col overflow-auto"  >
        <div className="flex flex-row pb-5">
          <h1 className="text-2xl font-semibold">
            Pending Orders (today)
          </h1>
        </div>
        <div className="flex flex-col gap-y-4 ">

          {combinedArry.length > 0 ? (
            combinedArry.map(item => <OrderCard key={item._id} data={item} />)
          ) : (
            <p>Orders are not placed today</p>
          )}
        </div>
      </div>
    </>
  )
}


