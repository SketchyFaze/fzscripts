import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import CodeBlock from "@/components/code-block";

const scriptSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),
  code: z
    .string()
    .min(10, "Code must be at least 10 characters")
    .max(50000, "Code must be at most 50000 characters"),
  language: z.string().min(1, "Language is required"),
  category: z.string().min(1, "Category is required"),
});

type ScriptFormValues = z.infer<typeof scriptSchema>;

export default function CreateScript() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [previewCode, setPreviewCode] = useState("");
  const [previewLanguage, setPreviewLanguage] = useState("javascript");

  const form = useForm<ScriptFormValues>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
      language: "",
      category: "",
    },
  });

  const createScriptMutation = useMutation({
    mutationFn: async (data: ScriptFormValues) => {
      if (!user) throw new Error("You must be logged in to create a script");
      
      const scriptData = {
        ...data,
        userId: user.id,
      };
      
      const res = await apiRequest("POST", "/api/scripts", scriptData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      toast({
        title: "Script Created",
        description: "Your script has been published successfully",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create script",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ScriptFormValues) {
    createScriptMutation.mutate(data);
  }

  const handleCodeChange = (value: string) => {
    form.setValue("code", value);
    setPreviewCode(value);
  };

  const handleLanguageChange = (value: string) => {
    form.setValue("language", value);
    setPreviewLanguage(value.toLowerCase());
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Publish a New Script</CardTitle>
            <CardDescription>
              Share your code with the FZScripts community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a descriptive title for your script"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A clear title helps others find your script
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what your script does, how to use it, and other important details"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide details about what your script does and how to use it
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select
                              onValueChange={(value) => handleLanguageChange(value)}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="csharp">C#</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                                <SelectItem value="php">PHP</SelectItem>
                                <SelectItem value="ruby">Ruby</SelectItem>
                                <SelectItem value="powershell">PowerShell</SelectItem>
                                <SelectItem value="bash">Bash</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="combat">Combat</SelectItem>
                                <SelectItem value="simulator">Simulator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="game-creation">Game Creation</SelectItem>
                                <SelectItem value="gui">GUI</SelectItem>
                                <SelectItem value="utility">Utility</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste your code here"
                              className="font-mono h-[300px] resize-none"
                              {...field}
                              onChange={(e) => handleCodeChange(e.target.value)}
                            />
                          </FormControl>
                          <FormDescription>
                            The source code of your script
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {previewCode && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Preview</h3>
                    <div className="border rounded-md overflow-hidden">
                      <CodeBlock code={previewCode} language={previewLanguage} />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createScriptMutation.isPending}
                  >
                    {createScriptMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish Script"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
