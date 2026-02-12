/**
 * Landing page data arrays
 * Extracted from page.tsx for maintainability.
 * All static content lives here — page.tsx is the composition layer.
 */
import {
  Dna,
  Target,
  FileText,
  Shield,
  DollarSign,
  Compass,
  BarChart3,
  Zap,
  TrendingUp,
  Globe,
  Lock,
  Upload,
  Brain,
  Rocket,
} from "lucide-react";

export const FEATURES = [
  {
    icon: Dna,
    title: "Career DNA™ Analysis",
    description:
      "Deep semantic analysis of your skills, experience, and growth trajectory. Not keyword matching — real understanding.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    description:
      "AI-powered matching with explainable compatibility scores and actionable skill gap recommendations.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: FileText,
    title: "CV Intelligence",
    description:
      "Auto-tailored resumes optimized for each opportunity. ATS-ready, recruiter-preferred formatting in seconds.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Career Threat Radar",
    description:
      "Proactive alerts when your skills face AI disruption or market shifts. Stay ahead of change.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: DollarSign,
    title: "Salary Intelligence",
    description:
      "Real-time compensation benchmarks calibrated to your exact profile, experience, and market position.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Compass,
    title: "Career Simulation",
    description:
      "Model future career paths and see projected outcomes before you make your next move.",
    gradient: "from-amber-500 to-orange-500",
  },
];

export const STATS = [
  { value: "6", label: "AI Modules", icon: BarChart3 },
  { value: "92%", label: "Target Accuracy", icon: Target },
  { value: "<5s", label: "CV Generation", icon: Zap },
  { value: "Growing", label: "Waitlist", icon: TrendingUp },
];

export const TRUST_BADGES = [
  { icon: Globe, label: "Built in the EU", sublabel: "Amsterdam, NL" },
  { icon: Lock, label: "GDPR Native", sublabel: "Privacy by design" },
  { icon: Zap, label: "AI-Powered", sublabel: "Semantic intelligence" },
];

export const DNA_CAPABILITIES = [
  { label: "Skill Mapping", value: "92%", color: "bg-violet-500", width: "92%" },
  { label: "Market Position", value: "Top 15%", color: "bg-cyan-500", width: "85%" },
  { label: "Growth Velocity", value: "High", color: "bg-emerald-500", width: "78%" },
  { label: "AI Risk", value: "Low", color: "bg-amber-500", width: "25%" },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload your CV",
    description: "Drop your resume or LinkedIn profile. Our AI reads between the lines — not just keywords.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI builds your Career DNA™",
    description: "Semantic analysis maps your skills, trajectory, market position, and growth patterns.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Get intelligent matches",
    description: "Receive opportunities scored by true compatibility — with explainable reasoning for every match.",
  },
];

export const COMPARISON = {
  headers: ["", "Resume Builders", "Job Boards", "Career Coaches", "PathForge"],
  rows: [
    { feature: "Semantic skill analysis", values: [false, false, false, true] },
    { feature: "AI-powered matching", values: [false, true, false, true] },
    { feature: "Career trajectory modeling", values: [false, false, true, true] },
    { feature: "Auto-tailored CVs", values: [true, false, false, true] },
    { feature: "Salary intelligence", values: [false, false, true, true] },
    { feature: "AI disruption alerts", values: [false, false, false, true] },
    { feature: "Always available", values: [true, true, false, true] },
    { feature: "Affordable", values: [true, true, false, true] },
  ],
};

