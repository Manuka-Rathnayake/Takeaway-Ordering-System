import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IMenuItem } from '@/types/types'
import api from "@/utils/axios"

interface MenuItemCardProps {
  item: IMenuItem
  onAdd: (item: IMenuItem) => void
}

export function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <Card className="w-[250px]">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={`${api.defaults.baseURL}${item.imagePath}` || '/placeholder.svg'}
          alt={item.name}
          width={200}
          height={200}
          className="rounded-md object-cover"
        />
        <p className="mt-2">{item.des}</p>
        <p className="font-bold mt-2">Price: ${Number(item.price.$numberDecimal).toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAdd(item)}>Add to Order</Button>
      </CardFooter>
    </Card>
  )
}

