"use client"

import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true,
      barbershop: true
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleCancelBooking = async () => {
    setIsDeleteLoading(true);
    try {
      await cancelBooking(booking.id);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-[100%]">
          <CardContent className="p-5 flex py-0">
            <div className="flex flex-col gap-2 py-5 flex-[3]">
              <Badge
                variant={isPast(booking.date) ? "secondary" : "default"}
                className="w-fit">
                {isPast(booking.date) ? "Finalizado" : "Confirmado"}
              </Badge>
              <h2>{booking.service.name}</h2>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-solid border-l border-secondary pl-6 pr-2 flex-[1]">
              <p className="text-sm capitalize">{format(booking.date, "MMMM", { locale: ptBR })}</p>
              <p className="text-2xl">{format(booking.date, "dd", { locale: ptBR })}</p>
              <p className="text-sm">{format(booking.date, "hh:mm", { locale: ptBR })}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-full px-0">
        <SheetHeader className="text-left pb-6 border-b border-solid border-secondary px-5">
          <SheetTitle>Informações da reserva</SheetTitle>
        </SheetHeader>
        <div className="px-5">
          <div className="relative w-full h-[180px] mt-6">
            <Image src="/barbershop-map.png" alt="map" fill style={{ objectFit: "contain" }} className="opacity-75" />
            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card>
                <CardContent className="p-3 flex gap-2">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>
                  <div>
                    <h2 className="font-bold">{booking.barbershop.name}</h2>
                    <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">{booking.barbershop.address}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Badge
            variant={isPast(booking.date) ? "secondary" : "default"}
            className="w-fit my-4">
            {isPast(booking.date) ? "Finalizado" : "Confirmado"}
          </Badge>
          <Card>
            <CardContent className="p-3 flex flex-col gap-3">
              <div className="flex justify-between">
                <h2 className="font-bold">{booking.service.name}</h2>
                <h3 className="font-bold text-sm">
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(booking.service.price))}
                </h3>
              </div>
              <div className="flex justify-between">
                <h3 className="text-gray-400">Data</h3>
                <h4 className="text-sm text-gray-400">
                  {format(booking.date, "dd 'de' MMMM", { locale: ptBR })}
                </h4>
              </div>
              <div className="flex justify-between">
                <h3 className="text-gray-400">Horário</h3>
                <h4 className="text-sm text-gray-400">{format(booking.date, "hh:mm", { locale: ptBR })}</h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-gray-400">Barbearia</h3>
                <h4 className="text-sm text-gray-400">{booking.barbershop.name}</h4>
              </div>
            </CardContent>
          </Card>

          <SheetFooter className="flex-row gap-3 mt-6">
            <SheetClose asChild>
              <Button variant={"secondary"} className="w-full">Voltar</Button>
            </SheetClose>
            <Button
              onClick={handleCancelBooking}
              disabled={isPast(booking.date) || isDeleteLoading}
              variant={"destructive"}
              className="w-full">
              {isDeleteLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Cancelar reserva
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
export default BookingItem;