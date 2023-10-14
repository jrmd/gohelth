import { useTitle } from "hoofd";
import { useEffect, useState } from "preact/hooks";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "../../../components/Input";
import {Button} from "@/components/ui/button";

const displayUser = (cats, level = 0) => (
    <Table>
        <TableHeader>
            <TableHead>ID</TableHead>
            <TableHead>Display Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>UserLevel</TableHead>
        </TableHeader>
        <TableBody>

        {cats.map(user => {
            return (
                <TableRow>
                    <TableCell>{user.ID}</TableCell>
                    <TableCell>{user.DisplayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.UserStatus}</TableCell>
                    <TableCell>{user.userLevel}</TableCell>
                </TableRow>
            )
        })}
        </TableBody>
    </Table>
);

export const Users = () => {
    useTitle("Users");
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPages, setMaxPage] = useState(1);


    const fetchUsers = async (signal) => {
        try {
            const url = new URL(window.location.origin + '/api/v1/admin/users');
            url.searchParams.set("page", page);

            const resp = await fetch(url.toString(), { signal })
            if (!resp.ok) {
                return;
            }
            const response = await resp.json();

            setUsers(() => {
               return [...response.data]
            });
            setMaxPage(response.maxPages)
        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => {
        const signal = new AbortController()
        void fetchUsers(signal.signal);

        return () => {
            signal.abort()
        }
    }, [page]);

    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Users</h2>
            <div className="my-4">
                <div className="grid grid-cols-4 mb-2">
                    <div>
                        { page > 1 && (
                            <Button onClick={() => {
                                setPage((currentPage) => currentPage - 1)
                            }}>Previous Page</Button>
                        )}
                        { page < maxPages && (
                            <Button onClick={() => {
                                setPage((currentPage) => currentPage + 1)
                            }}>Next Page</Button>
                        )}
                    </div>
                </div>
                {displayUser(users)}
            </div>
        </div>
    )
}