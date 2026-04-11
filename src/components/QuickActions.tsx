import { useNavigate } from "react-router-dom";

interface QuickActionCard {
    title: string;
    bannerImageSrc: string;
    href: string;
    external: boolean;
}

const CARDS: QuickActionCard[] = [
    {
        title: "Kutubxona",
        bannerImageSrc: "/quick-actions/kutubxona-icon.png",
        href: "/library",
        external: false,
    },
    {
        title: "Kitob sovchi",
        bannerImageSrc: "/quick-actions/sovchi-icon.png",
        href: "/quiz",
        external: false,
    },
    {
        title: "Instagram",
        bannerImageSrc: "/quick-actions/instagram-icon.png",
        href: "https://www.instagram.com/booktopia_press/",
        external: true,
    },
    {
        title: "Telegram",
        bannerImageSrc: "/quick-actions/telegram-icon.png",
        href: "https://t.me/booktopia_press",
        external: true,
    },
];

const QuickActions = () => {
    const navigate = useNavigate();

    const handleClick = (card: QuickActionCard) => {
        if (card.external) {
            window.open(card.href, "_blank", "noopener,noreferrer");
        } else {
            navigate(card.href);
        }
    };

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-8 bg-background">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {CARDS.map((card) => (
                    <button
                        key={card.title}
                        onClick={() => handleClick(card)}
                        aria-label={card.title}
                        className="rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl border-0 p-0 bg-transparent"
                    >
                        <img
                            src={card.bannerImageSrc}
                            alt={card.title}
                            className="w-full h-full object-cover block"
                            draggable={false}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
};

export default QuickActions;
