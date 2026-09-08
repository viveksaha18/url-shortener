import { ArrowRight, Check, Link2, MousePointerClick, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  { icon: Zap, title: 'Instant links', text: 'Turn long, unwieldy URLs into clear links in a single click.' },
  { icon: ShieldCheck, title: 'Built for trust', text: 'A focused, private workspace for the links you share.' },
  { icon: MousePointerClick, title: 'Simple by design', text: 'No clutter. Just the tools you need to move faster.' },
];

export default function Home() {
  return <div className="min-h-screen overflow-hidden bg-ink text-white"><Navbar /><main>
    <section className="hero-grid relative mx-auto max-w-6xl px-5 pb-24 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
      <div className="relative max-w-3xl animate-rise">
        <div className="eyebrow"><span className="pulse-dot" /> Clean links. Clear direction.</div>
        <h1 className="mt-7 font-display text-5xl font-bold leading-[1.03] tracking-tight sm:text-7xl">Make every link<br /><span className="text-electric">count.</span></h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">A fast, beautifully simple URL shortener for sharing ideas, campaigns, and everything in between.</p>
        <div className="mt-10 flex flex-wrap items-center gap-3"><Link to="/register" className="button-primary px-6 py-3.5">Get started free <ArrowRight size={17} /></Link><Link to="/login" className="button-outline px-6 py-3.5">Log in</Link></div>
        <div className="mt-8 flex items-center gap-2 text-sm text-slate-400"><Check size={16} className="text-electric" /> No setup required <span className="mx-1 text-slate-600">|</span> Built for everyday sharing</div>
      </div>
      <div className="pointer-events-none absolute -right-16 top-14 hidden h-96 w-96 rounded-full bg-electric/10 blur-3xl lg:block" />
    </section>
    <section className="border-y border-white/10 bg-white/[0.025]"><div className="mx-auto grid max-w-6xl gap-px px-5 sm:grid-cols-3 lg:px-8">{features.map(({ icon: Icon, title, text }) => <div className="border-white/10 px-0 py-8 sm:px-7 sm:py-12 sm:first:pl-0" key={title}><Icon className="text-electric" size={22} /><h2 className="mt-5 font-display text-lg font-semibold">{title}</h2><p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">{text}</p></div>)}</div></section>
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8"><div className="flex items-center gap-3 text-sm text-slate-400"><Link2 size={16} className="text-electric" /> Your shortcut to better sharing</div></section>
  </main></div>;
}