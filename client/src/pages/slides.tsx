import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, ChevronDown } from "lucide-react";
import { slidesData } from "@shared/slides-data";

// Neon keyword highlighting function
const highlightKeywords = (text: string): JSX.Element => {
  const keywordPatterns = [
    { pattern: /HACP™/g, className: 'neon-cyan' },
    { pattern: /Human-AI Connection Protocol/g, className: 'neon-cyan' },
    { pattern: /SaintSal™/g, className: 'neon-gold' },
    { pattern: /Saint~DR™/g, className: 'text-green' },
    { pattern: /SAINT~DR\.™/g, className: 'text-green' },
    { pattern: /Saint Dr/g, className: 'text-green' },
    { pattern: /SaintVisionAI/g, className: 'neon-gold' },
    { pattern: /Cookin'/g, className: 'neon-gold' },
    { pattern: /Cookin/g, className: 'neon-gold' },
    { pattern: /Azure/g, className: 'text-blue' },
    { pattern: /Supabase/g, className: 'text-green' },
    { pattern: /Twilio/g, className: 'text-purple' },
    { pattern: /OpenAI/g, className: 'text-blue' },
    { pattern: /USPTO #10,290,222/g, className: 'neon-purple' },
    { pattern: /\$[0-9,]+(?!.*550)/g, className: 'neon-green' },
    { pattern: /Oppenheimer/g, className: 'text-blue' },
    { pattern: /Wells Fargo/g, className: 'neon-gold' },
    { pattern: /JP Morgan/g, className: 'text-light-sky-blue' },
    { pattern: /JPMorgan/g, className: 'text-light-sky-blue' },
    { pattern: /saintvisionai\.com/g, className: 'neon-cyan' },
    { pattern: /saintsal-ai\.com/g, className: 'neon-cyan' },
    { pattern: /saintvisiongroup\.com/g, className: 'neon-cyan' },
    { pattern: /saintvisiontech\.com/g, className: 'neon-cyan' },
    { pattern: /saintvisions\.com/g, className: 'neon-cyan' },
    { pattern: /stvisiongroup\.com/g, className: 'neon-cyan' },
    { pattern: /authoritiveai\.com/g, className: 'neon-cyan' },
    { pattern: /partnertech\.ai/g, className: 'neon-cyan' },
    { pattern: /vizque\.com/g, className: 'neon-cyan' },
    { pattern: /Vizque/g, className: 'neon-cyan' },
    { pattern: /cookinknowledge\.com/g, className: 'neon-cyan' },
    { pattern: /PartnerTech\.ai/g, className: 'neon-cyan' }
  ];
  
  let result = text;
  let currentIndex = 0;
  const matches: { index: number; length: number; className: string }[] = [];
  
  keywordPatterns.forEach(({ pattern, className }) => {
    let match;
    pattern.lastIndex = 0; // Reset regex
    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        className
      });
    }
  });
  
  // Sort matches by index and remove overlaps
  matches.sort((a, b) => a.index - b.index);
  const cleanMatches: { index: number; length: number; className: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const isOverlapping = cleanMatches.some(existing => 
      (current.index >= existing.index && current.index < existing.index + existing.length)
    );
    if (!isOverlapping) {
      cleanMatches.push(current);
    }
  }
  
  if (cleanMatches.length === 0) {
    return <span>{text}</span>;
  }
  
  // Build the final parts array
  const parts: { text: string; className?: string }[] = [];
  currentIndex = 0;
  
  cleanMatches.forEach((match) => {
    if (match.index > currentIndex) {
      parts.push({ text: text.slice(currentIndex, match.index) });
    }
    parts.push({
      text: text.slice(match.index, match.index + match.length),
      className: match.className
    });
    currentIndex = match.index + match.length;
  });
  
  if (currentIndex < text.length) {
    parts.push({ text: text.slice(currentIndex) });
  }
  
  return (
    <span>
      {parts.map((part, index) => 
        part.className ? (
          <span key={index} className={part.className}>
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </span>
  );
};

// Scroll Indicators Component
const ScrollIndicators = () => {
  const [scrollableElements, setScrollableElements] = useState<HTMLElement[]>([]);
  
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-container');
    const scrollableEls: HTMLElement[] = [];
    
    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.scrollHeight > htmlEl.clientHeight) {
        scrollableEls.push(htmlEl);
      }
    });
    
    setScrollableElements(scrollableEls);
  }, []);

  if (scrollableElements.length === 0) return null;

  return (
    <>
      {scrollableElements.map((element, index) => (
        <ScrollIndicator key={index} element={element} />
      ))}
    </>
  );
};

