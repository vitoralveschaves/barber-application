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
      <div className="p-5 md:hidden">
        <Search defaultValues={{ search: searchParams.search }} />
      </div>
      <div className="p-5 max-w-[1440px] mx-auto md:flex md:flex-col md:justify-start md:w-full">
        <h1 className="text-gray-400 font-bold text-xs md:text-lg md:capitalize uppercase">Resultados para &quot;{searchParams.search}&quot;</h1>
        <div className="grid grid-cols-2 mt-4 md:mt-6 gap-4 md:gap-5 md:flex md:flex-row md:flex-wrap">
          {barbershops.map(barbershop => (
            <div key={barbershop.id} className="md:min-w-[250px] md:max-w-[250px]">
              <BarberShopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default BarbershopsPage;