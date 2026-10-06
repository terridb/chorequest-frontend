import './QuestDetails.css'
import Header from "../../components/header/Header.tsx";
import type {Task} from "../../types/task.ts";
import {Link, useNavigate, useParams} from "react-router";
import Button from "../../components/button/Button.tsx";
import SectionTitle from "../../components/section-title/SectionTitle.tsx";
import {useGetAssignments} from "../../hooks/useGetAssignments.ts";
import {useGetHousehold} from "../../hooks/useGetHousehold.ts";
import {formatDueDate, isDueDatePast} from "../../utils/date.ts";
import Meter from "../../components/meter/Meter.tsx";
import Spinner from "../../components/spinner/Spinner.tsx";
import {useDelayedLoading} from "../../hooks/useDelayedLoading.ts";
import {EFFORT_HINTS, EFFORT_LEVELS} from "../../utils/effort.ts";
import MemberPicker from "../../components/member-picker/MemberPicker.tsx";
import LabeledGroup from "../../components/labeled-group/LabeledGroup.tsx";
import type {AssignmentStrategy} from "../../types/enums.ts";
import SettingRow from "../../components/setting-row/SettingRow.tsx";
import {formatSchedule} from "../../utils/frequency.ts";
import {capitalize} from "../../utils/textUtils.ts";
import type {Household, HouseholdMember} from "../../types/household.ts";
import {useCompleteTask} from "../../hooks/useCompleteTask.ts";
import {useGetTask} from "../../hooks/useGetTask.ts";

const STRATEGY_HINTS: Record<AssignmentStrategy, string> = {
    SOLO: 'Single responsible person',
    ROTATING: 'Takes turns',
};

function determineMembers(task: Task, household: Household): HouseholdMember[] {
    if (task.strategy === 'SOLO') {
        return household.members.filter(member => member.id === task.responsibleMemberId);
    }
    return household.members;
}

function QuestDetails() {
    const {id: taskId} = useParams();
    const navigate = useNavigate();

    const {data: task, isLoading: isTaskLoading, isError: isTaskError} = useGetTask(taskId);
    const {
        data: assignments,
        isLoading: isAssignmentsLoading,
        isError: isAssignmentsError
    } = useGetAssignments(task?.householdId);
    const {
        data: household,
        isLoading: isHouseholdLoading,
        isError: isHouseholdError
    } = useGetHousehold(task?.householdId);
    const completeTask = useCompleteTask(task?.householdId);

    const isLoading = isTaskLoading || isAssignmentsLoading || isHouseholdLoading;
    const isError = isTaskError || isAssignmentsError || isHouseholdError;
    const showSpinner = useDelayedLoading(isLoading);

    const assignment = assignments?.find(item => item.task.id === taskId);

    if (isLoading) {
        return (
            <main className='outer-container quest-details-status'>
                {showSpinner && <Spinner/>}
            </main>
        );
    }

    if (isError || !task || !assignment || !household) {
        return (
            <main className='outer-container quest-details-status'>
                <p>{isError
                    ? 'Something went wrong loading this quest. Please try refreshing the page.'
                    : 'This quest is no longer open.'}
                </p>
                <Link to='/quests'>Back to the quest board</Link>
            </main>
        );
    }

    const isLate = isDueDatePast(assignment.dueDate);
    const members = determineMembers(task, household);
    const assignedMemberId = household.members.find(member => member.user.id === assignment.user.id)?.id;

    const handleComplete = () => {
        if (!assignedMemberId) return;
        completeTask.mutate(
            {assignmentId: assignment.id, completedByMemberId: assignedMemberId},
            {onSuccess: () => navigate('/quests')},
        );
    }

    return (
        <div className='quest-details-page'>
            <Header
                title={task.title}
                toolbar={
                    <>
                        <Link to='/quests' className='header-back'>{'<'} Back</Link>
                        <Button variant='dark' size='small'>Edit</Button>
                    </>
                }
                aside={
                    <>
                        <p className='points'>+{task.defaultPoints}</p>
                        <Meter filled={EFFORT_LEVELS[task.effort]} total={3}/>
                    </>
                }
            >
                <SectionTitle danger={isLate}>
                    {formatDueDate(assignment.dueDate)}
                </SectionTitle>
            </Header>
            <main className='outer-container'>
                <section className='inner-container quest-details'>
                    <LabeledGroup label='Description'>
                        <p>{task.description}</p>
                        <div className='panel'>
                            <SettingRow title='Repeats'>
                                <p>{formatSchedule(task)}</p>
                            </SettingRow>
                            <SettingRow title='Effort'><p>{capitalize(task.effort)} · {EFFORT_HINTS[task.effort]}</p>
                            </SettingRow>
                        </div>
                    </LabeledGroup>
                    <LabeledGroup label='Rotation' hint={STRATEGY_HINTS[task.strategy]}>
                        <MemberPicker members={members} value={assignedMemberId} decorative/>
                    </LabeledGroup>
                </section>
            </main>
            <footer className='action-bar quest-details-actions'>
                {completeTask.isError &&
                    <p className='action-bar-error'>Couldn't complete this quest. Please try again.</p>
                }
                <Button
                    variant='primary'
                    type='button'
                    size='large'
                    onClick={handleComplete}
                    disabled={completeTask.isPending || !assignedMemberId}
                >
                    Mark as done <span className='button-points'>+{task.defaultPoints}</span>
                </Button>
            </footer>
        </div>
    );
}

export default QuestDetails;