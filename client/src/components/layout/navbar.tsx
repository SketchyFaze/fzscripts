import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Code, Menu, Search, LogOut, User as UserIcon, Plus } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would implement search functionality here
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/?sort=latest" },
    { name: "Discover", href: "/?sort=popular" },
  ];
  
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <Code className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl ml-2">FZScripts</span>
              </a>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === link.href 
                      ? "bg-background text-foreground" 
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}>
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="flex-shrink-0 hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search scripts..."
                  className="w-64 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </form>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/create">
                  <Button variant="default" size="sm" className="hidden md:flex">
                    <Plus className="h-4 w-4 mr-2" />
                    New Script
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/user/${user.id}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/create">
                      <DropdownMenuItem className="cursor-pointer md:hidden">
                        <Plus className="h-4 w-4 mr-2" />
                        <span>New Script</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4 mr-2" />
                      )}
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div>
                <Link href="/auth">
                  <Button variant="default" size="sm" className="hidden md:inline-flex">
                    Login
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button variant="outline" size="sm" className="ml-2 hidden md:inline-flex">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>FZScripts</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search scripts..."
                        className="w-full pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </form>
                  
                  <div className="space-y-4">
                    {navLinks.map((link) => (
                      <Link key={link.name} href={link.href}>
                        <a className="flex w-full p-2 rounded-md hover:bg-background">
                          {link.name}
                        </a>
                      </Link>
                    ))}
                    
                    {!user ? (
                      <div className="pt-4 space-y-2">
                        <Link href="/auth">
                          <Button className="w-full">Login</Button>
                        </Link>
                        <Link href="/auth?tab=register">
                          <Button variant="outline" className="w-full">Register</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="pt-4 space-y-2">
                        <Link href={`/user/${user.id}`}>
                          <Button variant="outline" className="w-full justify-start">
                            <UserIcon className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Link>
                        <Link href="/create">
                          <Button variant="outline" className="w-full justify-start">
                            <Plus className="h-4 w-4 mr-2" />
                            New Script
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start"
                          onClick={handleLogout}
                          disabled={logoutMutation.isPending}
                        >
                          {logoutMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4 mr-2" />
                          )}
                          Log out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
