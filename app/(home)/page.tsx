import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { prisma } from "../_lib/prisma";
import BarberShopItem from "./_components/barbershop-item";
import { auth } from "../_lib/auth";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/ui/carousel"

export default async function Home() {

  const session = await auth();

  const barbershops = await prisma.barbershop.findMany({});

  const bookings = session?.user ? await prisma.booking.findMany({
    where: {
      userId: (session.user as any).id
    },
    include: {
      service: true,
      barbershop: true
    }
  }) : []

  return (
    <div className="max-w-[1440px] mx-auto md:flex md:flex-col md:justify-center">
      <div className="flex flex-col md:flex-row md:gap-10">
        <div className="md:max-w-[600px] md:min-w-[600px]">
          <div className="px-5 pt-5">
            <h2 className="text-xl font-bold">{session?.user ? `Olá, ${session.user.name?.split(" ")[0]}!` : "Vamos agendar um corte?"}</h2>
            <p className="capitalize text-sm">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <div className="px-5 mt-6 md:hidden">
            <Search />
          </div>
          {bookings.filter(booking => isFuture(booking.date)).length > 0 ?
            <div className="mt-6">
              <h2 className="text-sm mb-3 font-semibold text-gray-400 pl-5">Agendamentos</h2>
              <div className="flex gap-3 md:gap-5 overflow-x-auto no-scrollbar px-5">
                {bookings.filter(booking => isFuture(booking.date)).map(booking => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
            :
            <div className="mt-6 hidden md:block">
              <h2 className="text-lg mb-3 font-semibold text-gray-400 pl-5">Você ainda não possui agendamentos.</h2>
            </div>
          }
        </div>
        <div className="mt-6 md:max-w-[780px]">
          <h2 className="px-5 text-sm mb-3 font-semibold text-gray-400">Recomendados</h2>
          <Carousel>
            <CarouselContent className="px-5">
              {barbershops.map((barbershop) => (
                <CarouselItem key={barbershop.id} className="min-w-[180px] max-w-[180px] md:min-w-[250px] md:max-w-[250px]">
                  <BarberShopItem barbershop={barbershop} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-14 w-14 left-[-16px] px-5 hidden md:flex" />
            <CarouselNext className="h-14 w-14 right-[-16px] px-5 hidden md:flex" />
          </Carousel>

        </div>
      </div>
      <div className="mt-6 mb-[3.5rem] md:pr-5">
        <h2 className="px-5 text-sm mb-3 font-semibold text-gray-400">Populares</h2>
        <Carousel>
          <CarouselContent className="px-5">
            {barbershops.map((barbershop) => (
              <CarouselItem key={barbershop.id} className="min-w-[180px] max-w-[180px] md:min-w-[250px] md:max-w-[250px]">
                <BarberShopItem barbershop={barbershop} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-14 w-14 left-[-16px] px-5 hidden md:flex" />
          <CarouselNext className="h-14 w-14 right-[-16px] px-5 hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
}
