import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MenuIcon } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between px-4 border-b bg-white w-screen">
      {/* Left Section: Menu Button and Logo */}
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <MenuIcon className="h-5 w-5 cursor-pointer" />
        </SidebarTrigger>
        <span className="text-xl font-bold">SCN</span>
      </div>

      {/* Right Section: User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Sampath</span>
              <span className="text-xs text-muted-foreground">
                Sampath Cable Network
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
