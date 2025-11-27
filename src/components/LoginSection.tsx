import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { User } from '@phosphor-icons/react'

type LoginSectionProps = {
  onLogin: (username: string) => void
}

export function LoginSection({ onLogin }: LoginSectionProps) {
  const [username, setUsername] = useState('')

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(username.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Game Ochtend Manager</h1>
            <p className="text-muted-foreground">Log in om te beginnen</p>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Gebruikersnaam
              </label>
              <Input
                id="username"
                placeholder="Voer je naam in..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={!username.trim()}
            >
              Inloggen
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
