import React, { useState } from "react";

import { cn } from "@/lib/utils";



import { Link, route } from 'preact-router';
import { useAuth } from '@/helpers';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ViewVerticalIcon } from "@radix-ui/react-icons";

export function NavigationDropdown() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Fitness</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-2 gap-3 p-6 md:w-[500px]">
              <ListItem href="/workouts" title="Workouts">
                View your workout log
              </ListItem>
              <ListItem href="/workouts/create" title="New Workout">
                Create a new workout
              </ListItem>
              <ListItem href="/routines" title="Routines">
                View your routines
              </ListItem>
              <ListItem href="/routines/create" title="New Workout">
                Create a new routine
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

interface MobileLinkProps extends preact.JSX.HTMLAttributes<HTMLAnchorElement> {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        route(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function MainNav() {
  return (
    <div className="mr-4">
      <Link href="/app" className="mr-6 flex items-center space-x-2">
        <img
          width={24}
          height={24}
          src="/assets/logo.svg"
          className="h-6 w-6"
          alt="Helth.lol logo, a mixture of dark greens in a wavy pattern with the letter H in the middle"
        />
        <span className="hidden font-bold sm:inline-block">Helth.lol</span>
      </Link>
      <NavigationDropdown />
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, clearAuth } = useAuth();
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="ml-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <ViewVerticalIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="pr-0">
          <MobileLink
            href="/"
            className="flex items-center"
            onOpenChange={setOpen}
          >
            <img
              width={24}
              height={24}
              src="/assets/logo.svg"
              className="h-6 w-6"
              alt="Helth.lol logo, a mixture of dark greens in a wavy pattern with the letter H in the middle"
            />
            <span className="hidden font-bold sm:inline-block">Helth.lol</span>
          </MobileLink>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            {!!user && (
              <>
                <div className="flex flex-col space-y-3">
                  <MobileLink href="/" onOpenChange={setOpen}>
                    Dashboard
                  </MobileLink>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-3 pt-6">
                    <h4 className="font-medium">Workouts</h4>
                    <MobileLink
                      href="/workouts"
                      onOpenChange={setOpen}
                      className="text-muted-foreground"
                    >
                      Workout Log
                    </MobileLink>
                    <MobileLink
                      href="/workouts/create"
                      onOpenChange={setOpen}
                      className="text-muted-foreground"
                    >
                      Create Workout
                    </MobileLink>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-3 pt-6">
                    <h4 className="font-medium">Routines</h4>
                    <MobileLink
                      href="/routines"
                      onOpenChange={setOpen}
                      className="text-muted-foreground"
                    >
                      My Routines
                    </MobileLink>
                    <MobileLink
                      href="/routines/create"
                      onOpenChange={setOpen}
                      className="text-muted-foreground"
                    >
                      Create Routine
                    </MobileLink>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-3 pt-6">
                    <h4 className="font-medium">Account</h4>
                    <MobileLink
                      href="/settings/profile"
                      onOpenChange={setOpen}
                      className="text-muted-foreground"
                    >
                      Profile
                    </MobileLink>
                    <MobileLink
                      href="/settings/preferences"
                      onOpenChange={setOpen}
                      className="text-muted-foreground"
                    >
                      Preferences
                    </MobileLink>
                    {/* <hr className="mr-12" /> */}
                    <Button
                      onClick={() => void clearAuth()}
                      className="inline h-[auto] bg-transparent p-0 text-left text-muted-foreground hover:bg-transparent"
                    >
                      Sign out
                    </Button>
                  </div>
                </div>
              </>
            )}
            {!!user && (
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => void route('/auth/sign-in')}
                  className="inline h-[auto] bg-transparent p-0 text-left text-muted-foreground hover:bg-transparent"
                >
                  Sign In
                </Button>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
