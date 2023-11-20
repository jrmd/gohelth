import { Link, useRouter } from 'preact-router';
import { SettingsDropdown } from "@/components/settings";
import { MobileNav } from "@/components/navigation";

export function Header() {
    const [ctx] = useRouter();

    if (['/auth/sign-in', '/auth/sign-up'].includes(ctx.url)) {
        return null;
    }

    return (
        <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
            <div className="container flex h-14 items-center">
                <Link href="/" className="mr-4 flex">
                    <img
                        width={24}
                        height={24}
                        src="/assets/logo.svg"
                        alt="Helth.lol logo, a mixture of dark greens in a wavy pattern with the letter H in the middle"
                    />
                    <span className="hidden font-bold sm:inline-block ml-2">Helth.lol</span>
                </Link>
                <div className="flex w-full">
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <nav className="flex items-center">
                            <SettingsDropdown />
                            <MobileNav />
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
