import { prisma } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { auth } from "@/app/_lib/auth";

interface BarbershopDetailsProps {
  params: {
    id?: string
  }
}

const BarbershopDetails = async ({ params }: BarbershopDetailsProps) => {

  const session = await auth();

  if (!params.id) {
    return null
  }

  const barbershop = await prisma.barbershop.findUnique({
    where: {
      id: params.id
    },
    include: {
      services: true
    }
  })

  if (!barbershop) {
    return null;
  }

  return (
    <div className="max-w-[1440px] mx-auto md:w-full md:p-5">
      <BarbershopInfo barbershop={barbershop} />
      <div className="px-5 py-6 md:px-0 flex flex-col gap-4 md:gap-5 md:grid md:grid-cols-2">
        {barbershop.services.map((service) => (
          <ServiceItem key={service.id} service={service} barbershop={barbershop} isAuthenticated={!!session?.user} />
        ))}
      </div>
    </div>
  )
}
export default BarbershopDetails;