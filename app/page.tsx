import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BrainCog,
  Eye,
  Globe,
  MonitorSmartphone,
  ServerCog,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/cards';

const features = [
  {
    id: 1,
    name: 'Store your PDF Documents Securely',
    description:
      'Effortlessly organize and access all your important PDF files anytime, anywhere. Keep them safe, structured, and readily available whenever you need them.',
    icon: Globe,
    delay: 0,
  },
  {
    id: 2,
    name: 'AI-Powered Insights',
    description:
      'Leverage advanced AI capabilities to analyze and extract key information from your PDFs effortlessly.',
    icon: BrainCog,
    delay: 150,
  },
  {
    id: 3,
    name: 'Smart Search & Highlight',
    description:
      'Quickly find and highlight important sections in your documents using intelligent search functionality.',
    icon: Eye,
    delay: 300,
  },
  {
    id: 4,
    name: 'Multi-Device Accessibility',
    description:
      'Access and manage your documents seamlessly from your smartphone, tablet, or desktop.',
    icon: MonitorSmartphone,
    delay: 150,
  },
  {
    id: 5,
    name: 'Secure Cloud Storage',
    description:
      'Safeguard your files with encrypted cloud storage, ensuring data privacy and protection.',
    icon: ServerCog,
    delay: 300,
  },
  {
    id: 6,
    name: 'Lightning-Fast Performance',
    description:
      'Experience seamless document processing with ultra-fast response times and smooth navigation.',
    icon: Zap,
    delay: 450,
  },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-subtle"></div>
        <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-subtle delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-subtle delay-2000"></div>

        {/* Subtle floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* topleft logo */}

      <div className="absolute top-7 left-7 z-20">
  <Link href="/" className="group flex items-center gap-2">
    <div className="relative">
      {/* Background Glow Effect with Pulsating Halo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
      <div className="absolute inset-0 h-14 w-14 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-md opacity-40 animate-pulsate-halo"></div>

      {/* Rotating Ring with Subtle Scaling */}
      <div className="absolute inset-0 h-12 w-12 border border-dashed border-blue-200/20 rounded-full animate-spin-slow group-hover:animate-spin group-hover:scale-105 transition-transform duration-300"></div>

      {/* Main Logo Circle with Bounce */}
      <div className="relative h-10 w-10 bg-gradient-to-br from-purple-500/50 to-blue-500/50 rounded-full flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 animate-bounce-subtle">
        <Sparkles size={20} className="text-blue-100 animate-twinkle" />
      </div>

      {/* Orbiting Particle Effects */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-400/50 group-hover:bg-blue-400/50"
          style={{
            width: `${Math.random() * 5 + 3}px`,
            height: `${Math.random() * 5 + 3}px`,
            animation: `orbit ${Math.random() * 4 + 3}s infinite linear`,
            transformOrigin: 'center',
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 60}deg) translateX(25px)`, // Orbit radius
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Enhanced Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i + 6} // Unique keys
          className="absolute rounded-full bg-purple-300/30 group-hover:bg-blue-300/30 animate-float-rotate"
          style={{
            top: `${Math.random() * 60 - 30}px`,
            left: `${Math.random() * 60 - 30}px`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
    <span className="text-lg font-semibold text-white bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200 group-hover:text-blue-100 transition-colors duration-300 animate-fade-in-up animate-glow-text">
      Chat with PDF
    </span>
  </Link>
</div>


      {/* Hero Section */}
      <header className="relative z-10 pt-12 md:pt-24 pb-8 md:pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-grow">
        <div className="flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 md:mb-8 animate-fade-in border border-white/20">
            <Sparkles size={18} className="text-amber-300" />
            <span className="text-sm font-medium text-amber-200">Introducing</span>
          </div>

          <h1 className="text-6xl sm:text-6xl md:text-3xl lg:text-6xl font-bold tracking-tight mb-2 max-w-4xl animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 px-5 leading-[1.2]">
            Make your PDFs talk with intelligent, interactive chats
          </h1>

          <br/>
          <div className="relative mb-5 md:mb-8 w-full max-w-3xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-20 sm:opacity-30 animate-pulse-subtle"></div>
            <p className="relative bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 md:px-6 md:py-4 text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto animate-fade-in delay-75">
              Turn your static documents into dynamic conversations. Our AI-powered system lets you engage with your PDFs, ask questions, and extract insights effortlessly—making information more accessible and interactive than ever before.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-5 md:mt-8 animate-fade-in delay-150">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-lg hover:shadow-purple-500/20"
              >
                <span className="absolute inset-0 bg-white/20 animate-pulse-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center">
                  Start Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Floating illustration */}
          <div className="mt-8 md:mt-12 relative w-full max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-lg transform rotate-3 animate-pulse-subtle"></div>
            <div className="relative bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-3 sm:p-6 shadow-2xl">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="bg-white/5 rounded-lg p-2 sm:p-4 border border-white/10 animate-float animate-delay-100">
                  <div className="h-2 sm:h-4 w-2/3 bg-white/10 rounded mb-2 sm:mb-3"></div>
                  <div className="h-2 sm:h-4 w-3/4 bg-white/10 rounded mb-2 sm:mb-3"></div>
                  <div className="h-2 sm:h-4 w-1/2 bg-white/10 rounded"></div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/10 animate-float animate-delay-300">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-purple-500/30 flex items-center justify-center">
                      <BrainCog size={12} className="text-purple-200 sm:size-14" />
                    </div>
                    <div className="h-2 sm:h-4 w-1/2 bg-white/10 rounded"></div>
                  </div>
                  <div className="h-2 sm:h-4 w-full bg-white/10 rounded mb-2"></div>
                  <div className="h-2 sm:h-4 w-3/4 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Showcase Section */}
      <section className="relative z-10 py-10 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            Exceptional Features
          </h2>
          <p className="text-base md:text-lg text-blue-100/80 max-w-2xl mx-auto">
            Experience our meticulously crafted features that set a new standard in document intelligence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:bg-white/10 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${150 + feature.delay}ms` }}
              >
                <CardContent className="p-3 md:p-6">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full w-9 h-9 md:w-12 md:h-12 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-4 w-4 md:h-6 md:w-6 text-blue-200" aria-hidden="true" />
                  </div>
                  <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-3 text-white group-hover:text-blue-200 transition-colors duration-300">
                    {feature.name}
                  </h3>
                  <p className="text-xs md:text-base text-blue-100/70">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-10 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl blur-xl transform -rotate-1"></div>
          <div className="relative bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-xl p-4 md:p-8 lg:p-12 border border-white/10 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-grid-white/5 bg-grid-white/5 transform -skew-y-12 opacity-20"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="md:max-w-xl mb-5 md:mb-0 text-center md:text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-white">
                  Ready to Experience Document Intelligence?
                </h2>
                <p className="text-sm md:text-base text-blue-100/80 mb-4 md:mb-6">
                  Join the community of professionals who have revolutionized their document workflows with our AI solution.
                </p>
              </div>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-white text-gray-900 hover:text-gray-900 shadow-lg hover:shadow-white/20"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative flex items-center font-medium">
                    Get Started
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-8 md:py-12 px-4 bg-black/20 backdrop-blur-md border-t border-white/10 text-blue-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            {/* Footer Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-blue-200" />
              </div>
              <span className="text-lg font-medium text-white">Chat with PDF</span>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <Link href="/about" className="hover:text-blue-200 transition-colors">About</Link>
              <Link href="/features" className="hover:text-blue-200 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-blue-200 transition-colors">Pricing</Link>
              <Link href="/contact" className="hover:text-blue-200 transition-colors">Contact</Link>
            </div>

            {/* Copyright */}
            <div className="text-xs md:text-sm">
              <p> {new Date().getFullYear()} Chat with PDF. All rights reserved.</p>
            </div>
          </div>

          {/* Subtle Divider */}
          <div className="mt-6 h-px bg-white/5 w-full"></div>

          {/* Additional Info */}
          <div className="mt-4 text-center text-xs">
            <p>Document Intelligence for Modern Professionals</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;