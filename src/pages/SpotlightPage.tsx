import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EpicSpotlight from "@/components/EpicSpotlight";

const SpotlightPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <EpicSpotlight />
      </div>
      <Footer />
    </div>
  );
};

export default SpotlightPage;
