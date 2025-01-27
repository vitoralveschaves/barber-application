"use client"

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarberShopItemProps {
  barbershop: Barbershop;
}

const BarberShopItem = ({ barbershop }: BarberShopItemProps) => {

  const route = useRouter();

  const handleBookingClick = () => {
    route.push(`/barbershops/${barbershop.id}`);
  }

  return (
    <Card className="min-w-full max-w-full rounded-2xl">
      <CardContent className="p-0">
        <div className="relative w-full h-[160px]">
          <div className="absolute top-2 left-2 z-50">
            <Badge variant={"secondary"} className="opacity-85 flex items-center gap-1">
              <StarIcon size={14} className="text-primary fill-primary" />
              <span className="text-xs">5,0</span>
            </Badge>
          </div>
          <Image src={barbershop.imageUrl} alt={barbershop.name} style={{ objectFit: "cover" }} fill className="rounded-2xl" />
        </div>
        <div className="px-3 pb-3">
          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">{barbershop.name}</h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">{barbershop.address}</p>
          <Button className="w-full mt-3" variant={'secondary'} onClick={handleBookingClick}>Reservar</Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default BarberShopItem;