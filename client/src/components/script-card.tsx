import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Script, User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Download, Star, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CodeBlock from "@/components/code-block";

interface ScriptCardProps {
  script: Script;
  showAuthor?: boolean;
}

export default function ScriptCard({ script, showAuthor = true }: ScriptCardProps) {
  const { data: author } = useQuery<Omit<User, "password">>({
    queryKey: [`/api/users/${script.userId}`],
    enabled: showAuthor,
  });

  // Truncate the code for preview
  const previewCode = script.code.split('\n').slice(0, 6).join('\n');
  
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardContent className="p-6 flex-grow">
        {showAuthor && author && (
          <div className="flex items-center mb-4">
            <Link href={`/user/${author.id}`}>
              <Avatar className="h-10 w-10 cursor-pointer border border-primary/20">
                {author.profilePicture ? (
                  <AvatarImage src={author.profilePicture} alt={author.username} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary">
                  {author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="ml-3">
              <Link href={`/user/${author.id}`}>
                <p className="text-sm font-medium cursor-pointer hover:underline flex items-center">
                  {author.username}
                  {author.verified && (
                    <span className="ml-1 text-primary bg-primary/10 rounded-full p-0.5" title="Verified Creator">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"/>
                      </svg>
                    </span>
                  )}
                </p>
              </Link>
              <p className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDistanceToNow(new Date(script.createdAt || new Date()), { addSuffix: true })}</span>
              </p>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <Link href={`/script/${script.id}`}>
            <h3 className="text-lg font-semibold hover:underline cursor-pointer">
              {script.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {script.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-card text-foreground">
            {script.language}
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground">
            {script.category}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            <span>{script.downloads}</span>
          </div>
          {(script.rating || 0) > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              <span>{script.rating}</span>
            </div>
          )}
        </div>
        
        <Link href={`/script/${script.id}`}>
          <a className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50">
            View Details
          </a>
        </Link>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-card/50 border-t">
        <div className="w-full overflow-hidden">
          <CodeBlock
            code={previewCode}
            language={script.language.toLowerCase()}
            className="max-h-32 overflow-hidden"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
