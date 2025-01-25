import Header from "../_components/header";
import { auth } from "../_lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";
import { isFuture, isPast } from "date-fns";

const BookingsPage = async () => {

  const session = await auth();

  if (!session?.user) return redirect("/")

  const bookings = await prisma.booking.findMany({
    where: {
      userId: (session.user as any).id
    },
    include: {
      service: true,
      barbershop: true
    }
  })

  const confimedBookings = bookings.filter(booking => isFuture(booking.date));

  const pastBookings = bookings.filter(booking => isPast(booking.date));

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        {confimedBookings.length > 0 && (
          <>
            <h1 className="text-xl font-bold">Agendamentos</h1>
            <h2 className="text-gray-400 font-bold uppercase text-sm mt-6 mb-3">Confirmados</h2>
            <div className="flex flex-col gap-3">
              {confimedBookings.map(booking => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

        {pastBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 font-bold uppercase text-sm mt-6 mb-3">Finalizados</h2>
            <div className="flex flex-col gap-3">
              {pastBookings.map(booking => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

      </div>
    </>
  )
}
export default BookingsPage;