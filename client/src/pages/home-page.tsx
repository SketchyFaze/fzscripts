import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import ScriptCard from "@/components/script-card";
import CategoriesSection from "@/components/categories-section";
import { Loader2 } from "lucide-react";
import { Script } from "@shared/schema";
import CodeBlock from "@/components/code-block";

export default function HomePage() {
  const { data: scripts, isLoading } = useQuery<Script[]>({
    queryKey: ["/api/scripts"],
  });

  return (
    <MainLayout>
      {/* Hero section */}
      <div className="relative bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                  <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                    <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                      <span className="block xl:inline">Share your code with</span>{" "}
                      <span className="block text-primary xl:inline">the world</span>
                    </h1>
                    <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                      FZScripts is a platform where developers can share, discover, and collaborate on scripts for various applications and platforms.
                    </p>
                    <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <a href="/auth" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10">
                          Get Started
                        </a>
                        <a href="#featured-scripts" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-card hover:bg-card/90 md:py-4 md:text-lg md:px-10">
                          Browse Scripts
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="h-56 w-full bg-card rounded-lg object-cover sm:h-72 md:h-96 lg:w-full lg:h-full p-6 hidden lg:block">
              <CodeBlock 
                code={`// Automatic Task Scheduler
function createTaskScheduler() {
  const tasks = [];

  return {
    addTask(name, callback, interval) {
      const task = {
        id: Date.now(),
        name,
        callback,
        interval,
        lastRun: 0
      };
      tasks.push(task);
      return task.id;
    },
    runPendingTasks() {
      const now = Date.now();
      tasks.forEach(task => {
        if (now - task.lastRun >= task.interval) {
          task.callback();
          task.lastRun = now;
        }
      });
    }
  };
}`}
                language="javascript"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured scripts section */}
      <div id="featured-scripts" className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Featured Scripts</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
              Popular in the community
            </p>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
              Check out these trending scripts from our verified creators
            </p>
          </div>

          <div className="mt-10">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {scripts && scripts.length > 0 ? (
                  scripts.map((script) => (
                    <ScriptCard key={script.id} script={script} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">No scripts found. Be the first to share a script!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories section */}
      <CategoriesSection />
    </MainLayout>
  );
}
