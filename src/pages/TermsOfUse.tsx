import React from "react";
import LegalPage from "@/pages/LegalPage";
import { useLang } from "@/context/LanguageContext";

const TermsOfUse = () => {
    const { t } = useLang();

    return (
        <LegalPage title={t.terms.title} updatedAt="27.04.2026">
            <div className="space-y-12">
                <p className="text-xl md:text-[1.35rem] leading-[1.8] text-neutral-800 dark:text-neutral-200">
                    {t.terms.preface}
                </p>

                <div className="space-y-12 mt-16">
                    {t.terms.sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100">
                                {idx + 1}. {section.title}
                            </h3>
                            <p className="text-lg md:text-xl leading-[1.8] text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </LegalPage>
    );
};

export default TermsOfUse;
