import { format, isFuture } from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { prisma } from "../_lib/prisma";
import BarberShopItem from "./_components/barbershop-item";
import { auth } from "../_lib/auth";

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
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">{session?.user ? `Olá, ${session.user.name?.split(" ")[0]}!` : "Vamos agendar um corte?"}</h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      {bookings.filter(booking => isFuture(booking.date)).length > 0 &&
        <div className="mt-6">
          <h2 className="text-sm mb-3 font-semibold text-gray-400 pl-5">Agendamentos</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
            {bookings.filter(booking => isFuture(booking.date)).map(booking => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      }

      <div className="mt-6">
        <h2 className="px-5 text-sm mb-3 font-semibold text-gray-400">Recomendados</h2>
        <div className="flex px-5 overflow-x-scroll gap-4 no-scrollbar">
          {barbershops.map((barbershop) => (
            <BarberShopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>


      <div className="mt-6 mb-[3.5rem]">
        <h2 className="px-5 text-sm mb-3 font-semibold text-gray-400">Populares</h2>
        <div className="flex px-5 overflow-x-scroll gap-4 no-scrollbar">
          {barbershops.map((barbershop) => (
            <BarberShopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

    </div>
  );
}
