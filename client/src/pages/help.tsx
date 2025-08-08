import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronRight,
  Send,
  Mic,
  MicOff,
  Bot,
  User
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Speech Recognition type declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export default function Help() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm here to help you with any questions about SaintVisionAI, HACP™ technology, or our platform. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech recognition setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: "help_support"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '_assistant',
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '_user',
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessage.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else {
      recognition.current?.start();
      setIsListening(true);
    }
  };

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Get instant help from our AI-powered support team",
      action: "Start Chat",
      availability: "24/7 Available",
      color: "from-blue-600 to-blue-800",
      onClick: () => setShowChat(true)
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send detailed questions to our expert support team",
      action: "Send Email",
      availability: "24hr Response",
      color: "from-orange-600 to-orange-800",
      onClick: () => window.open('mailto:support@saintvisionai.com', '_blank')
    },
    {
      icon: Phone,
      title: "Priority Support",
      description: "Direct phone line for Enterprise customers",
      action: "Call Now",
      availability: "Business Hours",
      color: "from-purple-600 to-purple-800",
      onClick: () => {
        // Initiate Twilio call
        fetch('/api/twilio/call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'initiate_support_call' })
        }).then(() => {
          alert('A support specialist will call you within 5 minutes.');
        }).catch(() => {
          // Fallback to regular phone link
          window.open('tel:+1-855-724-6824', '_blank');
        });
      }
    }
  ];

  const categories = [
    {
      title: "Getting Started",
      questions: [
        { title: "Quick Setup Guide", question: "Can you provide a quick setup guide for getting started with SaintVisionAI?" },
        { title: "Your First SaintSal Conversation", question: "How do I have my first conversation with SaintSal™ and what should I expect?" },
        { title: "Understanding HACP™ Technology", question: "What is HACP™ (Human-AI Connection Protocol) technology and how does it work?" },
        { title: "Account Setup & Preferences", question: "How do I set up my account and configure my preferences in SaintVisionAI?" }
      ]
    },
    {
      title: "Features & Tools",
      questions: [
        { title: "WarRoom Productivity Suite", question: "What is the WarRoom Productivity Suite and how can it help me be more productive?" },
        { title: "AI Tools & Automation", question: "What AI tools and automation features are available in SaintVisionAI?" },
        { title: "CRM Integration Guide", question: "How do I integrate SaintVisionAI with my CRM system?" },
        { title: "Advanced Search Features", question: "What advanced search features does SaintVisionAI offer and how do I use them?" }
      ]
    },
    {
      title: "Billing & Plans",
      questions: [
        { title: "Plan Comparison & Upgrades", question: "Can you explain the different subscription plans and help me choose the right one?" },
        { title: "Billing & Payment Methods", question: "How does billing work and what payment methods do you accept?" },
        { title: "Enterprise Licensing", question: "What enterprise licensing options are available for larger organizations?" },
        { title: "Refund & Cancellation Policy", question: "What is your refund and cancellation policy?" }
      ]
    },
    {
      title: "Security & Privacy",
      questions: [
        { title: "Data Protection & GDPR", question: "How does SaintVisionAI protect my data and ensure GDPR compliance?" },
        { title: "Security Best Practices", question: "What security best practices should I follow when using SaintVisionAI?" },
        { title: "API Keys & Authentication", question: "How do I manage my API keys and authentication settings?" },
        { title: "Compliance Documentation", question: "Where can I find compliance documentation and certifications?" }
      ]
    },
    {
      title: "API & Integration",
      questions: [
        { title: "API Documentation", question: "Where can I find the API documentation and how do I get started with the API?" },
        { title: "Webhook Setup Guide", question: "How do I set up webhooks to integrate SaintVisionAI with my systems?" },
        { title: "Third-party Integrations", question: "What third-party integrations are available and how do I set them up?" },
        { title: "Developer Resources", question: "What developer resources are available for building with SaintVisionAI?" }
      ]
    },
    {
      title: "Troubleshooting",
      questions: [
        { title: "Common Issues & Solutions", question: "What are some common issues users face and how can I resolve them?" },
        { title: "Performance Optimization", question: "How can I optimize the performance of SaintVisionAI for my use case?" },
        { title: "Browser Compatibility", question: "What browsers are supported and how do I resolve compatibility issues?" },
        { title: "System Status & Updates", question: "How can I check system status and stay informed about updates?" }
      ]
    }
  ];

  const handleQuestionClick = (question: string) => {
    // Add the question as a user message
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '_user',
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowChat(true);
    
    // Send the question to the assistant
    sendMessage.mutate(question);
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
        <Header />
        
        <div className="flex-1 container mx-auto px-4 py-8 pt-24">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-[#d4af37]" />
                <h1 className="text-2xl font-bold text-white">Live Support Chat</h1>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowChat(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Back to Help
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-4 overflow-y-auto min-h-[500px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' ? 'bg-[#d4af37]' : 'bg-blue-600'
                      }`}>
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-[#d4af37] text-black' 
                          : 'bg-gray-800 text-white border border-gray-600'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-black/70' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {sendMessage.isPending && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="bg-gray-800 border-gray-600 pr-12"
                  disabled={sendMessage.isPending}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                    isListening ? 'text-red-400' : 'text-gray-400'
                  }`}
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sendMessage.isPending}
                className="bg-[#d4af37] text-black hover:bg-[#b8941f] px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              How Can We Help You?
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Get instant answers, watch tutorials, or connect with our expert support team. 
              We're here to ensure your success with Saint Vision AI.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, tutorials, or FAQs..."
                className="pl-12 py-4 text-lg bg-gray-900/50 border-gray-700 rounded-lg"
              />
            </div>
          </div>

          {/* Support Options */}
          <div className="mb-16">
            {/* Featured Live Chat Support - Centered and Larger */}
            <div className="max-w-2xl mx-auto mb-8">
              {(() => {
                const chatOption = supportOptions[0];
                const ChatIcon = chatOption.icon;
                return (
                  <Card className="bg-gray-900/50 border-gray-700 hover:border-[#d4af37] transition-all cursor-pointer group" onClick={chatOption.onClick}>
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-lg bg-gradient-to-br ${chatOption.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <ChatIcon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3">{chatOption.title}</h3>
                      <p className="text-gray-400 mb-6">{chatOption.description}</p>
                      <Button className="w-full bg-[#d4af37] text-black hover:bg-[#b8941f] mb-3 py-3 text-lg">
                        {chatOption.action}
                      </Button>
                      <p className="text-sm text-[#d4af37]">{chatOption.availability}</p>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
            
            {/* Email and Phone Support - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {supportOptions.slice(1).map((option, index) => (
                <Card key={index + 1} className="bg-gray-900/50 border-gray-700 hover:border-[#d4af37] transition-all cursor-pointer group" onClick={option.onClick}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <option.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{option.description}</p>
                    <Button className="w-full bg-[#d4af37] text-black hover:bg-[#b8941f] mb-2">
                      {option.action}
                    </Button>
                    <p className="text-xs text-[#d4af37]">{option.availability}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Interactive Q&A by Category */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-2">Ask Our AI Assistant</h2>
            <p className="text-gray-400 mb-8">Click on any topic below to start a conversation with our AI support team</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-[#d4af37] transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">{category.title}</h3>
                    <div className="space-y-2">
                      {category.questions.map((item, questionIndex) => (
                        <div 
                          key={questionIndex} 
                          className="flex items-center justify-between text-gray-300 hover:text-[#d4af37] cursor-pointer transition-colors p-2 rounded hover:bg-gray-800/50"
                          onClick={() => handleQuestionClick(item.question)}
                        >
                          <span className="text-sm">{item.title}</span>
                          <MessageCircle className="h-4 w-4" />
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                      onClick={() => {
                        setShowChat(true);
                        const categoryQuestion = `I have questions about ${category.title.toLowerCase()}. Can you help me understand what options are available in this category?`;
                        const userMessage: ChatMessage = {
                          id: Date.now().toString() + '_user',
                          role: 'user',
                          content: categoryQuestion,
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, userMessage]);
                        sendMessage.mutate(categoryQuestion);
                      }}
                    >
                      Ask About {category.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Still Need Help */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Still Need Help?</h2>
            <p className="text-gray-400 mb-8">Our expert support team is standing by to assist you with any questions or technical issues.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-[#d4af37] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">24/7 Live Support</h3>
                <p className="text-gray-400 text-sm mb-4">Instant chat with our AI-powered support team</p>
                <Button 
                  className="bg-[#d4af37] text-black hover:bg-[#b8941f]"
                  onClick={() => setShowChat(true)}
                >
                  Start Chat
                </Button>
              </div>
              
              <div className="text-center">
                <Phone className="h-12 w-12 text-[#d4af37] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Expert Consultation</h3>
                <p className="text-gray-400 text-sm mb-4">Schedule a call with our technical specialists</p>
                <Button variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                  Book Meeting
                </Button>
              </div>
              
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-[#d4af37] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Community Forum</h3>
                <p className="text-gray-400 text-sm mb-4">Connect with other users and share solutions</p>
                <Button variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                  Join Forum
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Average response time: 2 minutes
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                98% satisfaction rate
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                99.9% uptime guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}