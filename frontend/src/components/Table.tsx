import { cn } from "../helpers/cn";

export const Table = ({ className, children }) => (
    <div className="rounded-md border">
        <div className="w-full overflow-auto">
            <table className={cn("w-full caption-bottom text-sm", className)}>
                {children}
            </table>
        </div>
    </div>
);

export const TableHead = ({ className, children }) => (
    <thead className={cn("[&_tr]:border-b", className)}>
        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {children}
        </tr>
    </thead>
)

export const TableBody = ({ className, children }) => (
    <tbody className={cn("[&_tr:last-child]:border-0", className)}>
        {children}
    </tbody>
)

export const TableRow = ({ className, children }) => (
    <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}>
        {children}
    </tr>
)

export const TableHeading = ({ className, children }) => (
    <th className={cn("min-h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)}>
        {children}
    </th>
)

export const TableDefinition = ({ className, children }) => (
    <td className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)}>
        {children}
    </td>
)
