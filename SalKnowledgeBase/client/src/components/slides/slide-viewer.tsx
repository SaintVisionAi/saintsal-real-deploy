import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  TrendingUp, 
  Globe, 
  GraduationCap, 
  Heart, 
  Book, 
  History,
  CheckCircle,
  Users,
  Shield,
  DollarSign,
  Trophy,
  Rocket
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  backgroundImage: string;
}

interface SlideViewerProps {
  slide: Slide;
}

export function SlideViewer({ slide }: SlideViewerProps) {
  const renderSlideContent = () => {
    switch (slide.id) {
      case 0: // Wall Street Presence
        return (
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="mb-8">
              <div className="text-8xl md:text-9xl font-thin gradient-text mb-4">SV</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">SAINTVISIONAI</h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">WALL STREET</p>
            </div>
            <Card className="glass-effect border-primary/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
                  Establishing Our Financial Presence
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  SaintVisionAI is positioning itself at the heart of global finance, bringing revolutionary AI technology to Wall Street's most demanding environments.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <Badge className="px-4 py-2 bg-primary/20 text-primary border-primary/30">Patent Protected</Badge>
                  <Badge className="px-4 py-2 bg-primary/20 text-primary border-primary/30">Enterprise Ready</Badge>
                  <Badge className="px-4 py-2 bg-primary/20 text-primary border-primary/30">SEC Compliant</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 1: // Going Public
        return (
          <div className="text-center max-w-6xl mx-auto px-4">
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-12">
                <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-8">GOING PUBLIC</h1>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="text-left">
                    <h2 className="text-3xl font-bold mb-6">IPO Readiness</h2>
                    <div className="space-y-4 text-lg text-muted-foreground">
                      {[
                        "Patent Portfolio: $75M+ valuation",
                        "HACP™ Technology: U.S. Patent 10,290,222",
                        "SOC 2 Compliance & Enterprise Security",
                        "Delaware LP Structure"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center">
                          <CheckCircle className="text-primary mr-4 h-5 w-5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold mb-6">Market Position</h2>
                    <div className="space-y-6">
                      {[
                        { value: "$8,947+", label: "Revenue Generated" },
                        { value: "47+", label: "Satisfied Customers" },
                        { value: "99.9%", label: "Uptime Guarantee" }
                      ].map((stat, i) => (
                        <Card key={i} className="bg-secondary/50 border-primary/20">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-primary">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2: // Global Partnerships
        return (
          <div className="text-center max-w-7xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-12">Global Technology Partners</h1>
            
            <div className="relative mb-16">
              <div className="w-48 h-48 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 gold-glow">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-foreground">SV</div>
                  <div className="text-sm text-primary-foreground">SAINTVISIONAI</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { name: "Google", icon: Globe },
                  { name: "Microsoft", icon: Building2 },
                  { name: "OpenAI", icon: GraduationCap },
                  { name: "Apple", icon: Shield }
                ].map((partner, i) => (
                  <Card key={i} className="glass-effect border-primary/20 text-center">
                    <CardContent className="p-4">
                      <partner.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">{partner.name}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <Card className="glass-effect border-primary/20 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">Strategic Technology Alliances</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Our HACP™ patent technology integrates seamlessly with the world's leading AI and cloud platforms, 
                  creating unprecedented opportunities for enterprise innovation and collaboration.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { value: "4", label: "Fortune 10 Partners" },
                    { value: "Global", label: "Market Reach" },
                    { value: "Enterprise", label: "Grade Integration" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3: // AI Research Institute
        return (
          <div className="text-center max-w-6xl mx-auto px-4">
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-12">
                <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-8">SAINT VISION AI</h1>
                <h2 className="text-3xl md:text-4xl font-bold mb-12">INSTITUTE FOR AI RESEARCH & DEVELOPMENT</h2>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="text-left space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-4">Research Focus Areas</h3>
                      <ul className="space-y-3 text-lg text-muted-foreground">
                        {[
                          { icon: GraduationCap, text: "Human-AI Connection Protocols" },
                          { icon: Heart, text: "Emotional Intelligence AI" },
                          { icon: Shield, text: "Enterprise Security Systems" },
                          { icon: Book, text: "Adaptive Learning Platforms" }
                        ].map((item, i) => (
                          <li key={i} className="flex items-center">
                            <item.icon className="text-primary mr-4 h-5 w-5" />
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="text-left space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-4">Innovation Pipeline</h3>
                      <div className="space-y-4">
                        {[
                          { name: "HACP™ Extensions", status: "Patent Pending", progress: 75 },
                          { name: "Memory Modules", status: "In Development", progress: 50 },
                          { name: "Persona Systems", status: "Research Phase", progress: 25 }
                        ].map((project, i) => (
                          <Card key={i} className="bg-secondary/50 border-primary/20">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{project.name}</span>
                                <Badge variant="outline" className="text-primary border-primary/30">
                                  {project.status}
                                </Badge>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4: // SaintSal + You
        return (
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Card className="bg-secondary glass-effect border-primary/20 mb-8">
                <CardContent className="p-8">
                  <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">saintsal™</h1>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">+ you</h2>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Your AI-Powered Success Partner</h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    SaintSal™ isn't just another chatbot. It's your intelligent business companion, 
                    powered by our patented HACP™ technology to understand, adapt, and grow with your needs.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: GraduationCap, title: "Adaptive Intelligence", desc: "Learns your communication style and preferences" },
                      { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant with military-grade encryption" },
                      { icon: Heart, title: "Emotional Intelligence", desc: "Understands context and responds with empathy" }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center p-4 bg-secondary/30 rounded-lg">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                          <feature.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{feature.title}</div>
                          <div className="text-sm text-muted-foreground">{feature.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-12">
                  <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
                    <span className="text-4xl font-bold text-primary-foreground">SV</span>
                  </div>
                  <h3 className="text-2xl font-bold gradient-text mb-4">Ready to Transform?</h3>
                  <p className="text-muted-foreground mb-8">
                    Join thousands of professionals who've discovered the power of truly intelligent AI assistance.
                  </p>
                  <Button className="bg-primary text-primary-foreground font-semibold px-8 py-3 hover:bg-primary/90 gold-glow">
                    Experience SaintSal™
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5: // Cookin' Knowledge
        return (
          <div className="max-w-6xl mx-auto px-4">
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="text-left">
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="text-6xl font-bold gradient-text">SV</div>
                      <div>
                        <h1 className="text-3xl font-bold">SAINT VISION</h1>
                        <h2 className="text-xl text-primary">GROUP LLC</h2>
                      </div>
                    </div>
                    
                    <Card className="bg-primary border-primary">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                            <span className="text-primary font-bold">SV</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-primary-foreground">Cookin'</h3>
                            <h3 className="text-xl font-medium text-primary-foreground">Knowledge</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-8">
                      <h3 className="text-2xl font-bold mb-6">Knowledge Management Platform</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        Our flagship knowledge platform combines enterprise-grade AI with intuitive user experience, 
                        making complex information instantly accessible and actionable.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="bg-secondary/50 border-primary/20">
                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold text-primary mb-4">Platform Features</h4>
                        <ul className="space-y-3 text-muted-foreground">
                          {[
                            { icon: Users, text: "Intelligent Search & Discovery" },
                            { icon: Users, text: "Collaborative Workspaces" },
                            { icon: TrendingUp, text: "Analytics & Insights" },
                            { icon: Globe, text: "Mobile-First Design" }
                          ].map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <feature.icon className="h-5 w-5 text-primary mr-3" />
                              <span>{feature.text}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-secondary/50 border-primary/20">
                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold text-primary mb-4">Success Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: "67%", label: "Learning Speed Increase" },
                            { value: "95%", label: "User Satisfaction" },
                            { value: "24/7", label: "Availability" },
                            { value: "10K+", label: "Active Users" }
                          ].map((metric, i) => (
                            <div key={i} className="text-center">
                              <div className="text-2xl font-bold text-primary">{metric.value}</div>
                              <div className="text-sm text-muted-foreground">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6: // SaintGPT Throwbacks
        return (
          <div className="max-w-6xl mx-auto px-4">
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-12">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center space-x-8 mb-8">
                    <div className="text-6xl font-bold gradient-text">SV</div>
                    <div className="text-left">
                      <h1 className="text-4xl font-bold">SAINTGPT</h1>
                      <h2 className="text-2xl text-primary">THROWBACKS</h2>
                    </div>
                  </div>
                  
                  <Card className="bg-primary border-primary inline-block">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                          <span className="text-primary font-bold">SV</span>
                        </div>
                        <div className="text-primary-foreground">
                          <h3 className="text-xl font-bold">Cookin'</h3>
                          <h3 className="text-lg font-medium">Knowledge</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: History, title: "Legacy Systems", desc: "Honoring our journey from early GPT implementations to today's enterprise-grade HACP™ technology." },
                    { icon: Trophy, title: "Championship Mentality", desc: "Like champions in the locker room, we celebrate our wins while preparing for the next challenge." },
                    { icon: Rocket, title: "Future Ready", desc: "Building on our foundation to create the next generation of human-AI collaboration platforms." }
                  ].map((item, i) => (
                    <Card key={i} className="bg-secondary/50 border-primary/20 text-center">
                      <CardContent className="p-6">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <item.icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-12 text-center">
                  <h3 className="text-2xl font-bold gradient-text mb-6">The Evolution Continues</h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                    From our early days as SaintGPT to becoming SaintVisionAI, we've never lost sight of our mission: 
                    creating AI that truly serves humanity with intelligence, integrity, and purpose.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {["Version 1.0", "HACP™ Patent", "Enterprise Scale", "IPO Ready"].map((badge, i) => (
                      <Badge key={i} className="px-6 py-2 bg-primary/20 text-primary border-primary/30">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Slide not found</div>;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center slide-transition p-4"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('${slide.backgroundImage}') center/cover`
      }}
    >
      {renderSlideContent()}
    </div>
  );
}
