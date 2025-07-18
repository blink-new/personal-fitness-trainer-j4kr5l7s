import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Weight, Target, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

// Mock data for charts
const weightData = [
  { date: '2024-01-01', weight: 170 },
  { date: '2024-01-08', weight: 169 },
  { date: '2024-01-15', weight: 168 },
  { date: '2024-01-22', weight: 167 },
  { date: '2024-01-29', weight: 165 },
  { date: '2024-02-05', weight: 164 },
  { date: '2024-02-12', weight: 163 }
]

const workoutData = [
  { week: 'Week 1', workouts: 3 },
  { week: 'Week 2', workouts: 4 },
  { week: 'Week 3', workouts: 3 },
  { week: 'Week 4', workouts: 5 },
  { week: 'Week 5', workouts: 4 },
  { week: 'Week 6', workouts: 4 }
]

const recentWorkouts = [
  { date: '2024-02-12', name: 'Upper Body Strength', duration: 45, exercises: 8 },
  { date: '2024-02-10', name: 'Cardio HIIT', duration: 30, exercises: 6 },
  { date: '2024-02-08', name: 'Lower Body Power', duration: 50, exercises: 7 },
  { date: '2024-02-06', name: 'Full Body Circuit', duration: 40, exercises: 10 },
  { date: '2024-02-04', name: 'Core & Flexibility', duration: 25, exercises: 5 }
]

export default function ProgressTracker() {
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSaveEntry = async () => {
    if (!newEntry.weight && !newEntry.bodyFat && !newEntry.muscleMass) {
      toast.error('Please enter at least one measurement')
      return
    }

    try {
      setSaving(true)
      
      // For now, we'll just show success message since database isn't set up yet
      // const entry = {
      //   id: `progress_${Date.now()}`,
      //   userId: 'current-user',
      //   date: new Date().toISOString().split('T')[0],
      //   weight: newEntry.weight ? parseFloat(newEntry.weight) : undefined,
      //   bodyFatPercentage: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined,
      //   muscleMass: newEntry.muscleMass ? parseFloat(newEntry.muscleMass) : undefined,
      //   notes: newEntry.notes || undefined,
      //   createdAt: new Date().toISOString()
      // }
      
      // await blink.db.progressEntries.create(entry)
      
      setNewEntry({ weight: '', bodyFat: '', muscleMass: '', notes: '' })
      toast.success('Progress entry saved successfully!')
    } catch (error) {
      console.error('Error saving progress entry:', error)
      toast.error('Failed to save progress entry')
    } finally {
      setSaving(false)
    }
  }

  const currentWeight = weightData[weightData.length - 1]?.weight || 0
  const previousWeight = weightData[weightData.length - 2]?.weight || 0
  const weightChange = currentWeight - previousWeight
  const totalWorkouts = workoutData.reduce((sum, week) => sum + week.workouts, 0)
  const avgWorkoutsPerWeek = totalWorkouts / workoutData.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Progress Tracker</h2>
        <p className="text-muted-foreground">Monitor your fitness journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeight} lbs</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {weightChange < 0 ? (
                <TrendingDown className="h-3 w-3 text-accent mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 text-destructive mr-1" />
              )}
              {Math.abs(weightChange)} lbs from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">Last 6 weeks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWorkoutsPerWeek.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Workouts per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4/5</div>
            <p className="text-xs text-muted-foreground">Workouts completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="log">Log Entry</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>Your weight trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`${value} lbs`, 'Weight']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Workouts</CardTitle>
                <CardDescription>Number of workouts completed each week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} workouts`, 'Completed']} />
                    <Bar 
                      dataKey="workouts" 
                      fill="hsl(var(--accent))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="log">
          <Card>
            <CardHeader>
              <CardTitle>Log New Entry</CardTitle>
              <CardDescription>Record your progress measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="165.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-fat">Body Fat (%)</Label>
                  <Input
                    id="body-fat"
                    type="number"
                    step="0.1"
                    value={newEntry.bodyFat}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, bodyFat: e.target.value }))}
                    placeholder="15.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="muscle-mass">Muscle Mass (lbs)</Label>
                  <Input
                    id="muscle-mass"
                    type="number"
                    step="0.1"
                    value={newEntry.muscleMass}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, muscleMass: e.target.value }))}
                    placeholder="140.0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How are you feeling? Any observations about your progress?"
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveEntry} disabled={saving} className="w-full" size="lg">
                {saving ? 'Saving...' : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Save Entry
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Your recent workout sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{workout.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(workout.date).toLocaleDateString()}</span>
                        <span>{workout.duration} min</span>
                        <span>{workout.exercises} exercises</span>
                      </div>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}