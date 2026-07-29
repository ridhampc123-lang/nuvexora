import React from "react";
import { Container } from "@/components/ui/container";
import { HeroBackground } from "./hero/hero-background";
import { HeroLeft } from "./hero/hero-left";
import { HeroRightVisual } from "./hero/hero-right-visual";

export function Hero() {
  return (
    <section 
      aria-label="Nuvexora Technologies Hero"
      className="relative overflow-hidden bg-background text-foreground pt-12 sm:pt-16 pb-12 sm:pb-16 lg:py-20 min-h-[82vh] flex items-center justify-center"
    >
      {/* Dynamic Background with Radial Glows and Grid */}
      <HeroBackground />

      <Container size="2xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 items-center">
          {/* Left Column: Headlines, Copy, CTAs, Statistics */}
          <div className="lg:col-span-6 xl:col-span-6">
            <HeroLeft />
          </div>

          {/* Right Column: Interactive Technology Illustration */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <HeroRightVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}