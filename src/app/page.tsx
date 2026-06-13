import Stage from "@/components/Stage";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main className="relative">
      <Stage />
      <Services />
      <footer className="border-t border-accent/10 py-6 text-center mono text-[10px] text-fg-dim uppercase tracking-[0.3em]">
        © {new Date().getFullYear()} SEGENTIX - AI agent permission and risk analysis · alex.ansbergs@gmail.com
      </footer>
    </main>
  );
}
