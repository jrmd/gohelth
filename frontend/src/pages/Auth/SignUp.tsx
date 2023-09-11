import { useRef } from 'preact/hooks';
import {useAuth} from "../../helpers";


export const SignUp = () => {
    const userRef = useRef();
    const passRef = useRef();
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
                console.log(user);
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input ref={userRef} type="email" />
            <input ref={passRef}  type="password" />
            <button type="submit">Submit</button>
        </form>
    )
}