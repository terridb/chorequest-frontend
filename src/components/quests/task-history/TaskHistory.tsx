import './TaskHistory.css'
import {useGetTaskHistory} from "../../../hooks/useGetTaskHistory.ts";
import {useDelayedLoading} from "../../../hooks/useDelayedLoading.ts";
import LabeledGroup from "../../ui/labeled-group/LabeledGroup.tsx";
import SettingRow from "../../ui/setting-row/SettingRow.tsx";
import Avatar from "../../ui/avatar/Avatar.tsx";
import Spinner from "../../ui/spinner/Spinner.tsx";
import Button from "../../ui/button/Button.tsx";
import {formatShortDate} from "../../../utils/date.ts";

function TaskHistory({taskId}: { taskId: string }) {
    const {data: history, isLoading, isError, refetch} = useGetTaskHistory(taskId);
    const showSpinner = useDelayedLoading(isLoading);

    return (
        <LabeledGroup label='History'>
            {isLoading ? (
                <div className='panel task-history-status'>
                    {showSpinner && <Spinner/>}
                </div>
            ) : isError || !history ? (
                <div className='panel task-history-status'>
                    <p>Something went wrong loading the history.</p>
                    <Button
                        variant='secondary'
                        type='button'
                        size='small'
                        onClick={() => refetch()}
                    >
                        Try again
                    </Button>
                </div>
            ) : history.length === 0 ? (
                <div className='panel task-history-status'>
                    <p>Nobody has done this quest yet.</p>
                </div>
            ) : (
                <div className='panel'>
                    {history.map(completion => {
                        const name = completion.member.user?.firstName ?? 'Former housemate';

                        return (
                            <SettingRow
                                key={completion.id}
                                title={name}
                                subtitle={formatShortDate(new Date(completion.completedAt))}
                                icon={<Avatar src={completion.member.user?.avatarUrl} name={name}
                                              seed={completion.member.id}/>}
                            >
                                <p className='task-history-points'>+{completion.rewardedPoints}</p>
                            </SettingRow>
                        );
                    })}
                </div>
            )}
        </LabeledGroup>
    );
}

export default TaskHistory;
