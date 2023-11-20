import { LifeBuoy, LogOut, Settings, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { route } from "preact-router";

const AuthedDropdown = () => {
  const { clearAuth } = useAuth()
  return (
    <>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>Support</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => void clearAuth()}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </>
  );
}

const UnauthedDropdown = () => (
  <>
    <DropdownMenuItem onClick={() => void route('/auth/sign-in')}>
      <LogIn className="mr-2 h-4 w-4" />
      <span>Log in</span>
    </DropdownMenuItem>
  </>
);

export function SettingsDropdown() {
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hidden w-9 px-0 sm:inline-flex">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {!!user ? (
          <AuthedDropdown />
        ) : (
          <UnauthedDropdown />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
