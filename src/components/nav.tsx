'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Camera, Dumbbell, Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { href: '/alimentacao', label: 'Alimentação & Suplementos', shortLabel: 'Dieta', icon: Utensils },
  { href: '/treinos', label: 'Ficha de Treino', shortLabel: 'Treino', icon: Dumbbell },
  { href: '/fotos', label: 'Fotos', shortLabel: 'Fotos', icon: Camera },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 border-r border-border bg-card flex-col py-6 px-3 z-50">
        <div className="px-3 mb-8">
          <h1 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Workout
          </h1>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                pathname === href
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex">
        {links.map(({ href, shortLabel, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'text-foreground')} />
              <span className={cn('text-[10px] font-medium', active ? 'text-foreground' : 'text-muted-foreground/70')}>
                {shortLabel}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
