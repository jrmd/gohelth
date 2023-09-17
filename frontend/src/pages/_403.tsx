import { useTitle } from 'hoofd';

export function NotAllowed() {
    useTitle('Not Allowed');
    return (
        <section>
            <h1>403: Not Allowed</h1>
            <p>go away</p>
        </section>
    );
}
