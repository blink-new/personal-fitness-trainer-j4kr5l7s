import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Toaster } from 'react-hot-toast'
import { User, Dumbbell, Target, TrendingUp, Settings, Play } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import ProfileSetup from './components/ProfileSetup'
import WorkoutGenerator from './components/WorkoutGenerator'
import ActiveWorkout from './components/ActiveWorkout'
import ProgressTracker from './components/ProgressTracker'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your fitness journey...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="space-y-2">
            <Dumbbell className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-3xl font-bold text-foreground">Personal Fitness Trainer</h1>
            <p className="text-muted-foreground">
              Create custom workout plans, track your progress, and achieve your fitness goals
            </p>
          </div>
          <Button onClick={() => blink.auth.login()} size="lg" className="w-full">
            Get Started
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Fitness Trainer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
              <Button variant="outline" size="sm" onClick={() => blink.auth.logout()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Workout</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Active</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Workout</CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Upper Body</div>
                  <p className="text-xs text-muted-foreground">45 minutes • 8 exercises</p>
                  <Button className="w-full mt-4" onClick={() => setActiveTab('active')}>
                    Start Workout
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4/5</div>
                  <p className="text-xs text-muted-foreground">Workouts completed this week</p>
                  <div className="w-full bg-secondary rounded-full h-2 mt-4">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">165 lbs</div>
                  <p className="text-xs text-muted-foreground">-2 lbs from last week</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-accent font-medium">↓ 2 lbs</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with your fitness journey</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('workout')}>
                  <Dumbbell className="h-6 w-6 mb-2" />
                  Generate Workout
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('progress')}>
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Log Progress
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('profile')}>
                  <Settings className="h-6 w-6 mb-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSetup onProfileSaved={() => setActiveTab('workout')} />
          </TabsContent>

          <TabsContent value="workout">
            <WorkoutGenerator />
          </TabsContent>

          <TabsContent value="active">
            <ActiveWorkout />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTracker />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App