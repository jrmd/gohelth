import './style.css';
import { useEffect, useState } from "preact/hooks";

import { useTitle } from "hoofd";

export function Home() {
	useTitle('Home');
	const [stats, setStats] = useState(false);

    const getStats = async () => {
        const resp = await fetch('/api/v1/user/stats')
        if (!resp.ok) {
            return;
        }

        const stats = await resp.json();
        setStats(stats);
    }

    useEffect(() => {
        void getStats();
    }, []);

	return (
		<div className="p-8 pt-6 container">
			<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			<div className="my-4">
				<div className="grid grid-cols-4 gap-2 w-full">
					<div className="rounded-xl border bg-card text-card-foreground shadow">
						<div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
							<h3 className="tracking-tight text-sm font-medium">Workouts</h3>
						</div>
						<div className="p-6 pt-0">
							<div className="text-2xl font-bold">{stats.workouts ?? '-'}</div>
							{/*<p className="text-xs text-muted-foreground">+20.1% from last month</p>*/}
						</div>
					</div>
					<div className="rounded-xl border bg-card text-card-foreground shadow">
						<div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
							<h3 className="tracking-tight text-sm font-medium">Routines</h3>
						</div>
						<div className="p-6 pt-0">
							<div className="text-2xl font-bold">{stats.routines ?? '-'}</div>
							{/*<p className="text-xs text-muted-foreground">+20.1% from last month</p>*/}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
