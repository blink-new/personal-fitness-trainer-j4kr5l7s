import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Play, Pause, SkipForward, CheckCircle, Clock, Target } from 'lucide-react'
import { Exercise } from '../types'

const SAMPLE_WORKOUT: Exercise[] = [
  {
    id: 'push-ups',
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in a plank position with hands shoulder-width apart',
      'Lower your body until chest nearly touches the floor',
      'Push back up to starting position',
      'Keep your core tight throughout the movement'
    ],
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: 'squats',
    name: 'Bodyweight Squats',
    description: 'Fundamental lower body exercise',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees behind toes',
      'Return to starting position'
    ],
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    id: 'plank',
    name: 'Plank Hold',
    description: 'Core strengthening isometric exercise',
    muscleGroups: ['core', 'shoulders'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in a push-up position',
      'Lower to forearms, keeping body straight',
      'Hold position while breathing normally',
      'Keep hips level and core engaged'
    ],
    sets: 3,
    duration: 30,
    restTime: 60
  }
]

type WorkoutState = 'ready' | 'active' | 'resting' | 'completed'

export default function ActiveWorkout() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [workoutState, setWorkoutState] = useState<WorkoutState>('ready')
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null)
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({})

  const currentExercise = SAMPLE_WORKOUT[currentExerciseIndex]
  const totalExercises = SAMPLE_WORKOUT.length
  const progress = ((currentExerciseIndex + (currentSet - 1) / (currentExercise?.sets || 1)) / totalExercises) * 100

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const startWorkout = () => {
    setWorkoutState('active')
    setWorkoutStartTime(new Date())
    setIsTimerRunning(true)
  }

  const pauseWorkout = () => {
    setIsTimerRunning(false)
  }

  const resumeWorkout = () => {
    setIsTimerRunning(true)
  }

  const completeSet = () => {
    const exerciseId = currentExercise.id
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: (prev[exerciseId] || 0) + 1
    }))

    if (currentSet < (currentExercise.sets || 1)) {
      // Start rest period
      setWorkoutState('resting')
      setTimer(currentExercise.restTime || 60)
      setIsTimerRunning(true)
      
      // Auto-advance after rest
      setTimeout(() => {
        setCurrentSet(prev => prev + 1)
        setWorkoutState('active')
        setTimer(0)
      }, (currentExercise.restTime || 60) * 1000)
    } else {
      // Move to next exercise
      nextExercise()
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setCurrentSet(1)
      setWorkoutState('active')
      setTimer(0)
    } else {
      // Workout completed
      setWorkoutState('completed')
      setIsTimerRunning(false)
    }
  }

  const skipExercise = () => {
    nextExercise()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (workoutState === 'completed') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-accent mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">Workout Complete!</h2>
          <p className="text-muted-foreground">Great job! You've finished your workout.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workout Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{formatTime(timer)}</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{totalExercises}</div>
                <div className="text-sm text-muted-foreground">Exercises</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Exercises Completed:</h4>
              {SAMPLE_WORKOUT.map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between text-sm">
                  <span>{exercise.name}</span>
                  <Badge variant="secondary">
                    {completedSets[exercise.id] || 0}/{exercise.sets} sets
                  </Badge>
                </div>
              ))}
            </div>

            <Button className="w-full" size="lg">
              Save Workout
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Active Workout</h2>
        <p className="text-muted-foreground">Upper Body Strength Training</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Exercise {currentExerciseIndex + 1} of {totalExercises}</span>
              <span>Set {currentSet} of {currentExercise?.sets || 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">{formatTime(timer)}</div>
            <div className="text-sm text-muted-foreground">
              {workoutState === 'resting' ? 'Rest Time' : 'Workout Time'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      {currentExercise && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {currentExercise.name}
              <Badge variant="secondary">{currentExercise.difficulty}</Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {currentExercise.muscleGroups.join(', ')}
              </span>
              {currentExercise.reps && (
                <span>{currentExercise.reps} reps</span>
              )}
              {currentExercise.duration && (
                <span>{currentExercise.duration}s hold</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{currentExercise.description}</p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                {currentExercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            {workoutState === 'resting' && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
                <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-accent font-medium">Rest Time</p>
                <p className="text-sm text-muted-foreground">Get ready for the next set</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            {workoutState === 'ready' && (
              <Button onClick={startWorkout} className="flex-1" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Start Workout
              </Button>
            )}
            
            {workoutState === 'active' && (
              <>
                <Button onClick={pauseWorkout} variant="outline" className="flex-1">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button onClick={completeSet} className="flex-1" size="lg">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Set
                </Button>
                <Button onClick={skipExercise} variant="outline">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {workoutState === 'resting' && (
              <>
                <Button onClick={resumeWorkout} className="flex-1" size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </Button>
                <Button onClick={skipExercise} variant="outline">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}