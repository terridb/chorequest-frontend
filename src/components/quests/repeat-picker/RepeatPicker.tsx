import './RepeatPicker.css'
import {useState} from "react";
import type {Frequency} from "../../../types/enums.ts";
import {
    formatRecurrence,
    type FrequencyUnit,
    getFrequenciesForUnit,
    getFrequencySchedule,
    isRepeatingFrequency,
    type RepeatingFrequency,
} from "../../../utils/frequency.ts";
import {
    formatDayAndMonth,
    formatDayOfMonth,
    formatShortDate,
    formatWeekday,
    parseLocalDate
} from "../../../utils/date.ts";
import SegmentedControl from "../../ui/segmented-control/SegmentedControl.tsx";
import ChipGroup from "../../ui/chip-group/ChipGroup.tsx";
import SettingRow from "../../ui/setting-row/SettingRow.tsx";
import Toggle from "../../ui/toggle/Toggle.tsx";

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

// "Always the same day" doesn't apply to daily schedules, so there's no hint for days
function formatSameDayHint(unit: Exclude<FrequencyUnit, 'DAYS'>, date: Date): string {
    switch (unit) {
        case 'WEEKS':
            return `Always lands on a ${formatWeekday(date)}`;
        case 'MONTHS':
            return `Always lands on the ${formatDayOfMonth(date)}`;
        case 'YEARS':
            return `Always lands on ${formatDayAndMonth(date)}`;
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
        <div className='panel'>
            <div className='repeat-schedule-interval'>
                <p>Every</p>
                <ChipGroup options={intervalOptions} value={frequency} onChange={onFrequencyChange}/>
            </div>
            <SegmentedControl
                options={FREQUENCY_UNIT_OPTIONS}
                value={unit}
                onChange={newUnit => {
                    onFrequencyChange(getFrequenciesForUnit(newUnit)[0]);
                    if (newUnit === 'DAYS') onAlwaysSameDayChange(false);
                }}
                variant='inverted'
            />
            <SettingRow
                title='Starts'
                subtitle={`${formatShortDate(parsedStartingDate)} · then ${formatRecurrence(frequency)}`}>
                <input
                    type='date'
                    className='date-input'
                    value={startingDate}
                    // Clearing the native date input gives an empty string; keep the previous date since one is required
                    onChange={e => e.target.value && onStartingDateChange(e.target.value)}
                />
            </SettingRow>
            {unit !== 'DAYS' && (
                <SettingRow
                    title='Always the same day'
                    subtitle={formatSameDayHint(unit, parsedStartingDate)}>
                    <Toggle
                        checked={alwaysSameDay}
                        onChange={onAlwaysSameDayChange}
                    />
                </SettingRow>
            )}
        </div>
    );
}

export default RepeatPicker;
