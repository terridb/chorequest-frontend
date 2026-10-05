import './Quests.css'
import Header from "../../components/header/Header.tsx";
import Scorebar from "../../components/score-bar/Scorebar.tsx";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../api/client.ts";
import type {TaskAssignment} from "../../types/task.ts";
import Spinner from "../../components/spinner/Spinner.tsx";
import {useDelayedLoading} from "../../hooks/useDelayedLoading.ts";
import type {Household} from "../../types/household.ts";
import {isDueDateFuture, isDueDatePast, isDueDateToday} from "../../utils/date.ts";
import CardSection from "../../components/card-section/CardSection.tsx";
import type {Goal} from "../../types/goal.ts";
import Button from "../../components/button/Button.tsx";
import {PlusIcon} from "../../components/icons/NavIcons.tsx";
import {useState} from "react";
import BottomSheet from "../../components/bottom-sheet/BottomSheet.tsx";
import AddQuestForm from "../../components/add-quest-form/AddQuestForm.tsx";

function Quests() {
    const householdId = '33333333-3333-3333-3333-333333333333';

    const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);

    const {data: assignments, isLoading: isAssignmentsLoading, isError: isAssignmentsError} = useQuery({
        queryKey: ["assignments", householdId],
        queryFn: () =>
            apiClient.get<TaskAssignment[]>(`/api/households/${householdId}/assignments/open`).then(res => res.data)
    })

    const {data: household, isLoading: isHouseholdLoading, isError: isHouseholdError} = useQuery({
        queryKey: ["household", householdId],
        queryFn: () =>
            apiClient.get<Household>(`/api/households/${householdId}`).then(res => res.data)
    })

    const {data: goal, isLoading: isGoalLoading, isError: isGoalError} = useQuery({
        queryKey: ["goal", householdId],
        queryFn: () =>
            apiClient.get<Goal>(`/api/households/${householdId}/goals/current`).then(res => res.data)
    })

    const isLoading = isAssignmentsLoading || isHouseholdLoading || isGoalLoading;
    const isError = isAssignmentsError || isHouseholdError || isGoalError;
    const showSpinner = useDelayedLoading(isLoading);

    console.log('assignments: ', assignments)
    console.log('household: ', household)
    console.log('goal: ', goal)


    const filterLateAssignments = (assignments: TaskAssignment[]): TaskAssignment[] => {
        return assignments.filter(item => isDueDatePast(item.dueDate));
    }

    const filterTodayAssignments = (assignments: TaskAssignment[]): TaskAssignment[] => {
        return assignments.filter(item => isDueDateToday(item.dueDate));
    }

    const filterOtherAssignments = (assignments: TaskAssignment[]): TaskAssignment[] => {
        return assignments.filter(item => isDueDateFuture(item.dueDate));
    }

    const lateAssignments = assignments ? filterLateAssignments(assignments) : [];
    const todayAssignments = assignments ? filterTodayAssignments(assignments) : [];
    const otherAssignments = assignments ? filterOtherAssignments(assignments) : [];

    const calculatePointsToGo = (goal: Goal): number => {
        return goal.goalPoints - goal.currentPoints;
    }

    const handleSetGoal = () => {
        // TODO: wire up goal creation flow
    }

    return (
        <>
            <Header title="Quest Board">
                {goal ?
                    <>
                        <Scorebar title='House score' goal={goal}/>
                        <p>{calculatePointsToGo(goal)} points to go for {goal.title}</p>
                    </> : <>
                        <Button onClick={handleSetGoal} variant="secondary" className="set-goal-button">
                            <PlusIcon className="button-icon"/>
                            Set a new goal
                        </Button>
                    </>
                }

            </Header>
            <main className="quest-board-main outer-container">
                {showSpinner && <Spinner/>}
                {isError && !isLoading &&
                    <p>Something went wrong loading your quests. Please try refreshing the page.</p>
                }
                {!isError && lateAssignments.length > 0 &&
                    <CardSection
                        assignments={lateAssignments}
                        title='late'
                        householdId={householdId}
                        members={household?.members ?? []}
                    />
                }
                {!isError && todayAssignments.length > 0 &&
                    <CardSection
                        assignments={todayAssignments}
                        title='today'
                        householdId={householdId}
                        members={household?.members ?? []}
                    />
                }
                {!isError && otherAssignments.length > 0 &&
                    <CardSection
                        assignments={otherAssignments}
                        title='future'
                        householdId={householdId}
                        members={household?.members ?? []}
                    />
                }
                {!isError && otherAssignments.length <= 0 && lateAssignments.length <= 0 && todayAssignments.length <= 0 && (
                    <p>No assignments added yet.</p>
                )}
            </main>
            <BottomSheet
                open={isAddQuestOpen}
                onClose={() => setIsAddQuestOpen(false)}
                title='New Quest'
            >
                {household && <AddQuestForm household={household} onCreated={() => setIsAddQuestOpen(false)}/>}
            </BottomSheet>
            <Button className="add-button" onClick={() => setIsAddQuestOpen(true)}>
                <PlusIcon className="add-button-icon"/>
            </Button>
        </>
    );
}

export default Quests;