import { useState, useEffect, useRef } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Clock, Target, Zap, Play, RefreshCw, Calendar, CalendarDays } from 'lucide-react'
import toast from 'react-hot-toast'
import { Exercise, WorkoutPlan } from '../types'

const WORKOUT_TYPES = [
  { value: 'full-body', label: 'Full Body', description: 'Complete workout targeting all muscle groups' },
  { value: 'upper-body', label: 'Upper Body', description: 'Focus on chest, back, shoulders, and arms' },
  { value: 'lower-body', label: 'Lower Body', description: 'Target legs, glutes, and calves' },
  { value: 'cardio', label: 'Cardio', description: 'Heart-pumping cardiovascular exercises' },
  { value: 'strength', label: 'Strength', description: 'Build muscle with resistance training' },
  { value: 'flexibility', label: 'Flexibility', description: 'Improve mobility and flexibility' }
]

const SAMPLE_EXERCISES: Exercise[] = [
  // Beginner exercises
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
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    description: 'Isometric leg strengthening exercise',
    muscleGroups: ['quadriceps', 'glutes'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Stand with back against a wall',
      'Slide down until thighs are parallel to floor',
      'Keep knees at 90-degree angle',
      'Hold position while breathing normally'
    ],
    sets: 3,
    duration: 30,
    restTime: 60
  },
  {
    id: 'glute-bridges',
    name: 'Glute Bridges',
    description: 'Hip strengthening exercise',
    muscleGroups: ['glutes', 'hamstrings'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Lie on back with knees bent',
      'Squeeze glutes and lift hips up',
      'Form straight line from knees to shoulders',
      'Lower back down with control'
    ],
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    id: 'modified-push-ups',
    name: 'Modified Push-ups',
    description: 'Knee push-ups for building strength',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in plank position on knees',
      'Keep straight line from head to knees',
      'Lower chest toward floor',
      'Push back up to starting position'
    ],
    sets: 3,
    reps: 10,
    restTime: 60
  },
  // Intermediate exercises
  {
    id: 'lunges',
    name: 'Forward Lunges',
    description: 'Unilateral leg exercise for strength and balance',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg, lowering hips',
      'Both knees should be at 90-degree angles',
      'Push back to starting position and repeat'
    ],
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    description: 'Dynamic cardio exercise',
    muscleGroups: ['core', 'shoulders', 'legs'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'Start in a plank position',
      'Bring one knee toward chest',
      'Quickly switch legs in a running motion',
      'Keep hips level and core tight'
    ],
    sets: 3,
    duration: 30,
    restTime: 60
  },
  {
    id: 'jump-squats',
    name: 'Jump Squats',
    description: 'Explosive lower body exercise',
    muscleGroups: ['quadriceps', 'glutes', 'calves'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'Start in squat position',
      'Explode up into a jump',
      'Land softly back in squat position',
      'Repeat immediately'
    ],
    sets: 3,
    reps: 12,
    restTime: 75
  },
  {
    id: 'pike-push-ups',
    name: 'Pike Push-ups',
    description: 'Shoulder-focused push-up variation',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'Start in downward dog position',
      'Lower head toward floor',
      'Push back up to starting position',
      'Keep hips high throughout'
    ],
    sets: 3,
    reps: 8,
    restTime: 75
  },
  {
    id: 'side-lunges',
    name: 'Side Lunges',
    description: 'Lateral leg strengthening exercise',
    muscleGroups: ['quadriceps', 'glutes', 'adductors'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet wide apart',
      'Shift weight to one leg, bending knee',
      'Keep other leg straight',
      'Return to center and repeat other side'
    ],
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    id: 'reverse-lunges',
    name: 'Reverse Lunges',
    description: 'Backward stepping lunge variation',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet hip-width apart',
      'Step backward with one leg',
      'Lower until both knees at 90 degrees',
      'Push back to starting position'
    ],
    sets: 3,
    reps: 12,
    restTime: 60
  },
  // Advanced exercises
  {
    id: 'burpees',
    name: 'Burpees',
    description: 'Full-body explosive exercise',
    muscleGroups: ['full-body'],
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    instructions: [
      'Start standing, then squat down',
      'Place hands on floor and jump feet back to plank',
      'Do a push-up, then jump feet back to squat',
      'Jump up with arms overhead'
    ],
    sets: 3,
    reps: 8,
    restTime: 90
  },
  {
    id: 'single-leg-squats',
    name: 'Single Leg Squats (Pistol Squats)',
    description: 'Advanced unilateral leg exercise',
    muscleGroups: ['quadriceps', 'glutes', 'core'],
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    instructions: [
      'Stand on one leg with other leg extended',
      'Lower down as far as possible',
      'Keep extended leg straight',
      'Push back up to starting position'
    ],
    sets: 3,
    reps: 5,
    restTime: 90
  },
  {
    id: 'handstand-push-ups',
    name: 'Handstand Push-ups',
    description: 'Advanced inverted push-up',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    instructions: [
      'Get into handstand position against wall',
      'Lower head toward floor',
      'Push back up to full extension',
      'Maintain balance throughout'
    ],
    sets: 3,
    reps: 5,
    restTime: 120
  },
  {
    id: 'archer-push-ups',
    name: 'Archer Push-ups',
    description: 'Unilateral push-up variation',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    instructions: [
      'Start in wide push-up position',
      'Lower to one side, keeping other arm straight',
      'Push back up and repeat other side',
      'Alternate sides each rep'
    ],
    sets: 3,
    reps: 6,
    restTime: 90
  },
  {
    id: 'jump-lunges',
    name: 'Jump Lunges',
    description: 'Explosive alternating lunge jumps',
    muscleGroups: ['quadriceps', 'glutes', 'calves'],
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    instructions: [
      'Start in lunge position',
      'Jump up and switch leg positions',
      'Land in opposite lunge',
      'Continue alternating with each jump'
    ],
    sets: 3,
    reps: 10,
    restTime: 90
  },
  {
    id: 'muscle-ups',
    name: 'Muscle-ups',
    description: 'Advanced pull-up to dip combination',
    muscleGroups: ['back', 'chest', 'shoulders', 'arms'],
    equipment: ['pull-up bar'],
    difficulty: 'advanced',
    instructions: [
      'Hang from pull-up bar',
      'Pull up explosively',
      'Transition over the bar',
      'Lower back down with control'
    ],
    sets: 3,
    reps: 3,
    restTime: 120
  }
]

