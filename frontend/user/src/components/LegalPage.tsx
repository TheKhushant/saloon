import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

interface Section {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  updatedOn: string;
  intro: string;
  sections: Section[];
  crumbLabel: string;
}

const LegalPage = ({ title, updatedOn, intro, sections, crumbLabel }: LegalPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero title={title} description={intro} crumbs={[{ label: crumbLabel }]} />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <p className="text-xs text-muted-foreground mb-10">Last updated: {updatedOn}</p>
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">{s.heading}</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalPage;
