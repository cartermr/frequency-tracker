import { Box, Button, Center, Text, Icon, AlertDialog } from 'native-base'
import React, { ReactNode, useState, useRef, useEffect } from 'react'
import { TimePicker, ValueMap } from 'react-native-simple-time-picker'
import { MaterialIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { Sound } from 'expo-av/build/Audio'
import Counter from '../counter/CounterComponent'

interface TimerControls {
    [key: string]: ReactNode
}

const TimerStatus = {
    STOPPED: 'STOPPED',
    PAUSED: 'PAUSED',
    RUNNING: 'RUNNING'
}

const Timer = () => {
    const [timeDisplay, setTimeDisplay] = useState<string>('')
    const [totalSeconds, setTotalSeconds] = useState<number>(0)
    const [timerID, setTimerID] = useState<number>()
    const [timerStatus, setTimerStatus] = useState<string>(TimerStatus.STOPPED)
    const [time, setTime] = useState<ValueMap>({ hours: 0, minutes: 0, seconds: 0 })
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [sound, setSound] = useState<Sound | undefined>(undefined)

    const [count1, setCount1] = useState<number>(0)
    const [count2, setCount2] = useState<number>(0)
    const resetCount1 = () => setCount1(0)
    const resetCount2 = () => setCount2(0)

    const cancelRef = useRef(null)

    const onClose = async () => setIsOpen(false)
    const loadAlertSound = async () => await (await Audio.Sound.createAsync(require('../../assets/alertBells.wav'), { isLooping: true })).sound
    // const loadAlertSound = async () => await (await Audio.Sound.createAsync(require('../../assets/smsAlert.wav'), { isLooping: true })).sound
    // const loadAlertSound = async () => await (await Audio.Sound.createAsync(require('../../assets/clearTones.wav'), { isLooping: true })).sound
    useEffect(() => {
        const soundSystem = async () => {
            if (!sound) {
                setSound(await loadAlertSound())
            }

            if (sound && isOpen) { sound.playAsync() }

            if (sound && !isOpen) { await sound.stopAsync() }
        }

        soundSystem()
    }, [isOpen, sound])


    const handleTimeInput = (timeInput: ValueMap) => {
        setTime(timeInput)
        setTotalSeconds(timeInput.hours * 3600 + timeInput.minutes * 60 + timeInput.seconds)
        setTimeDisplay(`${timeInput.hours.toString().padStart(2, '0')}:${timeInput.minutes.toString().padStart(2, '0')}:${timeInput.seconds.toString().padStart(2, '0')}`)
    }

    const startTimer = async () => {
        if (totalSeconds === 0) { return }

        setTimerStatus(TimerStatus.RUNNING)

        let timerSeconds = totalSeconds
        let intervalID: any = setInterval(async () => {
            if (timerSeconds >= 0) {

                let hours = Math.floor(timerSeconds / 3600).toString().padStart(2, '0')
                let minutes = Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0')
                let seconds = Math.floor(timerSeconds % 60).toString().padStart(2, '0')

                setTimeDisplay(`${hours}:${minutes}:${seconds}`)

                timerSeconds--

                if (timerSeconds < 0) {
                    setTotalSeconds(time.hours * 3600 + time.minutes * 60 + time.seconds)
                    setIsOpen(true)
                    clearTimer(false)

                } else {
                    setTotalSeconds(timerSeconds)
                }
            }
        }, 1000)
        setTimerID(intervalID)
    }


    const pauseTimer = () => {
        timerID && clearInterval(timerID)
        setTimerStatus(TimerStatus.PAUSED)
    }

    const clearTimer = (totalClear: boolean) => {
        timerID && clearInterval(timerID)
        setTimerStatus(TimerStatus.STOPPED)
        setTimeDisplay(`${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`)
        setTime({ hours: 0, minutes: 0, seconds: 0 })
        if (totalClear) {
            resetCount1()
            resetCount2()
        }
    }

    const timerPlayPauseControls: TimerControls = {
        STOPPED:
            <Button
                onPress={startTimer}
                width='40%'
                _text={{ color: 'black' }}
                size='lg'
                leftIcon={<Icon as={MaterialIcons} name='play-arrow' color='black' size='lg' />}
            >
                START
            </Button>,
        RUNNING:
            <Button
                onPress={pauseTimer}
                width='40%'
                _text={{ color: 'black' }}
                size='lg'
                leftIcon={<Icon as={MaterialIcons} name='pause' color='black' />}
            >
                PAUSE
            </Button>,
        PAUSED:
            <Button
                onPress={startTimer}
                width='40%'
                _text={{ color: 'black' }}
                size='lg'
                leftIcon={<Icon as={MaterialIcons} name='play-arrow' color='black' size='lg' />}
            >
                START
            </Button>
    }

    const timerStopReset: TimerControls = {
        STOPPED:
            <Button
                onPress={() => clearTimer(true)}
                width='40%'
                _text={{ color: 'black' }}
                size='lg'
                leftIcon={<Icon as={MaterialIcons} name='restore' color='black' />}
            >
                RESET
            </Button>,
        RUNNING:
            <Button
                onPress={() => clearTimer(true)}
                width='40%'
                _text={{ color: 'black' }}
                size='lg'
                leftIcon={<Icon as={MaterialIcons} name='stop' color='black' />}
            >
                STOP
            </Button>,
        PAUSED:
            <Button
                onPress={() => clearTimer(true)}
                width='40%'
                _text={{ color: 'black' }}
                size='lg'
                leftIcon={<Icon as={MaterialIcons} name='restore' color='black' />}
            >
                RESET
            </Button>
    }

    const timerDisplay: TimerControls = {
        STOPPED: <>
            <TimePicker
                value={time}
                onChange={handleTimeInput}
                pickerShows={['hours', 'minutes', 'seconds']}
                hoursUnit='hour'
                minutesUnit='min'
                secondsUnit='sec'
                itemStyle={{
                    fontSize: 20
                }}
            />
        </>,
        RUNNING: <Text
            width='85%'
            textAlign='center'
            fontSize='6xl'
            my='40px'
        >
            {timeDisplay}
        </Text>,
        PAUSED: <Text
            width='85%'
            textAlign='center'
            fontSize='6xl'
            my='40px'
        >
            {timeDisplay}
        </Text>
    }

    return (
        <>
            <Center>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                    <AlertDialog.Content>
                        <AlertDialog.Body>
                            <Text textAlign='center' fontSize='2xl'>
                                Your Timer Has Ended
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer justifyContent='center'>
                            <Button w='30%' colorScheme='danger' onPress={onClose}>
                                OK
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center>
            <Box width='100%'>
                <Center>
                    {timerDisplay[timerStatus]}
                </Center>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-evenly',
                        marginTop: 16
                    }}
                >
                    {timerPlayPauseControls[timerStatus]}
                    {timerStopReset[timerStatus]}
                </Box>
            </Box>
            <Box
                display='flex'
                flexDirection='row'
                width='100%'
            >
                <Counter defaultLabel='Correct' count={count1} setCount={setCount1} resetCount={resetCount1} />
                <Counter defaultLabel='Incorrect' count={count2} setCount={setCount2} resetCount={resetCount2} />
            </Box>
        </>
    )
}

export default Timer