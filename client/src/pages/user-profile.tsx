import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { User, Script } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, FileCode, Calendar, Upload, PencilIcon } from "lucide-react";
import ScriptCard from "@/components/script-card";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function ProfilePictureUploader({ userId }: { userId: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();
  
  const updateProfilePictureMutation = useMutation({
    mutationFn: async (profilePicture: string) => {
      const res = await apiRequest("POST", `/api/users/${userId}/profile-picture`, { profilePicture });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      setDialogOpen(false);
      toast({
        title: "Profile updated",
        description: "Your profile picture has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile picture",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleUpload = () => {
    if (!imageUrl) {
      toast({
        title: "Please provide an image URL",
        description: "Enter a valid URL to an image to use as your profile picture",
        variant: "destructive",
      });
      return;
    }
    
    updateProfilePictureMutation.mutate(imageUrl);
  };
  
  return (
    <>
      <Button 
        size="icon" 
        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
        onClick={() => setDialogOpen(true)}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Enter a URL to an image to use as your profile picture
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="avatar-url" className="text-sm font-medium">
                Image URL
              </label>
              <input
                id="avatar-url"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/my-image.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={updateProfilePictureMutation.isPending}
            >
              {updateProfilePictureMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function UserProfile() {
  const [match, params] = useRoute<{ id: string }>("/user/:id");
  const { user: currentUser } = useAuth();
  
  const { data: user, isLoading: userLoading } = useQuery<Omit<User, "password">>({
    queryKey: [`/api/users/${params?.id}`],
    enabled: !!params?.id,
  });
  
  const { data: scripts, isLoading: scriptsLoading } = useQuery<Script[]>({
    queryKey: [`/api/scripts/user/${params?.id}`],
    enabled: !!params?.id,
  });
  
  const isLoading = userLoading || scriptsLoading;
  const isOwnProfile = currentUser && user && currentUser.id === user.id;
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The user you are looking for does not exist.</p>
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
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    {user.profilePicture ? (
                      <AvatarImage src={user.profilePicture} alt={user.username} />
                    ) : null}
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isOwnProfile && (
                    <ProfilePictureUploader userId={user.id} />
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <h1 className="text-3xl font-bold">
                      {user.username}
                    </h1>
                    {user.verified && (
                      <span 
                        className="inline-flex items-center text-primary bg-primary/10 rounded-full p-1" 
                        title="Verified Creator"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center justify-center md:justify-start text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined {formatDistanceToNow(new Date(user.createdAt || new Date()), { addSuffix: true })}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="bg-card p-3 rounded-lg text-center min-w-[100px]">
                      <div className="text-2xl font-bold">{scripts?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Scripts</div>
                    </div>
                    
                    <div className="bg-card p-3 rounded-lg text-center min-w-[100px]">
                      <div className="text-2xl font-bold">
                        {scripts?.reduce((total, script) => total + (script.downloads || 0), 0) || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Downloads</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 mt-4 md:mt-0">
                  {isOwnProfile && (
                    <Link href="/create">
                      <Button>Create New Script</Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="scripts">
          <TabsList className="mb-6">
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scripts">
            {scripts && scripts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scripts.map((script) => (
                  <ScriptCard key={script.id} script={script} showAuthor={false} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <FileCode className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Scripts Yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile
                    ? "You haven't published any scripts yet."
                    : `${user.username} hasn't published any scripts yet.`}
                </p>
                {isOwnProfile && (
                  <Link href="/create">
                    <Button className="mt-4">Create Your First Script</Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
