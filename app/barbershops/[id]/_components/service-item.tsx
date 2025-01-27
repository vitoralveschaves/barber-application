"use client"

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBooking } from "../_actions/get-day-bookings";

interface ServiceItemProps {
  service: Service,
  barbershop: Barbershop
  isAuthenticated: boolean
}

const ServiceItem = ({ service, barbershop, isAuthenticated }: ServiceItemProps) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>()
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!date) return
    const refleshAvaliableBookings = async () => {
      const bookingsDay = await getDayBooking(barbershop.id, date)
      setDayBookings(bookingsDay)
    }
    refleshAvaliableBookings()
  }, [date, barbershop.id]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date)
    setHour(undefined)
  }

  const handleHourClick = (time: string) => {
    setHour(time)
  }

  const timeList = useMemo(() => {
    if (!date) return []

    return generateDayTimeList(date).filter((time) => {
      const dateHour = Number(time.split(":")[0])
      const dateMinutes = Number(time.split(":")[1])
      const bookings = dayBookings.find(booking => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();
        return bookingHour === dateHour && bookingMinutes === dateMinutes
      })
      if (!bookings) return true
      return false
    })
  }, [date, dayBookings])

  const handleBookingClick = async () => {
    if (!isAuthenticated) {
      return await signIn();
    }
  }

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true)
    try {
      if (!date || !hour || !data?.user) return
      const dateHour = Number(hour.split(":")[0])
      const dateMinutes = Number(hour.split(":")[1])
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes)
      await saveBooking({
        barbershopId: barbershop.id,
        serviceId: service.id,
        userId: (data.user as any).id,
        date: newDate
      });

      setSheetIsOpen(false)
      setHour(undefined)
      setDate(undefined)
      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "dd 'de' MMMM", { locale: ptBR }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      })

    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-3 w-full">
        <div className="flex gap-4 items-center w-full">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              style={{ objectFit: "contain" }}
              className="opacity-75 rounded-lg"
            />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(service.price))}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant={'secondary'}
                    onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0 w-full flex flex-col justify-between">
                  <div>
                    <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                      <SheetTitle>Fazer reserva</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateClick}
                        fromDate={addDays(new Date(), 1)}
                        locale={ptBR}
                        styles={{
                          head_cell: {
                            width: "100%",
                            textTransform: "capitalize"
                          },
                          cell: {
                            width: "100%"
                          },
                          button: {
                            width: "100%"
                          },
                          nav_button_previous: {
                            width: "32px",
                            height: "32px"
                          },
                          nav_button_next: {
                            width: "32px",
                            height: "32px"
                          },
                          caption: {
                            textTransform: "capitalize"
                          }
                        }}
                      />
                    </div>
                    {date && (
                      <div className="py-6 px-5 gap-3 border-t border-solid border-secondary flex overflow-x-auto no-scrollbar">
                        {timeList.map((time) => (
                          <Button
                            onClick={() => handleHourClick(time)}
                            key={time}
                            variant={hour === time ? "default" : "outline"}
                            className="rounded-full">
                            {time}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="py-6 px-5 border-t border-solid border-secondary">
                      <Card>
                        <CardContent className="p-3 flex flex-col gap-3">
                          <div className="flex justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <h3 className="font-bold text-sm">
                              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(service.price))}
                            </h3>
                          </div>
                          {date && (
                            <div className="flex justify-between">
                              <h3 className="text-gray-400">Data</h3>
                              <h4 className="text-sm text-gray-400">
                                {format(date, "dd 'de' MMMM", { locale: ptBR })}
                              </h4>
                            </div>
                          )}
                          {hour && (
                            <div className="flex justify-between">
                              <h3 className="text-gray-400">Horário</h3>
                              <h4 className="text-sm text-gray-400">{hour}</h4>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <h3 className="text-gray-400">Barbearia</h3>
                            <h4 className="text-sm text-gray-400">{barbershop.name}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <SheetFooter className="px-5 py-6">
                    <Button disabled={!date || !hour || submitIsLoading} onClick={handleBookingSubmit}>
                      {submitIsLoading && (
                        <Loader2 className="animate-spin" />
                      )}
                      Confirmar reservar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default ServiceItem;