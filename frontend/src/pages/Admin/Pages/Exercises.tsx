import { useTitle } from "hoofd";
import { useEffect, useState } from "preact/hooks";
import {Table, TableBody, TableDefinition, TableHead, TableHeading, TableRow} from "../../../components/Table";

const displayExercise = (cats, level = 0) => (
    <Table>
        <TableHead>
            {/*<TableHeading>ID</TableHeading>*/}
            <TableHeading>Name</TableHeading>
            {/*<TableHeading>Supports Weight</TableHeading>*/}
            {/*<TableHeading>Supports Time</TableHeading>*/}
            {/*<TableHeading>Supports Distance</TableHeading>*/}
            <TableHeading>Categories</TableHeading>
            <TableHeading>Primary Muscles</TableHeading>
            <TableHeading>Secondary Muscles</TableHeading>
            <TableHeading>Level</TableHeading>
            <TableHeading>Force</TableHeading>
            <TableHeading>Mechanic</TableHeading>
            <TableHeading>Equipment</TableHeading>
            <TableHeading>Public</TableHeading>
        </TableHead>
        <TableBody>

        {cats.map(exercise => {
            return (
                <TableRow>
                    {/*<TableDefinition>{exercise.ID}</TableDefinition>*/}
                    <TableDefinition>{exercise.Name}</TableDefinition>
                    {/*<TableDefinition>{exercise.SupportsWeight ? 'true' : 'false'}</TableDefinition>*/}
                    {/*<TableDefinition>{exercise.SupportsTime ? 'true' : 'false'}</TableDefinition>*/}
                    {/*<TableDefinition>{exercise.SupportsDistance ? 'true' : 'false'}</TableDefinition>*/}
                    <TableDefinition>{exercise.Categories.map(category => category.Name).join(',')}</TableDefinition>
                    <TableDefinition>{exercise.PrimaryMuscles.map(category => category.Name).join(',')}</TableDefinition>
                    <TableDefinition>{exercise.SecondaryMuscles.map(category => category.Name).join(',')}</TableDefinition>
                    <TableDefinition>{exercise.Level}</TableDefinition>
                    <TableDefinition>{exercise.Force}</TableDefinition>
                    <TableDefinition>{exercise.Mechanic}</TableDefinition>
                    <TableDefinition>{exercise.Equipment}</TableDefinition>
                    <TableDefinition>{exercise.Public ? 'Public' : 'Private'}</TableDefinition>
                </TableRow>
            )
        })}
        </TableBody>
    </Table>
);

export const Exercises = () => {
    useTitle("Exercises");
    const [exercises, setExercises] = useState([]);

    const fetchExercises = async () => {
        const resp = await fetch('/api/v1/exercise?page=-1')
        if (!resp.ok) {
            return;
        }
        const response = await resp.json();

        setExercises((exercises) => {
           return [...exercises, ...response.data]
        });
    }

    useEffect(() => {
        fetchExercises();
    }, [false]);


    return (
        <div className="p-8 pt-6 container">
            <h2 className="text-3xl font-bold tracking-tight">Exercises</h2>
            <div className="my-4">
                {displayExercise(exercises)}
            </div>
        </div>
    )
}