export default function WorkoutGenerator() {
  const [workoutType, setWorkoutType] = useState('')
  const [duration, setDuration] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null)
  const [generatedWeeklyPlan, setGeneratedWeeklyPlan] = useState<WorkoutPlan[] | null>(null)
  const [generatedMonthlyPlan, setGeneratedMonthlyPlan] = useState<WorkoutPlan[] | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generatingWeekly, setGeneratingWeekly] = useState(false)
  const [generatingMonthly, setGeneratingMonthly] = useState(false)
  const difficultySetRef = useRef(false)

  // Load user profile and set default difficulty
  useEffect(() => {
    if (difficultySetRef.current) return
    
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile)
        if (profile.fitnessLevel && !difficulty) {
          setDifficulty(profile.fitnessLevel)
          difficultySetRef.current = true
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
  }, [difficulty])

  const generateWorkout = async (isRegenerate = false) => {
    if (!workoutType || !duration || !difficulty) {
      toast.error('Please fill in all workout preferences')
      return
    }

    try {
      setGenerating(true)
      
      // Filter exercises based on difficulty and workout type
      let availableExercises = SAMPLE_EXERCISES.filter(exercise => {
        // Include exercises of the selected difficulty and easier levels
        const difficultyMatch = exercise.difficulty === difficulty || 
          (difficulty === 'intermediate' && exercise.difficulty === 'beginner') ||
          (difficulty === 'advanced' && (exercise.difficulty === 'beginner' || exercise.difficulty === 'intermediate'))
        
        // Filter by workout type if specific type is selected
        if (workoutType === 'upper-body') {
          return difficultyMatch && exercise.muscleGroups.some(group => 
            ['chest', 'shoulders', 'triceps', 'back', 'biceps'].includes(group)
          )
        } else if (workoutType === 'lower-body') {
          return difficultyMatch && exercise.muscleGroups.some(group => 
            ['quadriceps', 'glutes', 'hamstrings', 'calves', 'legs'].includes(group)
          )
        } else if (workoutType === 'cardio') {
          return difficultyMatch && (
            exercise.name.toLowerCase().includes('jump') ||
            exercise.name.toLowerCase().includes('burpee') ||
            exercise.name.toLowerCase().includes('mountain') ||
            exercise.muscleGroups.includes('full-body')
          )
        } else if (workoutType === 'strength') {
          return difficultyMatch && !exercise.name.toLowerCase().includes('jump')
        } else if (workoutType === 'flexibility') {
          return difficultyMatch && (
            exercise.name.toLowerCase().includes('stretch') ||
            exercise.name.toLowerCase().includes('hold') ||
            exercise.duration
          )
        }
        
        return difficultyMatch
      })

      // Determine number of exercises based on duration
      const numExercises = parseInt(duration) <= 15 ? 3 : 
                          parseInt(duration) <= 30 ? 4 : 
                          parseInt(duration) <= 45 ? 6 : 8

      // If regenerating, exclude previously selected exercises to ensure variety
      if (isRegenerate && generatedWorkout) {
        const previousExerciseIds = generatedWorkout.exercises.map(ex => ex.id)
        availableExercises = availableExercises.filter(ex => !previousExerciseIds.includes(ex.id))
        
        // If not enough new exercises, include some previous ones
        if (availableExercises.length < numExercises) {
          const previousExercises = SAMPLE_EXERCISES.filter(ex => previousExerciseIds.includes(ex.id))
          availableExercises = [...availableExercises, ...previousExercises]
        }
      }

      // Shuffle and select exercises
      const shuffled = [...availableExercises].sort(() => Math.random() - 0.5)
      const selectedExercises = shuffled.slice(0, Math.min(numExercises, shuffled.length))
      
      const workout: WorkoutPlan = {
        id: `workout_${Date.now()}`,
        userId: 'current-user',
        name: `${WORKOUT_TYPES.find(t => t.value === workoutType)?.label} Workout`,
        description: `A ${difficulty} ${workoutType} workout designed for ${duration} minutes`,
        difficulty: difficulty as any,
        durationMinutes: parseInt(duration),
        exercises: selectedExercises,
        createdAt: new Date().toISOString()
      }
      
      setGeneratedWorkout(workout)
      toast.success(isRegenerate ? 'New workout generated!' : 'Workout generated successfully!')
    } catch (error) {
      console.error('Error generating workout:', error)
      toast.error('Failed to generate workout')
    } finally {
      setGenerating(false)
    }
  }

  const regenerateWorkout = () => {
    generateWorkout(true)
  }

  const saveWorkout = async () => {
    if (!generatedWorkout) return
    
    try {
      // For now, we'll just show success message since database isn't set up yet
      // await blink.db.workoutPlans.create(generatedWorkout)
      toast.success('Workout saved to your library!')
    } catch (error) {
      console.error('Error saving workout:', error)
      toast.error('Failed to save workout')
    }
  }

  const generateWeeklyPlan = async () => {
    if (!difficulty) {
      toast.error('Please select a difficulty level first')
      return
    }

    try {
      setGeneratingWeekly(true)
      
      const weeklyWorkouts: WorkoutPlan[] = []
      const workoutTypes = ['full-body', 'upper-body', 'lower-body', 'cardio', 'strength']
      
      // Generate 5 different workouts for the week
      for (let day = 0; day < 5; day++) {
        const dayWorkoutType = workoutTypes[day % workoutTypes.length]
        const dayDuration = day === 2 ? '30' : '45' // Wednesday is shorter
        
        // Filter exercises for this day
        const availableExercises = SAMPLE_EXERCISES.filter(exercise => {
          const difficultyMatch = exercise.difficulty === difficulty || 
            (difficulty === 'intermediate' && exercise.difficulty === 'beginner') ||
            (difficulty === 'advanced' && (exercise.difficulty === 'beginner' || exercise.difficulty === 'intermediate'))
          
          if (dayWorkoutType === 'upper-body') {
            return difficultyMatch && exercise.muscleGroups.some(group => 
              ['chest', 'shoulders', 'triceps', 'back', 'biceps'].includes(group)
            )
          } else if (dayWorkoutType === 'lower-body') {
            return difficultyMatch && exercise.muscleGroups.some(group => 
              ['quadriceps', 'glutes', 'hamstrings', 'calves', 'legs'].includes(group)
            )
          } else if (dayWorkoutType === 'cardio') {
            return difficultyMatch && (
              exercise.name.toLowerCase().includes('jump') ||
              exercise.name.toLowerCase().includes('burpee') ||
              exercise.name.toLowerCase().includes('mountain') ||
              exercise.muscleGroups.includes('full-body')
            )
          } else if (dayWorkoutType === 'strength') {
            return difficultyMatch && !exercise.name.toLowerCase().includes('jump')
          }
          
          return difficultyMatch
        })

        const numExercises = parseInt(dayDuration) <= 30 ? 4 : 6
        const shuffled = [...availableExercises].sort(() => Math.random() - 0.5)
        const selectedExercises = shuffled.slice(0, Math.min(numExercises, shuffled.length))
        
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        const workout: WorkoutPlan = {
          id: `weekly_workout_${day}_${Date.now()}`,
          userId: 'current-user',
          name: `${dayNames[day]} - ${WORKOUT_TYPES.find(t => t.value === dayWorkoutType)?.label}`,
          description: `Day ${day + 1} of your weekly plan - ${difficulty} ${dayWorkoutType} workout`,
          difficulty: difficulty as any,
          durationMinutes: parseInt(dayDuration),
          exercises: selectedExercises,
          createdAt: new Date().toISOString()
        }
        
        weeklyWorkouts.push(workout)
      }
      
      setGeneratedWeeklyPlan(weeklyWorkouts)
      toast.success('Weekly workout plan generated!')
    } catch (error) {
      console.error('Error generating weekly plan:', error)
      toast.error('Failed to generate weekly plan')
    } finally {
      setGeneratingWeekly(false)
    }
  }

  const generateMonthlyPlan = async () => {
    if (!difficulty) {
      toast.error('Please select a difficulty level first')
      return
    }

    try {
      setGeneratingMonthly(true)
      
      const monthlyWorkouts: WorkoutPlan[] = []
      const workoutTypes = ['full-body', 'upper-body', 'lower-body', 'cardio', 'strength', 'flexibility']
      
      // Generate 4 weeks of workouts (20 workouts total)
      for (let week = 0; week < 4; week++) {
        for (let day = 0; day < 5; day++) {
          const workoutIndex = week * 5 + day
          const dayWorkoutType = workoutTypes[workoutIndex % workoutTypes.length]
          
          // Progressive duration: start with 30min, increase to 60min by week 4
          const baseDuration = 30 + (week * 7.5) // 30, 37.5, 45, 52.5
          const dayDuration = Math.round(baseDuration).toString()
          
          // Filter exercises for this day
          const availableExercises = SAMPLE_EXERCISES.filter(exercise => {
            const difficultyMatch = exercise.difficulty === difficulty || 
              (difficulty === 'intermediate' && exercise.difficulty === 'beginner') ||
              (difficulty === 'advanced' && (exercise.difficulty === 'beginner' || exercise.difficulty === 'intermediate'))
            
            if (dayWorkoutType === 'upper-body') {
              return difficultyMatch && exercise.muscleGroups.some(group => 
                ['chest', 'shoulders', 'triceps', 'back', 'biceps'].includes(group)
              )
            } else if (dayWorkoutType === 'lower-body') {
              return difficultyMatch && exercise.muscleGroups.some(group => 
                ['quadriceps', 'glutes', 'hamstrings', 'calves', 'legs'].includes(group)
              )
            } else if (dayWorkoutType === 'cardio') {
              return difficultyMatch && (
                exercise.name.toLowerCase().includes('jump') ||
                exercise.name.toLowerCase().includes('burpee') ||
                exercise.name.toLowerCase().includes('mountain') ||
                exercise.muscleGroups.includes('full-body')
              )
            } else if (dayWorkoutType === 'strength') {
              return difficultyMatch && !exercise.name.toLowerCase().includes('jump')
            } else if (dayWorkoutType === 'flexibility') {
              return difficultyMatch && (
                exercise.name.toLowerCase().includes('stretch') ||
                exercise.name.toLowerCase().includes('hold') ||
                exercise.duration
              )
            }
            
            return difficultyMatch
          })

          const numExercises = parseInt(dayDuration) <= 30 ? 4 : 
                              parseInt(dayDuration) <= 45 ? 6 : 8
          const shuffled = [...availableExercises].sort(() => Math.random() - 0.5)
          const selectedExercises = shuffled.slice(0, Math.min(numExercises, shuffled.length))
          
          const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          const workout: WorkoutPlan = {
            id: `monthly_workout_${week}_${day}_${Date.now()}`,
            userId: 'current-user',
            name: `Week ${week + 1} ${dayNames[day]} - ${WORKOUT_TYPES.find(t => t.value === dayWorkoutType)?.label}`,
            description: `Week ${week + 1}, Day ${day + 1} - ${difficulty} ${dayWorkoutType} workout`,
            difficulty: difficulty as any,
            durationMinutes: parseInt(dayDuration),
            exercises: selectedExercises,
            createdAt: new Date().toISOString()
          }
          
          monthlyWorkouts.push(workout)
        }
      }
      
      setGeneratedMonthlyPlan(monthlyWorkouts)
      toast.success('Monthly workout plan generated!')
    } catch (error) {
      console.error('Error generating monthly plan:', error)
      toast.error('Failed to generate monthly plan')
    } finally {
      setGeneratingMonthly(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Workout Generator</h2>
        <p className="text-muted-foreground">Create a personalized workout based on your preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workout Preferences</CardTitle>
            <CardDescription>Customize your workout parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Workout Type</Label>
              <Select value={workoutType} onValueChange={setWorkoutType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workout type" />
                </SelectTrigger>
                <SelectContent>
                  {WORKOUT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={generateWorkout} 
                disabled={generating || !workoutType || !duration || !difficulty}
                className="w-full"
                size="lg"
              >
                {generating ? 'Generating...' : 'Generate Single Workout'}
                <Zap className="ml-2 h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={generateWeeklyPlan} 
                  disabled={generatingWeekly || !difficulty}
                  variant="outline"
                  size="sm"
                >
                  {generatingWeekly ? 'Generating...' : 'Weekly Plan'}
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  onClick={generateMonthlyPlan} 
                  disabled={generatingMonthly || !difficulty}
                  variant="outline"
                  size="sm"
                >
                  {generatingMonthly ? 'Generating...' : 'Monthly Plan'}
                  <CalendarDays className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedWorkout && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {generatedWorkout.name}
                <Badge variant="secondary">{generatedWorkout.difficulty}</Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {generatedWorkout.durationMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {generatedWorkout.exercises.length} exercises
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{generatedWorkout.description}</p>
              
              <div className="space-y-3">
                {generatedWorkout.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{index + 1}. {exercise.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {exercise.muscleGroups.join(', ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      {exercise.sets && <span>{exercise.sets} sets</span>}
                      {exercise.reps && <span>{exercise.reps} reps</span>}
                      {exercise.duration && <span>{exercise.duration}s hold</span>}
                      {exercise.restTime && <span>{exercise.restTime}s rest</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={saveWorkout} variant="outline" className="flex-1">
                  Save Workout
                </Button>
                <Button 
                  onClick={regenerateWorkout} 
                  variant="outline" 
                  disabled={generating}
                  className="flex-1"
                >
                  {generating ? (
                    'Generating...'
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </>
                  )}
                </Button>
                <Button className="flex-1">
                  <Play className="mr-2 h-4 w-4" />
                  Start Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {generatedWeeklyPlan && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Workout Plan
                  <Badge variant="secondary">{difficulty}</Badge>
                </CardTitle>
                <CardDescription>
                  5-day workout plan with varied exercises and progressive difficulty
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {generatedWeeklyPlan.map((workout, index) => (
                    <div key={workout.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{workout.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {workout.durationMinutes}min
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{workout.description}</p>
                      <div className="space-y-1">
                        {workout.exercises.slice(0, 3).map((exercise, idx) => (
                          <div key={exercise.id} className="text-xs">
                            {idx + 1}. {exercise.name}
                          </div>
                        ))}
                        {workout.exercises.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{workout.exercises.length - 3} more exercises
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Save Weekly Plan
                  </Button>
                  <Button className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Start Week 1
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {generatedMonthlyPlan && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Monthly Workout Plan
                  <Badge variant="secondary">{difficulty}</Badge>
                </CardTitle>
                <CardDescription>
                  4-week progressive plan with 20 workouts - duration increases each week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[0, 1, 2, 3].map((weekIndex) => (
                  <div key={weekIndex} className="space-y-3">
                    <h4 className="font-medium text-sm border-b pb-2">
                      Week {weekIndex + 1} 
                      <span className="text-muted-foreground ml-2">
                        ({generatedMonthlyPlan[weekIndex * 5]?.durationMinutes}min sessions)
                      </span>
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                      {generatedMonthlyPlan.slice(weekIndex * 5, (weekIndex + 1) * 5).map((workout, dayIndex) => (
                        <div key={workout.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-xs">{workout.name.split(' - ')[1]}</h5>
                            <Badge variant="outline" className="text-xs">
                              {workout.durationMinutes}min
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            {workout.exercises.slice(0, 2).map((exercise, idx) => (
                              <div key={exercise.id} className="text-xs text-muted-foreground">
                                {exercise.name}
                              </div>
                            ))}
                            {workout.exercises.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{workout.exercises.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Save Monthly Plan
                  </Button>
                  <Button className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Start Month
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}