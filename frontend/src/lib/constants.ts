import type { PortfolioProject } from "@/lib/types";
import type { Testimonial } from "@/types";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SECTION_IDS = ["services", "work", "about", "testimonials", "contact"] as const;

export const SERVICES = [
  {
    number: "01",
    title: "3D Web Experiences",
    description:
      "Immersive WebGL worlds that captivate audiences and elevate your brand into cinematic digital space.",
    icon: "cube",
  },
  {
    number: "02",
    title: "AI Product Posters",
    description:
      "Futuristic visual campaigns that make AI products feel premium, intelligent, and unmistakably modern.",
    icon: "spark",
  },
  {
    number: "03",
    title: "Brand Identity Systems",
    description:
      "Cohesive visual languages—from typography to motion—that position your brand as industry-leading.",
    icon: "layers",
  },
  {
    number: "04",
    title: "Performance-First Development",
    description:
      "Lightning-fast, accessible experiences engineered for 60fps and measurable business outcomes.",
    icon: "bolt",
  },
] as const;

export const MARQUEE_ITEMS = [
  "Web Design",
  "AI Posters",
  "Branding",
  "Motion Design",
  "UI/UX",
  "3D Visuals",
  "Cinematic Web",
  "Digital Strategy",
] as const;

export const PORTFOLIO: readonly PortfolioProject[] = [];

export const STATS: readonly { value: string; label: string }[] = [];

export const TESTIMONIALS: readonly Testimonial[] = [];

export const CONTACT_SERVICES = [
  "3D Web Experience",
  "AI Product Poster",
  "Brand Identity",
  "Full Website",
  "Other",
] as const;

export const SOCIAL_LINKS: readonly { label: string; href: string }[] = [];

export const EASE = [0.22, 1, 0.36, 1] as const;

export const ROADMAP_STEPS = [
  {
    number: "01",
    title: "Discovery",
    description: "We dive deep into your brand, goals, and audience to uncover what truly drives your vision.",
  },
  {
    number: "02",
    title: "Strategy",
    description: "A tailored roadmap is crafted — defining scope, architecture, timelines, and key milestones.",
  },
  {
    number: "03",
    title: "Design",
    description: "Cinematic interfaces and visual systems are designed to captivate and convert.",
  },
  {
    number: "04",
    title: "Develop",
    description: "Pixel-perfect builds with cutting-edge tech, optimized for speed, accessibility, and scale.",
  },
  {
    number: "05",
    title: "Launch",
    description: "Rigorous testing, deployment, and a seamless go-live that makes a lasting first impression.",
  },
  {
    number: "06",
    title: "Grow",
    description: "Post-launch analytics, iterative improvements, and ongoing support to keep you ahead.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What services does ApeX offer?",
    answer: "We specialize in web development, AI product posters, branding & identity, UI/UX design, and performance optimization — delivering premium digital experiences from concept to launch.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Timelines vary by scope. A standard website takes 4–8 weeks, while larger brand identity or campaign projects may take 8–12 weeks. We'll provide a clear timeline during the strategy phase.",
  },
  {
    question: "Do you work with startups and small businesses?",
    answer: "Absolutely. We partner with businesses of all sizes — from early-stage startups to established brands — tailoring our approach to your goals and budget.",
  },
  {
    question: "What is your design process like?",
    answer: "We follow a proven 6-step pipeline: Discovery → Strategy → Design → Develop → Launch → Grow. Every phase includes close collaboration and transparent feedback loops.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer: "Yes. We provide post-launch maintenance, performance monitoring, content updates, and iterative improvements to ensure your digital presence stays sharp and fast.",
  },
] as const;
