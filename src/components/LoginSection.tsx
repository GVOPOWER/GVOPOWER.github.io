import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { User, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { UserAccount } from '@/types'

type LoginSectionProps = {
  onLogin: (email: string) => void
}

export function LoginSection({ onLogin }: LoginSectionProps) {
  const [accounts, setAccounts] = useKV<Record<string, UserAccount>>('user-accounts', {})
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (!email.trim() || !password) {
      toast.error('Vul alle velden in')
      return
    }

    const account = (accounts || {})[email.toLowerCase()]
    
    if (!account) {
      toast.error('Account niet gevonden')
      return
    }

    if (account.password !== password) {
      toast.error('Onjuist wachtwoord')
      return
    }

    toast.success('Welkom terug!')
    onLogin(email.toLowerCase())
  }

  const handleRegister = () => {
    if (!email.trim() || !password) {
      toast.error('Vul alle velden in')
      return
    }

    if (password.length < 6) {
      toast.error('Wachtwoord moet minimaal 6 tekens bevatten')
      return
    }

    const emailLower = email.toLowerCase()
    
    if ((accounts || {})[emailLower]) {
      toast.error('Dit email-adres is al in gebruik')
      return
    }

    setAccounts((current) => ({
      ...(current || {}),
      [emailLower]: {
        email: emailLower,
        password,
        createdAt: Date.now()
      }
    }))

    toast.success('Account aangemaakt!')
    onLogin(emailLower)
  }

  const handleSubmit = () => {
    if (isRegistering) {
      handleRegister()
    } else {
      handleLogin()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
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
            <p className="text-muted-foreground">
              {isRegistering ? 'Maak een nieuw account aan' : 'Log in om te beginnen'}
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="je@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Wachtwoord
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimaal 6 tekens"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlash className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={!email.trim() || !password}
            >
              {isRegistering ? 'Account Aanmaken' : 'Inloggen'}
            </Button>

            <div className="text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-primary hover:underline"
              >
                {isRegistering ? 'Al een account? Log in' : 'Nog geen account? Registreer'}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