export const TESTIMONIALS = [
  {
    quote: "We built PathForge because we were tired of seeing brilliant engineers undervalued by keyword-matching algorithms. Career decisions deserve real intelligence.",
    name: "Emre Dursun",
    role: "Founder & Lead Engineer",
    company: "PathForge",
    linkedin: "https://www.linkedin.com/in/emre-dursun-nl/",
    image: "/testimonials/emre-dursun.png",
    gradient: "from-violet-500 to-indigo-500",
    featured: true,
  },
  {
    quote: "After years in QA at Elsevier, I know how broken hiring pipelines are. PathForge's approach — understanding the person behind the CV — is the paradigm shift our industry has been waiting for.",
    name: "Mahmut Kaya",
    role: "Senior QA Engineer",
    company: "Elsevier",
    linkedin: "https://www.linkedin.com/in/mahmut-kaya-b9832614a/",
    image: "/testimonials/mahmut-kaya.png",
    gradient: "from-cyan-500 to-blue-500",
    featured: false,
  },
  {
    quote: "Most career tools optimize for keywords. PathForge optimizes for people. That's not an incremental improvement — it's a fundamentally different way of thinking about talent and trajectory.",
    name: "Ilker Akkaya",
    role: "Test Consultant",
    company: "Pancompany",
    linkedin: "https://www.linkedin.com/in/ilkerakkaya/",
    image: "/testimonials/ilker-akkaya.png",
    gradient: "from-emerald-500 to-teal-500",
    featured: false,
  },
  {
    quote: "As a designer moving from graphic design into UI, I know how hard it is when your skills don't fit a neat job title. PathForge understands the creative journey — it sees the transferable skills others overlook.",
    name: "Anna Khotynenko",
    role: "Graphic & UI Designer",
    company: "Wrocław, Poland",
    linkedin: "https://www.linkedin.com/in/anna-khotynenko-897181187/",
    image: "/testimonials/anna-khotynenko.png",
    gradient: "from-fuchsia-500 to-pink-500",
    featured: false,
  },
  {
    quote: "As someone who transitioned from backend engineering into data, I wish Career DNA™ existed when I was navigating that shift. PathForge sees the skills you're building — not just the title you hold.",
    name: "Müslüm Gezgin",
    role: "Software Engineer",
    company: "Shipcloud",
    linkedin: "https://www.linkedin.com/in/muslumgezgin/",
    image: "/testimonials/muslum-gezgin.png",
    gradient: "from-amber-500 to-orange-500",
    featured: false,
  },
  {
    quote: "In testing, we always say: don't just verify it works — verify it's right. PathForge applies that exact mindset to careers. It doesn't just match you to jobs, it validates whether the move actually fits your growth path.",
    name: "Murat Bigin",
    role: "QA Engineer",
    company: "Netherlands",
    linkedin: "https://www.linkedin.com/in/murat-bigin-08439419a/",
    image: "/testimonials/murat-bigin.png",
    gradient: "from-sky-500 to-blue-500",
    featured: false,
  },
  {
    quote: "The career tools market is massive but broken. Nobody connects who you are with where you should go. PathForge changes that with Career DNA™.",
    name: "PathForge Team",
    role: "Product Vision",
    company: "PathForge",
    image: "/testimonials/pathforge.png",
    gradient: "from-rose-500 to-pink-500",
    featured: false,
  },
];

export const FAQ = [
  {
    q: "What is Career DNA™?",
    a: "Career DNA™ is our proprietary semantic model that encodes your professional identity — skills, experiences, growth patterns, values, and market positioning — into a living profile that evolves with you. Unlike keyword-based systems, it understands the meaning behind your career.",
  },
  {
    q: "How is PathForge different from LinkedIn or Indeed?",
    a: "LinkedIn and Indeed match keywords. PathForge understands career trajectories. We don't just find jobs that match your resume — we find opportunities that align with where your career is going, not just where it's been.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. PathForge is built in the EU (Amsterdam) and is GDPR-native from day one. Your career data is encrypted, never sold, and you maintain full control. Privacy isn't an afterthought — it's foundational.",
  },
  {
    q: "What does 'free for early adopters' mean?",
    a: "Early waitlist members get lifetime free access to PathForge's core features. You'll be the first to shape the product and your feedback will directly influence our roadmap.",
  },
  {
    q: "When will PathForge launch?",
    a: "We're currently in private development with early access planned for 2026. Join the waitlist to be notified the moment we open doors — and to lock in your free-forever access.",
  },
];
