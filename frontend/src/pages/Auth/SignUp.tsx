import { useRef, useState } from 'preact/hooks';
import { useAuth } from "../../helpers";
import { Button } from "../../components/Button";
import {Input} from "../../components/Input";
import { useTitle } from "hoofd";

export const SignUp = () => {
    const userRef = useRef();
    const passRef = useRef();
    const [loading, setLoading] = useState<boolean | string>(false);
    const [success, setSuccess] = useState<boolean>(false);
    useTitle("Sign Up");

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const fd = new FormData();
        fd.set("email", userRef.current.value);
        fd.set("password", passRef.current.value);
        try {
            const resp = await fetch("/api/v1/auth/sign-up", {
                method: "POST",
                body: fd,
            });

            const user = await resp.json();

            if (!resp.ok) {
                setSuccess(false);
                setLoading(false);
                return;
            }

            setSuccess(true);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="container relative grid h-[100vh] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col p-10 text-white lg:block ">
                <div
                    className="absolute inset-0 bg-zinc-900 "
                    style={{
                        backgroundSize: "cover",
                        backgroundImage: "url(/assets/workout.jpg)",
                    }}
                />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <img
                        src="/assets/logo.svg"
                        width={32}
                        height={32}
                        alt="Helth.lol"
                        className="mr-2"
                    />
                    Helth.lol
                </div>
                <div className="relative z-20 mt-auto"></div>
            </div>
            <div className="lg:p-8">
                <div className="mb-5 flex items-center justify-center text-lg font-medium lg:hidden">
                    <img
                        src="/assets/logo.svg"
                        width={32}
                        height={32}
                        alt="Helth.lol"
                        className="mr-2"
                    />
                    Helth.lol
                </div>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
                        { !success && (<p className="text-sm text-muted-foreground">
                            Enter your email below to sign up
                        </p>) }
                        {success && (<p>
                            Sign up successful, Check your emails for an activation link!
                        </p>)}
                    </div>
                    { !success && <form
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <Input ref={userRef} className="w-full" placeholder="Email" type="email" />
                            <Input ref={passRef} className="w-full" placeholder="Password" type="password" />
                            <Button type="submit" disabled={loading === true}>
                                {/*{isLoading && (*/}
                                {/*    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />*/}
                                {/*)}*/}
                                Sign up
                            </Button>
                        </div>
                    </form> }
                    {!success && (<p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <a
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </a>
                        .
                    </p>)}
                </div>
            </div>
        </div>
    )
}