import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Send, User, CheckCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create initial session
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat/sessions", {
        title: "New Chat Session"
      });
      return response.json();
    },
    onSuccess: (session: ChatSession) => {
      setCurrentSessionId(session.id);
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions"] });
    }
  });

  // Fetch messages for current session
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/sessions", currentSessionId, "messages"],
    enabled: !!currentSessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent: string) => {
      if (!currentSessionId) throw new Error("No session");
      
      const response = await apiRequest("POST", `/api/chat/sessions/${currentSessionId}/messages`, {
        role: "user",
        content: messageContent
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions", currentSessionId, "messages"] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Message Failed",
        description: "Unable to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Initialize session on mount
  useEffect(() => {
    if (user && !currentSessionId) {
      createSessionMutation.mutate();
    }
  }, [user, currentSessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentSessionId) return;
    
    sendMessageMutation.mutate(message.trim());
  };

  const quickQueries = [
    "How does HACP™ work?",
    "Tell me about pricing",
    "Enterprise features",
    "Security and compliance"
  ];

  const handleQuickQuery = (query: string) => {
    setMessage(query);
    if (currentSessionId) {
      sendMessageMutation.mutate(query);
    }
  };

  if (!user) {
    return (
      <Card className="glass-effect border-primary/20 h-96 flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Please sign in to access the chat interface.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-primary/20 h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b border-primary/20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold">SV</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text">SaintSal™</h2>
            <p className="text-sm text-muted-foreground">Your AI-Powered Business Assistant</p>
          </div>
          <div className="ml-auto">
            <Badge className="bg-green-900/30 text-green-400 border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-96 max-h-96">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        ) : messages.length === 0 ? (
          // Welcome Message
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">SV</span>
            </div>
            <Card className="bg-secondary border-primary/20 max-w-md">
              <CardContent className="p-4">
                <p className="text-muted-foreground">
                  Hello! I'm SaintSal™, your AI assistant powered by our patented HACP™ technology. 
                  How can I help you today?
                </p>
                <div className="text-xs text-muted-foreground mt-2">Just now</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          messages.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">SV</span>
                </div>
              )}
              
              <Card className={`max-w-md ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary border-primary/20"
              }`}>
                <CardContent className="p-4">
                  <p className={msg.role === "user" ? "text-primary-foreground" : "text-muted-foreground"}>
                    {msg.content}
                  </p>
                  <div className={`text-xs mt-2 ${
                    msg.role === "user" 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground"
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </CardContent>
              </Card>

              {msg.role === "user" && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {sendMessageMutation.isPending && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">SV</span>
            </div>
            <Card className="bg-secondary border-primary/20">
              <CardContent className="p-4">
                <div className="typing-indicator flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t border-primary/20">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Input
            type="text"
            placeholder="Ask SaintSal™ anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-secondary border-primary/20 focus:border-primary"
            disabled={sendMessageMutation.isPending || !currentSessionId}
          />
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow"
            disabled={sendMessageMutation.isPending || !message.trim() || !currentSessionId}
          >
            {sendMessageMutation.isPending ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickQueries.map((query, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuery(query)}
              className="bg-secondary/50 border-primary/20 hover:bg-primary/20 hover:text-primary text-xs"
              disabled={sendMessageMutation.isPending || !currentSessionId}
            >
              {query}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
