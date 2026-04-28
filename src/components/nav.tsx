'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Camera, Dumbbell, Activity, Pill, Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/alimentacao', label: 'Alimentação', icon: Utensils },
  { href: '/treinos', label: 'Ficha de Treino', icon: Dumbbell },
  { href: '/fotos', label: 'Fotos', icon: Camera },
  { href: '/postura', label: 'Ficha de Postura', icon: Activity },
  { href: '/suplementos', label: 'Suplementos', icon: Pill },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 border-r border-border bg-card flex flex-col py-6 px-3 z-50">
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
  )
}