// Individual Scroll Indicator
const ScrollIndicator = ({ element }: { element: HTMLElement }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      const canScroll = element.scrollHeight > element.clientHeight;
      
      setIsVisible(canScroll);
      setPosition({
        top: rect.top + window.scrollY + 10,
        right: 20
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    element.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      element.removeEventListener('scroll', updatePosition);
    };
  }, [element]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-20 pointer-events-none"
      style={{ 
        top: `${position.top}px`, 
        right: `${position.right}px` 
      }}
    >
      <div className="flex flex-col items-center space-y-1 bg-black/60 backdrop-blur-sm rounded-lg p-2">
        <div className="w-1 h-8 bg-gradient-to-b from-[#d4af37] to-transparent rounded-full animate-pulse" />
        <ChevronDown className="h-4 w-4 text-[#d4af37] animate-bounce" />
        <div className="text-xs text-gray-300 text-center">
          Scroll
        </div>
      </div>
    </div>
  );
};

export default function Slides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slidesData[currentSlide];

  const renderSlideContent = () => {
    switch (slide.layout) {
      case 'title':
        return (
          <div className="flex flex-col justify-center items-center h-full text-center px-6 py-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-[#d4af37] leading-tight">
              {highlightKeywords(slide.title)}
            </h1>
            {slide.subtitle && (
              <p className="text-base md:text-lg text-gray-300 mb-4">
                {highlightKeywords(slide.subtitle)}
              </p>
            )}
            <div className="max-w-6xl space-y-2 overflow-y-auto max-h-64 scroll-container">
              {slide.content.map((item, index) => (
                <p key={index} className="text-xs md:text-sm text-gray-200 leading-relaxed">
                  {highlightKeywords(item)}
                </p>
              ))}
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="h-full p-4 flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-[#d4af37]">
              {highlightKeywords(slide.title)}
            </h1>
            {slide.subtitle && (
              <p className="text-base text-gray-300 mb-4">
                {highlightKeywords(slide.subtitle)}
              </p>
            )}
            <div className="space-y-2 max-w-6xl overflow-y-auto max-h-80 scroll-container">
              {slide.content.map((item, index) => (
                <p key={index} className="text-xs md:text-sm text-gray-200 leading-relaxed">
                  {highlightKeywords(item)}
                </p>
              ))}
            </div>
          </div>
        );

      case 'image-content':
        return (
          <div className="h-full flex">
            <div className="w-1/2 p-6 flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#d4af37]">
                {highlightKeywords(slide.title)}
              </h1>
              <div className="space-y-3 overflow-y-auto max-h-80 scroll-container">
                {slide.content.map((item, index) => (
                  <p key={index} className="text-sm md:text-base text-gray-200 leading-relaxed">
                    {highlightKeywords(item)}
                  </p>
                ))}
              </div>
            </div>
            <div className="w-1/2 flex items-center justify-center p-6">
              {slide.backgroundImage && (
                <img 
                  src={slide.backgroundImage} 
                  alt="Slide visual"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="h-full p-6 flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-[#d4af37] text-center">
              {highlightKeywords(slide.title)}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto overflow-y-auto max-h-80 scroll-container">
              {slide.content.map((item, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                    {highlightKeywords(item)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'full-image':
        return (
          <div 
            className="h-full flex items-center justify-center relative"
            style={{
              backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 text-center p-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#d4af37]">
                {highlightKeywords(slide.title)}
              </h1>
              <div className="space-y-4 max-w-4xl">
                {slide.content.map((item, index) => (
                  <p key={index} className="text-lg text-white leading-relaxed">
                    {highlightKeywords(item)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full p-4 flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-[#d4af37]">
              {highlightKeywords(slide.title)}
            </h1>
            <div className="space-y-2 max-w-6xl overflow-y-auto max-h-80 scroll-container">
              {slide.content.map((item, index) => (
                <p key={index} className="text-xs md:text-sm text-gray-200 leading-relaxed">
                  {highlightKeywords(item)}
                </p>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-[#0f0f0f] text-white">
      <Header />
      
      {/* Main Presentation Area */}
      <main className="h-screen relative">
        {/* Slide Content */}
        <div 
          className="h-[calc(100vh-4rem)] w-full mt-16"
          style={{
            backgroundColor: slide.backgroundColor || '#0f0f0f',
            backgroundImage: slide.backgroundImage && slide.layout !== 'image-content' ? `url(${slide.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {renderSlideContent()}
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/70 backdrop-blur-sm rounded-lg px-6 py-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevSlide}
            className="text-white hover:text-[#d4af37]"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <span className="text-white font-medium">
            {currentSlide + 1} / 17
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextSlide}
            className="text-white hover:text-[#d4af37]"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-white hover:text-[#d4af37]"
          >
            {isAutoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>

        {/* Slide Dots - Better spacing for 17 slides */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1 max-w-4xl overflow-x-auto px-4">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors flex-shrink-0 ${
                index === currentSlide ? 'bg-[#d4af37]' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Footer Note - Positioned at very bottom to avoid blocking content */}
        {slide.footer && (
          <div className="absolute bottom-2 left-0 right-0 bg-black/60 text-center py-1 z-10">
            <p className="text-xs text-gray-400">{highlightKeywords(slide.footer)}</p>
          </div>
        )}

        {/* Scroll Indicators */}
        <ScrollIndicators />
      </main>
    </div>
  );
}