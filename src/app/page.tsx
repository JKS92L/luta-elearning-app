import { HeroSection } from "@/components/home/hero-section";
import { ClassCards } from "@/components/home/class-cards";

export default function Home() {
  return (
    <div className="flex-1">
      <HeroSection />
      <ClassCards />
    </div>
  );
}
