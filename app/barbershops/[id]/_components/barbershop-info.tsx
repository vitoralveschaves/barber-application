"use client"

import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop } from "@prisma/client";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopInfoProps {
  barbershop: Barbershop
}

const BarbershopInfo = ({ barbershop }: BarbershopInfoProps) => {
  return (
    <div className="md:w-full">
      <div className="h-[250px] w-full md:h-[400px] relative">
        <Image src={barbershop.imageUrl} alt={barbershop.name} fill style={{ objectFit: "cover" }} className="opacity-75 md:rounded-lg" />
      </div>

      <div className="px-5 md:px-0 pt-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl md:text-3xl font-bold">{barbershop.name}</h1>
        <div className="md:flex md:flex-row md:justify-between md:pt-1">
          <div className="flex items-center gap-1 mt-3">
            <MapPinIcon className="text-primary" />
            <p className="text-sm">{barbershop.address}</p>
          </div>

          <div className="flex items-center gap-1 mt-3">
            <StarIcon className="text-primary" />
            <p className="text-sm">5,0 (899 avaliações)</p>
          </div>
        </div>
      </div>

    </div>
  )
}
export default BarbershopInfo;