export interface UserProfile {
  id: string
  userId: string
  name: string
  age?: number
  weight?: number
  height?: number
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goals?: string
  createdAt: string
  updatedAt: string
}

export interface Equipment {
  id: string
  userId: string
  name: string
  category?: string
  createdAt: string
}

export interface Exercise {
  id: string
  name: string
  description: string
  muscleGroups: string[]
  equipment: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructions: string[]
  reps?: number
  sets?: number
  duration?: number
  restTime?: number
}

export interface WorkoutPlan {
  id: string
  userId: string
  name: string
  description?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  durationMinutes: number
  exercises: Exercise[]
  createdAt: string
}

export interface WorkoutSession {
  id: string
  userId: string
  workoutPlanId?: string
  startedAt: string
  completedAt?: string
  durationMinutes?: number
  notes?: string
  exercisesCompleted: CompletedExercise[]
}

export interface CompletedExercise {
  exerciseId: string
  name: string
  sets: CompletedSet[]
  notes?: string
}

export interface CompletedSet {
  reps: number
  weight?: number
  duration?: number
  completed: boolean
}

export interface ProgressEntry {
  id: string
  userId: string
  date: string
  weight?: number
  bodyFatPercentage?: number
  muscleMass?: number
  notes?: string
  createdAt: string
}