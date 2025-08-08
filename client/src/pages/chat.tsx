import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { Send, Mic, MicOff, Plus, MessageSquare, User, Settings, BarChart3, Paperclip, Volume2, VolumeX, Upload, X } from "lucide-react";
import svLogoImg from "@assets/svt sick transparent square  copy_1754542505330.png";
import saintSalYouImg from "@assets/SaintSal + You_1754541150175.png";
import userIconImg from "@assets/Rectangle 8_1754596874913.png";
import { useAdvancedAgent } from "@/hooks/useAdvancedAgent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  capabilities_used?: string[];
  metadata?: Record<string, any>;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  agentSessionId?: string;
}

export default function Chat() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    currentSession: agentSession,
    sessionData,
    sendMessage: sendAdvancedMessage,
    getSessionInfo,
    createSession: createAgentSession,
    isLoading: agentLoading
  } = useAdvancedAgent();

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // Initialize speech recognition with Azure Speech fallback
  useEffect(() => {
    // Try Azure Speech Services first, then fallback to browser speech recognition
    const initializeSpeechRecognition = async () => {
      // First try browser-based speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          toast({
            title: "Speech Recognition Error",
            description: "Could not recognize speech. Please try again.",
            variant: "destructive",
          });
        };
      }
    };
    
    initializeSpeechRecognition();

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  const createNewSession = () => {
    const agentSessionId = createAgentSession();
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      agentSessionId
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const toggleListening = async () => {
    if (isListening) {
      // Stop current recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Try Azure Speech Services first
    try {
      const response = await fetch('/api/speech/start-recognition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        // Azure Speech Services available
        setIsListening(true);
        // TODO: Implement Azure Speech Services WebSocket connection
        toast({
          title: "Enhanced Speech Recognition",
          description: "Using Azure Speech Services for better accuracy.",
        });
        return;
      }
    } catch (error) {
      console.log('Azure Speech not available, using browser fallback');
    }

    // Fallback to browser speech recognition
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  const speakMessage = (text: string) => {
    if (!speechSynthRef.current) {
      toast({
        title: "Speech Synthesis Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    if (isSpeaking) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthRef.current.speak(utterance);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
      toast({
        title: "Files Uploaded",
        description: `${files.length} file(s) added for analysis.`,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
      toast({
        title: "Files Selected",
        description: `${files.length} file(s) added for analysis.`,
      });
    }
  };

  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + "..." 
      : firstMessage;
    
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title }
        : session
    ));
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      createNewSession();
      sessionId = Date.now().toString();
      setCurrentSessionId(sessionId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
      timestamp: new Date()
    };

    // Add user message
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    ));

    // Update session title if this is the first message
    const session = sessions.find(s => s.id === sessionId);
    if (!session || session.messages.length === 0) {
      updateSessionTitle(sessionId, messageContent);
    }

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          sessionId: sessionId,
          files: uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        capabilities_used: data.capabilities_used,
        metadata: data.metadata
      };

      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, messages: [...session.messages, assistantMessage] }
          : session
      ));

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from SaintSal™. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };



  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('saintsal-chat-sessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        if (parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error('Failed to load saved sessions:', error);
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('saintsal-chat-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const samplePrompts = [
    "Explain HACP™ protocol capabilities",
    "Help me write a professional email",
    "Create a technical presentation outline", 
    "Analyze this business scenario"
  ];

  return (
    <div className="h-screen bg-[#0f0f0f] flex flex-col">
      <Header />
      
      <div className="flex-1 flex mt-24" style={{ height: 'calc(100vh - 160px)' }}>
        {/* Sidebar */}
        <div className="w-64 bg-[#171717] border-r border-gray-800 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800">
            <Button 
              onClick={createNewSession}
              className="w-full bg-[#d4af37] text-black hover:bg-[#b8941f] flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-2">Today</div>
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`w-full text-left p-2 rounded hover:bg-gray-800 transition-colors mb-1 ${
                    currentSessionId === session.id ? 'bg-gray-800' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 truncate">{session.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-1">
            <Link href="/slides">
              <button className="w-full text-left p-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-2 text-gray-300 hover:text-white">
                <div className="w-4 h-4 bg-[#d4af37] rounded"></div>
                <span className="text-sm">Presentation</span>
              </button>
            </Link>
            <Link href="/help">
              <button className="w-full text-left p-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-2 text-gray-300 hover:text-white">
                <div className="w-4 h-4 bg-[#00ff88] rounded"></div>
                <span className="text-sm">Help Desk</span>
              </button>
            </Link>
            <Link href="/analytics">
              <button className="w-full text-left p-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-2 text-gray-300 hover:text-white">
                <BarChart3 className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm">Agent Analytics</span>
              </button>
            </Link>
            <Link href="/admin">
              <button className="w-full text-left p-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-2 text-gray-300 hover:text-white">
                <div className="w-4 h-4 bg-[#d4af37] rounded"></div>
                <span className="text-sm">Admin Dashboard</span>
              </button>
            </Link>
            <Link href="/signin">
              <button className="w-full text-left p-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-2 text-gray-300 hover:text-white">
                <div className="w-4 h-4 bg-white rounded"></div>
                <span className="text-sm">Account</span>
              </button>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <img 
                src={svLogoImg} 
                alt="SaintVisionAI" 
                className="h-8 w-8 object-contain"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">SaintVisionAI</div>
                <div className="text-xs text-gray-400">Cookin' Knowledge</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="border-b border-gray-800 p-4 bg-[#0f0f0f] flex-shrink-0">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1 rounded-full">
                <div className="text-[#d4af37] text-sm font-medium">GPT-4o</div>
                <div className="w-1 h-1 bg-[#d4af37] rounded-full"></div>
                <div className="text-gray-400 text-sm">SaintSal™</div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="text-[#00ff88] text-xs">HACP™</div>
              </div>
            </div>
          </div>

          {/* Messages Container - Fixed Height with Scroll */}
          <div 
            className={`flex-1 overflow-y-auto transition-all duration-200 ${
              dragActive ? 'bg-[#d4af37]/10 border-2 border-[#d4af37] border-dashed' : ''
            }`}
            style={{ maxHeight: 'calc(100% - 120px)' }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {dragActive && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="text-center">
                  <Upload className="h-16 w-16 text-[#d4af37] mx-auto mb-4" />
                  <p className="text-[#d4af37] text-xl font-medium">Drop files here to analyze</p>
                  <p className="text-gray-400 text-sm mt-2">Support for documents, images, and more</p>
                </div>
              </div>
            )}
            
            {currentSession && currentSession.messages.length > 0 ? (
            <div className="max-w-3xl mx-auto p-4 pb-6 space-y-6">
              {currentSession.messages.map((message) => (
                <div key={message.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    {message.role === "user" ? (
                      <img 
                        src={userIconImg} 
                        alt="User" 
                        className="w-8 h-8 rounded-full object-contain"
                      />
                    ) : (
                      <img 
                        src={svLogoImg} 
                        alt="SaintSal" 
                        className="w-8 h-8 rounded-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-300">
                        {message.role === "user" ? "You" : "SaintSal™"}
                      </div>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => speakMessage(message.content)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-[#d4af37]"
                          >
                            {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-white whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    {message.capabilities_used && message.capabilities_used.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.capabilities_used.map((capability, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-[#d4af37]/20 text-[#d4af37] rounded-full border border-[#d4af37]/30"
                          >
                            {capability.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <img 
                    src={svLogoImg} 
                    alt="SaintSal" 
                    className="w-8 h-8 rounded-full flex-shrink-0 object-contain"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-300 mb-1">SaintSal™</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="flex-1 flex items-center justify-center relative"
              style={{
                backgroundImage: `url(${saintSalYouImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 text-center max-w-3xl mx-auto p-8">
                <div className="mb-12">
                  <p className="text-white text-3xl font-light mb-8 drop-shadow-lg">
                    How can I help you today?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
                  {samplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        console.log('Prompt clicked:', prompt);
                        sendMessage(prompt);
                      }}
                      disabled={isLoading}
                      className="p-6 text-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      <div className="text-base text-white font-medium pointer-events-none">{prompt}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          {/* Bottom spacing to ensure last message is visible above input */}
          <div className="h-24"></div>
          </div>

          {/* Input Area - Fixed at Bottom */}
          <div className="border-t border-gray-800 p-4 bg-[#0f0f0f] flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              {/* File Upload Area */}
              {uploadedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1 rounded-lg text-sm">
                      <Paperclip className="h-3 w-3 text-[#d4af37]" />
                      <span className="text-gray-300">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="h-4 w-4 p-0 text-gray-400 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Send a message"
                      className="w-full px-4 py-3 pr-16 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] resize-none overflow-hidden"
                      rows={1}
                      style={{
                        minHeight: '48px',
                        maxHeight: '120px',
                        height: 'auto'
                      }}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.mp3,.mp4,.wav"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 w-8 p-0 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={toggleListening}
                        className={`h-8 w-8 p-0 rounded-full ${
                          isListening 
                            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!input.trim() || isLoading}
                        className="h-8 w-8 p-0 bg-[#d4af37] hover:bg-[#b8941f] text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500">
                  SaintSal™ can make mistakes. Consider checking important information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}