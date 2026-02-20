import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EpicSpotlight from "@/components/EpicSpotlight";
import MatchmakerQuiz from "@/components/MatchmakerQuiz";
import CuratedLibrary from "@/components/CuratedLibrary";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import GoldenThread from "@/components/GoldenThread";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <GoldenThread />
      <Navbar />
      <Hero />
      <EpicSpotlight />
      <MatchmakerQuiz />
      <CuratedLibrary />
      <Blog />
      <Footer />
    </div>
  );
};

export default Index;
