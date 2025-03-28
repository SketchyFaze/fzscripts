import { GamepadIcon, BarChart3Icon, Settings2Icon, ServerIcon, GlobeIcon, WrenchIcon, PackageIcon } from "lucide-react";
import { Link } from "wouter";

interface CategoryItem {
  icon: React.ReactNode;
  name: string;
  description: string;
  slug: string;
  color: string;
}

const categories: CategoryItem[] = [
  {
    icon: <GamepadIcon className="h-10 w-10" />,
    name: "Combat",
    description: "Scripts for combat, PvP, and weapons in Roblox games",
    slug: "combat",
    color: "text-red-500",
  },
  {
    icon: <BarChart3Icon className="h-10 w-10" />,
    name: "Simulator",
    description: "Scripts for automation in Roblox simulator games",
    slug: "simulator",
    color: "text-green-500",
  },
  {
    icon: <Settings2Icon className="h-10 w-10" />,
    name: "Admin",
    description: "Admin commands and moderation scripts for Roblox games",
    slug: "admin",
    color: "text-amber-500",
  },
  {
    icon: <ServerIcon className="h-10 w-10" />,
    name: "Game Creation",
    description: "Scripts for developing and creating Roblox games",
    slug: "game-creation",
    color: "text-primary",
  },
  {
    icon: <GlobeIcon className="h-10 w-10" />,
    name: "GUI",
    description: "User interface scripts and UI libraries for Roblox",
    slug: "gui",
    color: "text-blue-500",
  },
  {
    icon: <WrenchIcon className="h-10 w-10" />,
    name: "Utility",
    description: "General purpose utilities for Roblox development",
    slug: "utility",
    color: "text-purple-500",
  },
  {
    icon: <PackageIcon className="h-10 w-10" />,
    name: "Other",
    description: "Miscellaneous Roblox scripts that don't fit other categories",
    slug: "other",
    color: "text-gray-500",
  },
];

export default function CategoriesSection() {
  return (
    <div className="py-12 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-foreground mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/?category=${category.slug}`}>
              <div className="bg-background p-6 rounded-lg border border-border hover:border-primary transition-colors duration-300 cursor-pointer">
                <div className={`${category.color} mb-4`}>{category.icon}</div>
                <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
                <p className="text-muted-foreground mt-2">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
