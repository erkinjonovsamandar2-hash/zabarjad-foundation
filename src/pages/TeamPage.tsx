import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import akbarImg from "@/assets/team/akbar.png";

const TEAM_MEMBERS = [
    { id: 1, name: "Akbar Toshtemirov", role: "Muharrir", image: akbarImg },
    { id: 2, name: "Jamoa A'zosi", role: "Musahhih", image: "https://pngimg.com/d/businessman_PNG6565.png" },
    { id: 3, name: "Jamoa A'zosi", role: "Badiiy muharrir", image: "https://pngimg.com/d/businessman_PNG6571.png" },
    { id: 4, name: "Jamoa A'zosi", role: "Muqova Dizayneri", image: "https://pngimg.com/d/businessman_PNG6576.png" },
    { id: 5, name: "Jamoa A'zosi", role: "Sahifalovchi", image: "https://pngimg.com/d/businessman_PNG6565.png" },
    { id: 6, name: "Jamoa A'zosi", role: "Tarjimon", image: "https://pngimg.com/d/businessman_PNG6571.png" },
];

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-500">
            <ScrollToTop />
            <Navbar />
            
            <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-gold/5 rounded-full blur-[80px] mix-blend-screen" />
                </div>

                <div className="max-w-5xl mx-auto w-full relative z-10">
                    
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4 flex flex-col items-center">
                        <motion.span 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="font-sans font-bold text-[10px] tracking-[0.3em] uppercase text-gold/80"
                        >
                            Booktopia
                        </motion.span>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                            className="font-heading text-5xl md:text-6xl text-foreground tracking-wide text-balance drop-shadow-sm"
                        >
                            Jamoa
                        </motion.h1>
                        <motion.div 
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent my-2"
                        />
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                            className="font-serif italic text-lg md:text-xl text-muted-foreground text-balance"
                        >
                            Orqamizda turgan ijodkorlar va mutaxassislar
                        </motion.p>
                    </div>

                    {/* Editorial Portrait Grid */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-6"
                    >
                        {TEAM_MEMBERS.map((member) => (
                            <div 
                                key={member.id}
                                className="flex flex-col rounded-[var(--radius)] overflow-hidden transition-all duration-300 backdrop-blur-md bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-primary/30 group"
                            >
                                {/* Image (3/4 Aspect) */}
                                {member.image ? (
                                    <div className="w-full aspect-[3/4] overflow-hidden bg-muted/20">
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-full h-full object-cover rounded-t-[var(--radius)] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[3/4] flex items-center justify-center bg-accent/20 rounded-t-[var(--radius)]">
                                        <span className="font-heading text-4xl text-foreground opacity-30 uppercase">
                                            {member.name.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                {/* Information */}
                                <div className="flex flex-col items-center justify-center p-4 pt-5 gap-1.5 flex-1 text-center bg-gradient-to-b from-transparent to-background/50">
                                    <h3 className="font-heading font-semibold text-lg text-foreground leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                                        {member.name}
                                    </h3>
                                    <p className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-gold relative px-3 py-0.5 rounded-full bg-gold/5 border border-gold/10">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                </div>
            </main>

            <Footer />
        </div>
    );
}