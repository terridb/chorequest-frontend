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
import {useCurrentHouseholdId} from "../../hooks/useCurrentHouseholdId.ts";
import useCurrentUser from "../../auth/useCurrentUser.ts";
import {useCompleteTask} from "../../hooks/useCompleteTask.ts";

function Quests() {
    const householdId = useCurrentHouseholdId();

    const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<TaskAssignment | null>(null);
    const [isReassignOpen, setIsReassignOpen] = useState(false);

    const {
        data: assignments,
        isError: isAssignmentsError,
        isLoading: isAssignmentsLoading
    } = useGetAssignments(householdId);
    const completeTask = useCompleteTask(householdId);
    const {data: me} = useCurrentUser();

    const {data: household, isLoading: isHouseholdLoading, isError: isHouseholdError} = useGetHousehold(householdId);

    const {data: goal, isLoading: isGoalLoading, isError: isGoalError} = useGetCurrentGoal(householdId);

    const isLoading = isAssignmentsLoading || isHouseholdLoading || isGoalLoading;
    const isError = isAssignmentsError || isHouseholdError;
    const showSpinner = useDelayedLoading(isLoading);

    if (!householdId) {
        return <p>You're not part of a household yet.</p>
    }

    const filterLateAssignments = (assignments: TaskAssignment[]): TaskAssignment[] => {
        return assignments.filter(item => item.dueDate !== null && isDueDatePast(item.dueDate));
    }

    const filterTodayAssignments = (assignments: TaskAssignment[]): TaskAssignment[] => {
        return assignments.filter(item => item.dueDate !== null && isDueDateToday(item.dueDate));
    }

    const filterOtherAssignments = (assignments: TaskAssignment[]): TaskAssignment[] => {
        return assignments.filter(item => item.dueDate !== null && isDueDateFuture(item.dueDate));
    }

    const filterAnytimeAssignments = (assignments: TaskAssignment[]): TaskAssignment[] => {
        return assignments.filter(item => item.dueDate === null);
    }

    const lateAssignments = assignments ? filterLateAssignments(assignments) : [];
    const todayAssignments = assignments ? filterTodayAssignments(assignments) : [];
    const otherAssignments = assignments ? filterOtherAssignments(assignments) : [];
    const anytimeAssignments = assignments ? filterAnytimeAssignments(assignments) : [];
    const hasAssignments = lateAssignments.length > 0 || todayAssignments.length > 0
        || otherAssignments.length > 0 || anytimeAssignments.length > 0;
    const members = household?.members ?? [];
    const currentMemberId = members.find(member => member.user.id === me?.id)?.id;
    const selectedMemberId = members.find(member => member.user.id === selectedAssignment?.user.id)?.id;

    const calculatePointsToGo = (goal: Goal): number => {
        return goal.goalPoints - goal.currentPoints;
    }

    const handleSelectAssignment = (assignment: TaskAssignment) => {
        setSelectedAssignment(assignment);
        setIsReassignOpen(true);
    }

    const handleCloseReassign = () => {
        setIsReassignOpen(false);
    }

    const handleReassignComplete = (completedByMemberId: string | undefined) => {
        if (!selectedAssignment || !completedByMemberId) {
            return;
        }

        completeTask.mutate({assignmentId: selectedAssignment.id, completedByMemberId: completedByMemberId});
        handleCloseReassign();
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
            <main className={`quest-board-main outer-container ${isError || !hasAssignments ? "centered" : ""}`}>
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
                        onSelectAssignment={handleSelectAssignment}
                    />
                }
                {!isError && todayAssignments.length > 0 &&
                    <QuestSection
                        assignments={todayAssignments}
                        title='today'
                        householdId={householdId}
                        members={household?.members ?? []}
                        onSelectAssignment={handleSelectAssignment}
                    />
                }
                {!isError && otherAssignments.length > 0 &&
                    <QuestSection
                        assignments={otherAssignments}
                        title='future'
                        householdId={householdId}
                        members={household?.members ?? []}
                        onSelectAssignment={handleSelectAssignment}
                    />
                }
                {!isError && anytimeAssignments.length > 0 &&
                    <QuestSection
                        assignments={anytimeAssignments}
                        title='anytime'
                        householdId={householdId}
                        members={household?.members ?? []}
                        onSelectAssignment={handleSelectAssignment}
                    />
                }
                {!isError && !isLoading && !hasAssignments && (
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
            <BottomSheet
                open={isReassignOpen}
                onClose={() => handleCloseReassign()}
                title="It's not your turn"
            >
                <div className='reassign-sheet'>
                    <Button
                        variant='secondary'
                        size='large'
                        onClick={() => handleReassignComplete(selectedMemberId)}
                        disabled={!selectedMemberId}
                    >
                        Check task for {selectedAssignment?.user.firstName ?? 'original member'}
                    </Button>
                    <Button
                        variant='primary'
                        size='large'
                        onClick={() => handleReassignComplete(currentMemberId)}
                        disabled={!currentMemberId}
                    >
                        I took over the task
                    </Button>
                </div>
            </BottomSheet>
            <Button className="add-button" onClick={() => setIsAddQuestOpen(true)}>
                <PlusIcon className="add-button-icon"/>
            </Button>
        </>
    );
}

export default Quests;