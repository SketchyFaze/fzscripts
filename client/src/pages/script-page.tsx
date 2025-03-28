import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Loader2, Download, Star, Calendar, User, Code } from "lucide-react";
import { Script, User as UserType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/code-block";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";

export default function ScriptPage() {
  const [match, params] = useRoute<{ id: string }>("/script/:id");
  const { toast } = useToast();
  
  const { data: script, isLoading: scriptLoading } = useQuery<Script>({
    queryKey: [`/api/scripts/${params?.id}`],
    enabled: !!params?.id,
  });
  
  const { data: author, isLoading: authorLoading } = useQuery<Omit<UserType, "password">>({
    queryKey: [`/api/users/${script?.userId}`],
    enabled: !!script?.userId,
  });
  
  const downloadMutation = useMutation({
    mutationFn: async () => {
      if (!script) return;
      const res = await apiRequest("POST", `/api/scripts/${script.id}/download`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/scripts/${params?.id}`] });
      toast({
        title: "Script downloaded",
        description: "The script has been downloaded successfully",
      });
    },
  });
  
  const handleDownload = () => {
    if (!script) return;
    
    // Create a blob with the code content
    const blob = new Blob([script.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element and trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${script.title.replace(/\s+/g, "-").toLowerCase()}.${getFileExtension(script.language)}`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Update download count
    downloadMutation.mutate();
  };
  
  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      ruby: "rb",
      php: "php",
      java: "java",
      csharp: "cs",
      cpp: "cpp",
      go: "go",
      rust: "rs",
      bash: "sh",
      powershell: "ps1",
    };
    
    return extensions[language.toLowerCase()] || "txt";
  };
  
  const isLoading = scriptLoading || authorLoading;
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!script) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">Script Not Found</h2>
          <p className="text-muted-foreground mb-4">The script you are looking for does not exist.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8">
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{script.title}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <Badge variant="outline" className="bg-card text-foreground">
                  {script.language}
                </Badge>
                <Badge variant="outline" className="bg-card text-foreground">
                  {script.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDistanceToNow(new Date(script.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="lg"
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
              >
                {downloadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download
              </Button>
            </div>
          </div>
          
          {/* Author and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Link href={`/user/${author?.id}`}>
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {author?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="text-center">
                    <Link href={`/user/${author?.id}`} className="hover:underline">
                      <h3 className="text-lg font-semibold flex items-center justify-center">
                        {author?.username}
                        {author?.verified && (
                          <span className="ml-1 text-primary" title="Verified Creator">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-card p-4 rounded-lg text-center">
                    <Download className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <span className="block text-xl font-semibold">{script.downloads}</span>
                    <span className="text-xs text-muted-foreground">Downloads</span>
                  </div>
                  <div className="bg-card p-4 rounded-lg text-center">
                    <Star className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <span className="block text-xl font-semibold">{script.rating || 0}</span>
                    <span className="text-xs text-muted-foreground">Rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="md:col-span-3 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{script.description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Code</h2>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <CodeBlock code={script.code} language={script.language.toLowerCase()} />
                </CardContent>
                <CardFooter className="bg-card/50 text-xs text-muted-foreground py-2">
                  <div className="flex items-center">
                    <Code className="h-3 w-3 mr-1" />
                    <span>{script.language} | {script.code.split('\n').length} lines</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
