import './Quests.css'
import Header from "../../components/ui/header/Header.tsx";
import Scorebar from "../../components/goals/score-bar/Scorebar.tsx";
import type {TaskAssignment} from "../../types/task.ts";
import Spinner from "../../components/ui/spinner/Spinner.tsx";
import {useDelayedLoading} from "../../hooks/useDelayedLoading.ts";
import {isDueDateFuture, isDueDatePast, isDueDateToday} from "../../utils/date.ts";
import QuestSection from "../../components/quests/quest-section/QuestSection.tsx";
import type {Goal} from "../../types/goal.ts";
import {useGetCurrentGoal} from "../../hooks/useGetCurrentGoal.ts";
import Button from "../../components/ui/button/Button.tsx";
import {PlusIcon} from "../../components/ui/icons/NavIcons.tsx";
import {useState} from "react";
import BottomSheet from "../../components/ui/bottom-sheet/BottomSheet.tsx";
import QuestForm from "../../components/quests/quest-form/QuestForm.tsx";
import AddGoalForm from "../../components/goals/add-goal-form/AddGoalForm.tsx";
import {useGetAssignments} from "../../hooks/useGetAssignments.ts";
import {useGetHousehold} from "../../hooks/useGetHousehold.ts";

function Quests() {
    const householdId = '33333333-3333-3333-3333-333333333333';

    const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

    const {
        data: assignments,
        isError: isAssignmentsError,
        isLoading: isAssignmentsLoading
    } = useGetAssignments(householdId);

    const {data: household, isLoading: isHouseholdLoading, isError: isHouseholdError} = useGetHousehold(householdId);

    const {data: goal, isLoading: isGoalLoading, isError: isGoalError} = useGetCurrentGoal(householdId);

    const isLoading = isAssignmentsLoading || isHouseholdLoading || isGoalLoading;
    const isError = isAssignmentsError || isHouseholdError;
    const showSpinner = useDelayedLoading(isLoading);

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

    return (
        <>
            <Header title="Quest Board">
                {isGoalError ? (
                    <p>Something went wrong loading your goal.</p>
                ) : goal ? (
                    <>
                        <Scorebar title='House score' goal={goal}/>
                        <p>{calculatePointsToGo(goal)} points to go for {goal.title}</p>
                    </>
                ) : (
                    <Button onClick={() => setIsAddGoalOpen(true)} variant="secondary" className="set-goal-button">
                        <PlusIcon className="button-icon"/>
                        Set a new goal
                    </Button>
                )}

            </Header>
            <main className="quest-board-main outer-container">
                {showSpinner && <Spinner/>}
                {isError && !isLoading &&
                    <p>Something went wrong loading your quests. Please try refreshing the page.</p>
                }
                {!isError && lateAssignments.length > 0 &&
                    <QuestSection
                        assignments={lateAssignments}
                        title='late'
                        danger
                        householdId={householdId}
                        members={household?.members ?? []}
                    />
                }
                {!isError && todayAssignments.length > 0 &&
                    <QuestSection
                        assignments={todayAssignments}
                        title='today'
                        householdId={householdId}
                        members={household?.members ?? []}
                    />
                }
                {!isError && otherAssignments.length > 0 &&
                    <QuestSection
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
                open={isAddGoalOpen}
                onClose={() => setIsAddGoalOpen(false)}
                title='New Goal'
            >
                {household && <AddGoalForm household={household} onCreated={() => setIsAddGoalOpen(false)}/>}
            </BottomSheet>
            <BottomSheet
                open={isAddQuestOpen}
                onClose={() => setIsAddQuestOpen(false)}
                title='New Quest'
            >
                {household && <QuestForm household={household} onSaved={() => setIsAddQuestOpen(false)}/>}
            </BottomSheet>
            <Button className="add-button" onClick={() => setIsAddQuestOpen(true)}>
                <PlusIcon className="add-button-icon"/>
            </Button>
        </>
    );
}

export default Quests;