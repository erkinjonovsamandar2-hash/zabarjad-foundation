import React, { Component, ErrorInfo, ReactNode } from "react";
import { PenTool, RefreshCcw, Home } from "lucide-react";
import zabarjadLogo from "@/assets/zabarjad-bird.png";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Zabarjad App Error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] dark:bg-[#0a0806] p-6 relative overflow-hidden">
          
          {/* Abstract Spilled Ink / Paper Texture Background */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter>
              <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center">
            
            {/* Ink Drop / Pen Icon */}
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-900/10 dark:bg-red-900/20 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-center shadow-lg">
                <PenTool className="w-8 h-8 text-red-600 dark:text-red-500" />
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground mb-4 drop-shadow-sm">
              Sahifalar <span className="text-red-600 dark:text-red-500">chalkashib</span> ketdi...
            </h1>
            
            <p className="font-sans text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10">
              Kutilmagan texnik nosozlik yuz berdi. Go'yoki siyoh to'kilib, matn o'chib qolgandek. Iltimos, sahifani qayta yuklang yoki bosh sahifaga qayting.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-xl font-bold font-sans text-sm transition-all shadow-md hover:shadow-lg focus:outline-none"
              >
                <RefreshCcw className="w-4 h-4" />
                Qayta yuklash
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-foreground px-8 py-3.5 rounded-xl font-bold font-sans text-sm transition-all focus:outline-none"
              >
                <Home className="w-4 h-4" />
                Bosh sahifa
              </button>
            </div>

            {/* Subtle branding at the bottom of the error card */}
            <div className="mt-16 flex flex-col items-center opacity-50">
              <img src={zabarjadLogo} alt="Logo" className="w-8 h-8 object-contain mb-2 grayscale" />
              <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-bold">Zabarjad Media</span>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;