
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface UIOverlayProps {
  title?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  title = "Organize Your Creative Chaos",
  ctaText = "Get Started",
  onCtaClick = () => console.log("CTA clicked")
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center p-4 z-10">
      <div className="w-full max-w-3xl text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl text-creative-light-purple mb-8 max-w-xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          Turn your chaotic ideas into beautifully organized projects with our innovative platform
        </p>
        
        <div className="opacity-0 animate-fade-in pointer-events-auto" style={{ animationDelay: '1.1s' }}>
          <Button 
            onClick={onCtaClick}
            className="bg-creative-purple hover:bg-creative-purple/90 px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
