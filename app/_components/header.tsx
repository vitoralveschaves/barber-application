"use client"

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarIcon, LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";
import Link from "next/link";
import Search from "../(home)/_components/search";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";

const Header = () => {
  const { data } = useSession();

  const handleLoginClick = async () => {
    await signIn();
  }

  const handleLogoutClick = async () => {
    await signOut();
  }

  return (
    <Card>
      <CardContent className="px-5 py-5 md:py-7 flex items-center justify-between max-w-[1440px] mx-auto md:gap-10">
        <Link href="/">
          <div className="relative h-[22px] w-[120px]">
            <Image src={"/logo.png"} alt="logo" fill />
          </div>
        </Link>
        <div className="hidden md:block md:w-full">
          <Search defaultValues={{ search: "" }} />
        </div>
        <div className="hidden md:flex">
          {data?.user ? (
            <div className="flex justify-between items-center gap-6">
              <div>
                <Link href={"/bookings"} className="flex items-center gap-2 text-sm">
                  <CalendarIcon size={18} className="mr-1" />
                  Agendamentos
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="size-7">
                  <AvatarImage src={data.user?.image ?? ""} />
                </Avatar>
                <h2 className="font-bold text-sm">{data.user?.name}</h2>
              </div>
              <Button variant={"secondary"} size={"icon"} onClick={handleLogoutClick}>
                <LogOutIcon className="size-5" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant={"secondary"} className="w-full justify-start h-9" onClick={handleLoginClick}>
                <LogInIcon className="mr-2" size={18} />
                Faça seu login
              </Button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="h-9 w-9">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0">
              <SideMenu />
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  )
}

export default Header;