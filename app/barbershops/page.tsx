import { redirect } from "next/navigation";
import BarberShopItem from "../(home)/_components/barbershop-item";
import Header from "../_components/header";
import { prisma } from "../_lib/prisma"
import Search from "../(home)/_components/search";

interface BarbershopsPageProps {
  searchParams: {
    search?: string
  }
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {

  if (!searchParams.search) {
    return redirect("/")
  }

  const barbershops = await prisma.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive"
      }
    }
  });

  return (
    <>
      <Header />
      <div className="p-5">
        <Search defaultValues={{ search: searchParams.search }} />
      </div>
      <div className="p-5">
        <h1 className="text-gray-400 font-bold text-xs uppercase">Resultados para &quot;{searchParams.search}&quot;</h1>
        <div className="grid grid-cols-2 mt-4 gap-4">
          {barbershops.map(barbershop => (
            <BarberShopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </>
  )
}
export default BarbershopsPage;