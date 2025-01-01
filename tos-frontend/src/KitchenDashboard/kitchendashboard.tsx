import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocketStore } from "@/state";

export default function KitchenDashboard() {
  const { sendMessage } = useWebSocketStore();

  // const sendOnclick = () => {
  //   console.log("hie")
  //   sendMessage({
  //     msType: "start-msh",
  //     payload: "hi"
  //   })
  // }
  return (
    <>
      <ScrollArea className="w-full felx flex-row h-full" >
      </ScrollArea>
    </>
  )
}
