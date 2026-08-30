import './Quests.css'
import Header from "../../components/header/Header.tsx";
import Scorebar from "../../components/score-bar/Scorebar.tsx";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {TaskAssignment} from "../../types/task.ts";
import Spinner from "../../components/spinner/Spinner.tsx";
import {useDelayedLoading} from "../../hooks/useDelayedLoading.ts";
import AddButton from "../../components/add-button/AddButton.tsx";
import type {Household} from "../../types/household.ts";


function Quests() {
    const householdId = '33333333-3333-3333-3333-333333333333';

    const {data: assignments, isLoading: isAssignmentsLoading, isError: isAssignmentsError} = useQuery({
        queryKey: ["assignments", householdId],
        queryFn: () =>
            apiClient.get<TaskAssignment[]>(`/api/households/${householdId}/assignments/open`).then(res => res.data)
    })

    // const {data: household, isLoading: isHouseholdLoading, isError: isHouseholdError} = useQuery({
    //     queryKey: ["household", householdId],
    //     queryFn: () =>
    //         apiClient.get<Household>(`/api/households/${householdId}`).then(res => res.data)
    // })

    // const isLoading = isAssignmentsLoading || isHouseholdLoading;
    // const isError = isAssignmentsError || isHouseholdError;
    // const showSpinner = useDelayedLoading(isLoading);

    console.log('assignments: ', assignments)
    // console.log('household: ', household)

    return (
        <>
            <Header title="Quest Board">
                <Scorebar title='House score'/>
                <p>x blocks to go: GOAL</p>
            </Header>
            <main className="quest-board-main">
                {/*{showSpinner && <Spinner/>}*/}

            </main>

            <AddButton/>
        </>
    );
}

export default Quests;