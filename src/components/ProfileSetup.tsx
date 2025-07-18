import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { UserProfile } from '../types'

const EQUIPMENT_OPTIONS = [
  'Bodyweight',
  'Dumbbells',
  'Barbell',
  'Resistance Bands',
  'Pull-up Bar',
  'Kettlebells',
  'Medicine Ball',
  'Yoga Mat',
  'Bench',
  'Cable Machine',
  'Treadmill',
  'Stationary Bike'
]

interface ProfileSetupProps {
  onProfileSaved?: () => void
}

export default function ProfileSetup({ onProfileSaved }: ProfileSetupProps) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: undefined,
    weight: undefined,
    height: undefined,
    fitnessLevel: 'beginner',
    goals: ''
  })
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadProfile(state.user.id)
        loadEquipment(state.user.id)
      }
    })
    return unsubscribe
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      setLoading(true)
      // For now, we'll use mock data since database isn't set up yet
      // const profiles = await blink.db.userProfiles.list({ where: { userId } })
      // if (profiles.length > 0) {
      //   setProfile(profiles[0])
      // }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEquipment = async (userId: string) => {
    try {
      // For now, we'll use mock data since database isn't set up yet
      // const equipment = await blink.db.equipment.list({ where: { userId } })
      // setSelectedEquipment(equipment.map(e => e.name))
    } catch (error) {
      console.error('Error loading equipment:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user || !profile.name) {
      toast.error('Please fill in your name')
      return
    }

    try {
      setSaving(true)
      
      // For now, we'll just show success message since database isn't set up yet
      // const profileData = {
      //   id: `profile_${Date.now()}`,
      //   userId: user.id,
      //   ...profile,
      //   updatedAt: new Date().toISOString()
      // }
      
      // await blink.db.userProfiles.upsert(profileData)
      
      // Save equipment
      // await blink.db.equipment.deleteMany({ where: { userId: user.id } })
      // for (const equipmentName of selectedEquipment) {
      //   await blink.db.equipment.create({
      //     id: `equipment_${Date.now()}_${Math.random()}`,
      //     userId: user.id,
      //     name: equipmentName,
      //     category: 'fitness'
      //   })
      // }

      // Store profile data in localStorage for now
      localStorage.setItem('userProfile', JSON.stringify({
        ...profile,
        equipment: selectedEquipment
      }))

      toast.success('Profile saved successfully!')
      
      // Navigate to workout generator
      if (onProfileSaved) {
        onProfileSaved()
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment) 
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profile Setup</h2>
        <p className="text-muted-foreground">Tell us about yourself to create personalized workouts</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details to customize your fitness plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, height: parseFloat(e.target.value) || undefined }))}
                placeholder="68"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fitness-level">Fitness Level</Label>
              <Select value={profile.fitnessLevel} onValueChange={(value) => setProfile(prev => ({ ...prev, fitnessLevel: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Fitness Goals</Label>
              <Textarea
                id="goals"
                value={profile.goals}
                onChange={(e) => setProfile(prev => ({ ...prev, goals: e.target.value }))}
                placeholder="Describe your fitness goals (e.g., lose weight, build muscle, improve endurance)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Equipment</CardTitle>
            <CardDescription>Select the equipment you have access to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <Button
                  key={equipment}
                  variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleEquipment(equipment)}
                  className="justify-start"
                >
                  {selectedEquipment.includes(equipment) && <X className="h-3 w-3 mr-1" />}
                  {!selectedEquipment.includes(equipment) && <Plus className="h-3 w-3 mr-1" />}
                  {equipment}
                </Button>
              ))}
            </div>

            {selectedEquipment.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Equipment:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedEquipment.map((equipment) => (
                    <Badge key={equipment} variant="secondary" className="cursor-pointer" onClick={() => toggleEquipment(equipment)}>
                      {equipment}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={saving} size="lg">
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  )
}