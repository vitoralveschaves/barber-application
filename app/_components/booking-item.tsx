import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true,
      barbershop: true
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
  return (
    <Card className="min-w-[100%]">
      <CardContent className="p-5 flex py-0">
        <div className="flex flex-col gap-2 py-5 flex-[3]">
          <Badge variant={isPast(booking.date) ? "secondary" : "default"} className="w-fit">{isPast(booking.date) ? "Finalizado" : "Confirmado"}</Badge>
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
  )
}
export default BookingItem;