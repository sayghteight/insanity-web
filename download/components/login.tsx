'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Login() {
  const { data: session } = useSession()

  const [error, setError] = useState('');

  const handleLogin = () => {
    signIn('discord', { callbackUrl: '/dashboard/home' });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
         style={{
           backgroundImage: "url('/insanity.webp')",
           backgroundColor: '#1a0b2e',
           backgroundBlendMode: 'overlay'
         }}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50"></div>
      <div className="max-w-md w-full mx-auto bg-gray-900/80 p-8 rounded-lg backdrop-blur-sm shadow-lg z-10 border border-purple-500/30">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-1">
            <img src="/insanity.webp" alt="Insanity Clan Logo" className="rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Insanity Clan</h1>
          <p className="text-indigo-300">Internal Dashboard</p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-2">
          <Button onClick={handleLogin} className="w-full bg-[#5865F2] text-white hover:bg-[#4856C7]">
            Login with Discord
          </Button>
        </div>
      </div>
    </div>
  )
}