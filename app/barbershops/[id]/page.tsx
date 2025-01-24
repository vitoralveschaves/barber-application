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
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className="px-5 py-6 flex flex-col gap-4">
        {barbershop.services.map((service) => (
          <ServiceItem key={service.id} service={service} barbershop={barbershop} isAuthenticated={!!session?.user} />
        ))}
      </div>
    </div>
  )
}
export default BarbershopDetails;