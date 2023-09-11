import {useAuth} from "../../helpers";
import { useEffect}  from 'preact/hooks';

export const SignOut = () => {
    const { clearAuth } = useAuth();

    const logout = async () => {
        clearAuth();
        // console.log(clearAuth);
        location.replace("/");
    }

    useEffect(() => {
        logout();
    }, []);

    return (<p>Sign Out</p>)
}