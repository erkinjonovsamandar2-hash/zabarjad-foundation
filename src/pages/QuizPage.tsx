import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MatchmakerQuiz from "@/components/MatchmakerQuiz";

const QuizPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <MatchmakerQuiz />
      </div>
      <Footer />
    </div>
  );
};

export default QuizPage;
