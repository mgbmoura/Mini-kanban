'use client';

import { Layout, Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-1.5 rounded-lg">
          <Layout className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Mini-Kanban
        </h1>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar tarefas..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Button>
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">João Desenvolvedor</p>
            <p className="text-[10px] text-muted-foreground">Admin</p>
          </div>
          <Avatar className="h-9 w-9 border border-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
