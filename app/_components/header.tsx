import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

const Header = () => {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <Image src={"/logo.png"} alt="logo" width={120} height={22} />
        <Button variant={"outline"} size={"icon"} className="h-9 w-9">
          <MenuIcon />
        </Button>
      </CardContent>
    </Card>
  )
}

export default Header;