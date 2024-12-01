import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import Phases from "./Phases/Phases";

export default function Home() {
  return (
    <div className="App">
      <HeroSection />
      <FeaturesSection />
      <Phases />
      <Footer />
    </div>
  );
}
