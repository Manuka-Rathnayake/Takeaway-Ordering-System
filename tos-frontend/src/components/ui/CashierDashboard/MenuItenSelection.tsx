import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { IMenuItem } from '@/types/types'
import { Search } from 'lucide-react'
import api from '@/utils/axios'

interface OrderMenuItemI {
  id: string;
  quantity: number;
}
interface MenuItemSelectionProps {
  items: IMenuItem[];
  onAdd: (item: OrderMenuItemI) => void;
}

export function MenuItemSelection({ items, onAdd }: MenuItemSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.des.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <Card key={item._id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={`${api.defaults.baseURL}${item.imagePath}` || '/placeholder.svg'}
                alt={item.name}
                width={200}
                height={200}
                className="rounded-md object-cover w-full h-40"
              />
              <p className="mt-2 text-sm">{item.des}</p>
              <p className="font-bold mt-2">Price: ${Number(item.price.$numberDecimal).toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => onAdd({ id: item._id, quantity: 1 })} className="w-full bg-red-500 ">
                Add to Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

