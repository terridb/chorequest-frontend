import './RepeatPicker.css'
import {useState} from "react";
import type {Frequency} from "../../types/enums.ts";
import {
    type FrequencyUnit,
    type RepeatingFrequency,
    formatRecurrence,
    getFrequenciesForUnit,
    getFrequencySchedule,
    isRepeatingFrequency,
} from "../../utils/frequency.ts";
import {formatDayAndMonth, formatDayOfMonth, formatShortDate, formatWeekday, parseLocalDate} from "../../utils/date.ts";
import SegmentedControl from "../segmented-control/SegmentedControl.tsx";
import ChipGroup from "../chip-group/ChipGroup.tsx";
import SettingRow from "../setting-row/SettingRow.tsx";
import DateInput from "../date-input/DateInput.tsx";
import Toggle from "../toggle/Toggle.tsx";

const REPEAT_MODE_OPTIONS = [
    {value: 'AS_NEEDED', label: 'As needed'},
    {value: 'ONCE', label: 'Once'},
    {value: 'REPEATS', label: 'Repeats'},
] as const;

type RepeatMode = typeof REPEAT_MODE_OPTIONS[number]['value'];

const FREQUENCY_UNIT_OPTIONS = [
    {value: 'DAYS', label: 'Days'},
    {value: 'WEEKS', label: 'Weeks'},
    {value: 'MONTHS', label: 'Months'},
    {value: 'YEARS', label: 'Years'},
] as const satisfies readonly { value: FrequencyUnit, label: string }[];

function formatSameDayHint(unit: FrequencyUnit, date: Date): string {
    switch (unit) {
        case 'MONTHS':
            return `Always lands on the ${formatDayOfMonth(date)}`;
        case 'YEARS':
            return `Always lands on ${formatDayAndMonth(date)}`;
        default:
            return `Always lands on a ${formatWeekday(date)}`;
    }
}

interface RepeatPickerProps {
    frequency: Frequency;
    startingDate: string;
    alwaysSameDay: boolean;
    onFrequencyChange: (frequency: Frequency) => void;
    onStartingDateChange: (startingDate: string) => void;
    onAlwaysSameDayChange: (alwaysSameDay: boolean) => void;
}

function RepeatPicker({
                          frequency,
                          startingDate,
                          alwaysSameDay,
                          onFrequencyChange,
                          onStartingDateChange,
                          onAlwaysSameDayChange,
                      }: RepeatPickerProps) {
    // Remembers the chosen schedule so switching to "As needed" and back to "Repeats" restores it
    const [lastRepeatingFrequency, setLastRepeatingFrequency] = useState<RepeatingFrequency>(
        isRepeatingFrequency(frequency) ? frequency : 'DAILY'
    );

    const repeatMode: RepeatMode = isRepeatingFrequency(frequency) ? 'REPEATS' : frequency;

    function selectRepeatingFrequency(value: RepeatingFrequency) {
        setLastRepeatingFrequency(value);
        onFrequencyChange(value);
    }

    function handleRepeatModeChange(mode: RepeatMode) {
        onFrequencyChange(mode === 'REPEATS' ? lastRepeatingFrequency : mode);
    }

    return (
        <div className='repeat-picker'>
            <SegmentedControl options={REPEAT_MODE_OPTIONS} value={repeatMode} onChange={handleRepeatModeChange}/>
            {isRepeatingFrequency(frequency) && (
                <RepeatSchedule
                    frequency={frequency}
                    startingDate={startingDate}
                    alwaysSameDay={alwaysSameDay}
                    onFrequencyChange={selectRepeatingFrequency}
                    onStartingDateChange={onStartingDateChange}
                    onAlwaysSameDayChange={onAlwaysSameDayChange}
                />
            )}
        </div>
    );
}

function RepeatSchedule({
                            frequency,
                            startingDate,
                            alwaysSameDay,
                            onFrequencyChange,
                            onStartingDateChange,
                            onAlwaysSameDayChange,
                        }: Omit<RepeatPickerProps, 'frequency' | 'onFrequencyChange'> & {
    frequency: RepeatingFrequency;
    onFrequencyChange: (frequency: RepeatingFrequency) => void;
}) {
    const {unit} = getFrequencySchedule(frequency);
    const intervalOptions = getFrequenciesForUnit(unit).map(value => ({
        value,
        label: String(getFrequencySchedule(value).interval),
    }));
    const parsedStartingDate = parseLocalDate(startingDate);

    return (
        <div className='repeat-schedule'>
            <div className='repeat-schedule-interval'>
                <p>Every</p>
                <ChipGroup options={intervalOptions} value={frequency} onChange={onFrequencyChange}/>
            </div>
            <SegmentedControl
                options={FREQUENCY_UNIT_OPTIONS}
                value={unit}
                onChange={newUnit => onFrequencyChange(getFrequenciesForUnit(newUnit)[0])}
                variant='inverted'
            />
            <SettingRow
                title='Starts'
                subtitle={`${formatShortDate(parsedStartingDate)} · then ${formatRecurrence(frequency)}`}>
                <DateInput
                    value={startingDate}
                    onChange={e => onStartingDateChange(e.target.value)}
                />
            </SettingRow>
            <SettingRow
                title='Always the same day'
                subtitle={formatSameDayHint(unit, parsedStartingDate)}>
                <Toggle
                    checked={alwaysSameDay}
                    onChange={onAlwaysSameDayChange}
                />
            </SettingRow>
        </div>
    );
}

export default RepeatPicker;
