import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight,
  Instagram, Linkedin, Facebook, Mail, Menu, Phone, X, Send, ShieldCheck,
  Scale, Building2, FileCheck2, Globe2, Sparkles, Landmark, Repeat2, GitBranch, ArrowUpRight,
  Shield, ClipboardCheck, SearchCheck, BadgeCheck, Handshake, Layers3, CircleDollarSign, Leaf,
} from "lucide-react";
import { services, team, articles, businessRegistrationPages } from "./data";
import { professionalPages, professionalPageMap } from "./professionalPages";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: .65, ease: [0.22, 1, .36, 1] } }
};


function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>;
}

function SectionHeading({ eyebrow, title, text, dark=false }) {
  const titleText = typeof title === "string" ? title.trim() : "";
  const titleWords = titleText ? titleText.split(/\s+/) : [];
  const highlightedTitle = titleWords.length > 1 ? titleWords.pop() : "";
  const titleBase = titleWords.join(" ");

  return (
    <motion.div className={`section-head ${dark ? "dark" : ""}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: .15 }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{titleText ? <>{titleBase}{titleBase ? " " : ""}<span className="title-highlight">{highlightedTitle}</span></> : title}</h2>
      {text && (() => {
        const words = text.trim().split(/\s+/);
        const highlighted = words.pop();
        return <p>{words.join(" ")}{words.length ? " " : ""}<span className="section-subtitle-highlight">{highlighted}</span></p>;
      })()}
    </motion.div>
  );
}

function Navbar({ mobileOpen, setMobileOpen, onServiceOpen, onArticleOpen, onPageOpen }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServiceId, setDesktopServiceId] = useState(null);
  const [mobileServices, setMobileServices] = useState(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef(null);
  const menuRef = useRef(null);
  const menuToggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (servicesOpen && servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServicesOpen(false);
        setDesktopServiceId(null);
      }
      if (mobileOpen && menuRef.current && !menuRef.current.contains(event.target) && !menuToggleRef.current?.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [servicesOpen, mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    setServicesOpen(false);
    setDesktopServiceId(null);
    setMobileServices(null);
    setMobileServicesOpen(false);
  };

  const go = (id) => {
    closeMenu();
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth" });
    else {
      onPageOpen?.(null);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  };

  const openService = (service, item = null) => {
    closeMenu();
    onServiceOpen(service, item);
  };

  const toggleServices = () => {
    setServicesOpen((open) => {
      const next = !open;
      if (!next) setDesktopServiceId(null);
      return next;
    });
  };

  const selectedDesktopService = services.find((service) => service.id === desktopServiceId) || null;

  return <>
    <header className={scrolled ? "nav-scrolled" : ""}>
      <div className="container nav-inner">
        <button className="brand" onClick={() => go("home")} aria-label="Go to home">
          <img className="brand-cs-logo" src="/cs-logo.png" alt="CS" />
          <span><b>Karthick Vijayakumar <i>&amp;</i> Associates <em className="brand-seal">✦</em></b><small>Company Secretaries</small></span>
        </button>

        {/* Desktop: restore the normal site navigation. Insights & Advisory lives in the desktop menu button. */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={() => go("home")}>Home</button>
          <button onClick={() => go("about")}>About</button>
          <div className="services-nav" ref={servicesRef}>
            <button className="services-trigger" onClick={toggleServices} aria-expanded={servicesOpen} aria-haspopup="true">
              Services <ChevronDown size={15} className={servicesOpen ? "rotate" : ""}/>
            </button>
            <AnimatePresence>
              {servicesOpen && <motion.div className="mega-menu mega-menu-nested" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} transition={{duration:.2,ease:[.22,1,.36,1]}}>
                <div className="mega-layout mega-layout-vertical">
                  <div className="mega-grid mega-categories mega-categories-vertical">
                    {services.map((service) => <button key={service.id} className={desktopServiceId === service.id ? "is-selected" : ""} onClick={() => setDesktopServiceId(service.id)} aria-pressed={desktopServiceId === service.id}>
                      <span className="mini-num">{service.number}</span><span>{service.title}</span><ChevronRight size={14}/>
                    </button>)}
                  </div>
                </div>
              </motion.div>}
            </AnimatePresence>
            <AnimatePresence>
              {servicesOpen && selectedDesktopService && <motion.div className="mega-submenu-floating" initial={{opacity:0,x:-6,y:4}} animate={{opacity:1,x:0,y:0}} exit={{opacity:0,x:-6,y:4}} transition={{duration:.18,ease:[.22,1,.36,1]}} aria-live="polite">
                <div className="mega-subtopics">
                  {selectedDesktopService.items.map((item, itemIndex) => <button key={item.title} onClick={() => openService(selectedDesktopService, itemIndex)}>
                    <span>{item.title}</span><ChevronRight size={14}/>
                  </button>)}
                </div>
              </motion.div>}
            </AnimatePresence>
          </div>
          <button onClick={() => go("why")}>Why Choose Us</button>
          <button onClick={() => go("team")}>Team</button>
          <button className="nav-contact-link" onClick={() => go("contact")}>Contact Us</button>
        </nav>

        <div className="nav-socials" aria-label="Social links"><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17}/></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17}/></a></div>
        <button ref={menuToggleRef} className="menu-toggle" onClick={() => { setMobileOpen((open) => !open); setServicesOpen(false); setDesktopServiceId(null); }} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation">{mobileOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <AnimatePresence>
      {mobileOpen && <motion.div
        id="mobile-navigation"
        ref={menuRef}
        className="menu-popover menu-popover-responsive"
        initial={{opacity:0,y:-8,scale:.98}}
        animate={{opacity:1,y:0,scale:1}}
        exit={{opacity:0,y:-8,scale:.98}}
        transition={{duration:.2,ease:[.22,1,.36,1]}}
        role="dialog"
        aria-label="Navigation menu"
      >
        <button className="menu-popover-close" onClick={closeMenu} aria-label="Close menu"><X size={17}/></button>

        {/* Desktop menu button: ONLY Insights & Advisory. */}
        <div className="menu-desktop-only-link">
          <button className="menu-popover-link" onClick={() => { closeMenu(); onArticleOpen?.(articles[0]); }}>
            <span>Insights &amp; Advisory</span><ArrowUpRight size={15}/>
          </button>
        </div>

        {/* Mobile menu button: all navigation items. */}
        <div className="menu-mobile-navigation">
          <button className="menu-popover-link" onClick={() => go("home")}><span>Home</span><ArrowUpRight size={15}/></button>
          <button className="menu-popover-link" onClick={() => go("about")}><span>About Us</span><ArrowUpRight size={15}/></button>
          <div className="menu-mobile-services">
            <button className="menu-popover-link" onClick={() => { setMobileServicesOpen(!mobileServicesOpen); if (mobileServicesOpen) setMobileServices(null); }}><span>Services</span><ChevronDown size={15} className={mobileServicesOpen ? "rotate" : ""}/></button>
            {mobileServicesOpen && <div className="mobile-services-menu">
              <button className="mobile-service-all" onClick={() => { closeMenu(); go("services"); }}>View all services <ArrowUpRight size={14}/></button>
              {services.map((service) => <div className="mobile-service-group" key={service.id}>
                <button className="mobile-service-name" onClick={() => setMobileServices(mobileServices === service.id ? null : service.id)}><span>{service.number} · {service.title}</span><ChevronRight size={14} className={mobileServices === service.id ? "rotate-90" : ""}/></button>
                {mobileServices === service.id && <div className="mobile-service-items">{service.items.map((item,index)=><button key={item.title} onClick={() => openService(service,index)}><span>{item.title}</span><ArrowUpRight size={13}/></button>)}</div>}
              </div>)}
            </div>}
          </div>
          <button className="menu-popover-link" onClick={() => { closeMenu(); onArticleOpen?.(articles[0]); }}><span>Insights &amp; Advisory</span><ArrowUpRight size={15}/></button>
          <button className="menu-popover-link" onClick={() => go("why")}><span>Why Choose Us</span><ArrowUpRight size={15}/></button>
          <button className="menu-popover-link" onClick={() => go("team")}><span>Team</span><ArrowUpRight size={15}/></button>
          <button className="menu-popover-link" onClick={() => go("contact")}><span>Contact Us</span><ArrowUpRight size={15}/></button>
        </div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
function Hero({ onEnquire }) {
  const [slide, setSlide] = useState(0);
  const heroSlides = [
    {
      theme: "hero-slide-one",
      video: "/videos/hero-slide-1.mp4",
      kicker: "KARTHICK VIJAYAKUMAR & ASSOCIATES",
      title: <>Good governance, <span className="hero-accent-word">made clear.</span></>,
      text: "Structured company secretarial, compliance and advisory support for businesses that want clarity at every stage.",
      stat: "Corporate compliance",
      statText: "Clear processes. Disciplined execution.",
      Icon: ShieldCheck,
    },
    {
      theme: "hero-slide-two",
      video: "/videos/hero-slide-2.mp4",
      kicker: "BUSINESS SETUP",
      title: <>Build the right <span className="hero-accent-word">foundation.</span></>,
      text: "From company and LLP registration to post-incorporation registrations and licences, start with the right structure.",
      stat: "Business lifecycle",
      statText: "From incorporation to operational readiness.",
      Icon: Building2,
    },
    {
      theme: "hero-slide-three",
      video: "/videos/hero-slide-3.mp4",
      kicker: "COMPLIANCE & GOVERNANCE",
      title: <>Stay ready. Stay <span className="hero-accent-word">organised.</span></>,
      text: "Secretarial support, governance, audit and reporting designed around your compliance responsibilities.",
      stat: "Governance support",
      statText: "Deadlines, records and responsibilities in focus.",
      Icon: Scale,
    },
    {
      theme: "hero-slide-four",
      video: "/videos/hero-slide-4.mp4",
      kicker: "GROW, RESTRUCTURE & SPECIALIST ADVISORY",
      title: <>Complex matters, <span className="hero-accent-word">clearer decisions.</span></>,
      text: "Practical support across restructuring, transactions, cross-border matters, CSR, ESG and specialist advisory.",
      stat: "Advisory coverage",
      statText: "Growth, transactions and specialist matters.",
      Icon: Globe2,
    }
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const current = heroSlides[slide];
  const ArtIcon = current.Icon;

  return <section id="home" className={`hero hero-modern ${current.theme}`}>
    <div className="hero-modern-bg" aria-hidden="true">
      <span className="hero-orb hero-orb-a" />
      <span className="hero-orb hero-orb-b" />
      <span className="hero-orb hero-orb-c" />
      <span className="hero-line hero-line-a" />
      <span className="hero-line hero-line-b" />
    </div>
    <div className="container hero-modern-inner">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          className="hero-modern-copy"
          initial={{ opacity: 0, x: -34 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: .72, ease: [.22, 1, .36, 1] }}
        >
          <div className="hero-brand-lockup"><img src="/cs-logo.png" alt="CS logo"/><span>Karthick Vijayakumar &amp; Associates</span></div>
          <div className="hero-kicker"><span />{current.kicker}</div>
          <h1>{current.title}</h1>
          <p>{current.text}</p>
          <div className="hero-actions">
            <button className="btn primary" onClick={onEnquire}>Talk to us <ArrowDownRight size={18}/></button>
            <a className="btn ghost" href="#services">See what we do <ArrowDownRight size={17}/></a>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`art-${slide}`}
          className="hero-modern-visual"
          initial={{ opacity: 0, scale: .96, x: 34 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.025, x: -18 }}
          transition={{ duration: .8, ease: [.22, 1, .36, 1] }}
        >
          <div className="hero-video-wrap">
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Corporate background video"
            >
              <source src={current.video} type="video/mp4" />
            </video>
            <div className="hero-video-overlay" />
            <div className="hero-video-vignette" />
            <div className="hero-video-meta">
              <span>01 — 04</span>
              <span>KVA</span>
            </div>
            <div className="hero-visual-copy">
              <small>{current.stat}</small>
              <strong>{current.statText}</strong>
            </div>
            <div className="hero-video-grid" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="hero-auto-progress" aria-hidden="true"><span /></div>
    </div>
  </section>;
}

function About() {
  return <section id="about" className="section about-section">
    <div className="container">
      <SectionHeading
        eyebrow="About us"
        title="A practical partner for corporate compliance and governance."
        text="We combine structured secretarial support with clear, business-minded advisory so clients can make decisions with confidence."
      />
      <div className="about-layout">
        <motion.div className="about-copy" variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,amount:.18}}>
          <p className="about-lead">Whatever stage your company is at, the compliance shouldn't be your problem to track. We cover business setup, compliance &amp; governance, growth and restructuring, and specialist advisory — with clear updates and disciplined records so you always know where things stand.</p>
          <div className="about-statement compact">
            <span className="quote-mark">“</span>
            <p>Good compliance should create clarity — not another layer of complexity.</p>
            <div className="signature">Karthick Vijayakumar &amp; Associates<small>Company Secretaries</small></div>
          </div>
          <div className="about-metrics">
            <div><b>01</b><span>One clear process</span><small>From brief to completion</small></div>
            <div><b>02</b><span>Deadline-led support</span><small>Actions stay on track</small></div>
            <div><b>03</b><span>Decision-ready records</span><small>Information stays organised</small></div>
          </div>
        </motion.div>

        <motion.div className="about-media" initial={{opacity:0,x:45,scale:.97}} whileInView={{opacity:1,x:0,scale:1}} transition={{duration:.75,ease:[.22,1,.36,1]}} viewport={{once:true,amount:.18}}>
          <div className="about-image-frame">
            <video className="section-video-placeholder" autoPlay muted loop playsInline preload="metadata" aria-label="About Us corporate video"><source src="/videos/about-video.mp4" type="video/mp4" /></video>
            <div className="about-image-caption"><span>THE PRACTICE</span><strong>Clarity in every stage.</strong></div>
          </div>
          <div className="about-highlights" aria-label="Practice highlights">
            {[
              ["One-on-One Guidance", "A clear point of contact for every engagement."],
              ["100% Result Focus", "Work planned around the outcome that matters."],
              ["Full Guidance", "Practical support from first step to completion."],
            ].map(([title, text], index) => (
              <motion.div
                className="about-highlight"
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .3 }}
                transition={{ delay: index * .1, duration: .55 }}
                animate={{ y: [0, -5, 0] }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <span>0{index + 1}</span>
                <strong>{title}</strong>
                <small>{text}</small>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>;
}

function WhyUs() {
  const points=[[ShieldCheck,"Compliance-first, always","Every engagement is built around the requirements and deadlines that apply to you — nothing missed, nothing improvised."],[Scale,"Advice that fits the business","We read the commercial context, not just the statute, so the guidance actually works in practice."],[FileCheck2,"Discipline in the detail","Clean processes and well-kept records mean fewer errors, faster answers and no scrambling later."],[Globe2,"Coverage end to end","Incorporation to cross-border, transactions, CSR and ESG — one practice across the full lifecycle."]];
  return <section id="why" className="section why"><div className="container"><SectionHeading eyebrow="Why Choose Us" title="Professional support that stays clear, organised and focused." text="The experience should feel straightforward for founders, boards and management teams."/><div className="why-feature">
    <div className="why-grid">{points.map(([Icon,title,text],i)=><motion.article className="why-item" key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,amount:.15}} transition={{delay:i*.07}} whileHover={{y:-6,scale:1.015}}><div className="why-icon"><Icon size={20}/></div><div><h3>{title}</h3><p>{text}</p></div></motion.article>)}</div>
    <motion.div className="why-video-card" initial={{opacity:0,x:30,scale:.97}} whileInView={{opacity:1,x:0,scale:1}} viewport={{once:true,amount:.2}} transition={{duration:.75}} whileHover={{scale:1.02}}>
      <video autoPlay muted loop playsInline preload="metadata" aria-label="Corporate abstract background video"><source src="/videos/why-choose-us-video.mp4" type="video/mp4" /></video>
      <div className="why-video-overlay"/>
      <div className="why-video-copy"><span>THE KVA STANDARD</span><h3>Clear thinking.<br/>Disciplined execution.</h3><p>Built around clarity, documentation and dependable communication.</p></div>
    </motion.div>
  </div></div></section>;
}

const serviceVisuals = {
  "business-setup-registrations": {
    image: "/images/services/business-setup.png",
    alt: "Indian business professionals in a meeting",
    label: "Business setup & registration",
  },
  "compliance-governance": {
    image: "/images/services/compliance-governance.jpeg",
    alt: "Professional reviewing business documents",
    label: "Compliance & governance",
  },
  "grow-restructure": {
    image: "/images/services/grow-restructure.png",
    alt: "Business team discussing growth strategy",
    label: "Grow & restructure",
  },
  "cross-border-regulatory": {
    image: "/images/services/cross-border.jpeg",
    alt: "Business team collaborating on an international project",
    label: "Cross-border advisory",
  },
  "csr-sustainability": {
    image: "/images/services/csr-sustainability.jpeg",
    alt: "Community and sustainability initiative",
    label: "CSR & sustainability",
  },
  "taxation": {
    image: "/images/services/taxation.jpeg",
    alt: "Finance professional working on tax documents",
    label: "Taxation",
  },
};

const serviceExpansion = {
  "business-setup-registrations": {
    lens: "formation, registration and operational readiness",
    headings: ["Planning the structure", "Promoter and ownership readiness", "Document preparation", "Registration workflow", "Post-incorporation setup", "Licences and registrations", "Governance from day one", "Cost and timeline planning", "Common execution risks", "Management checklist", "When the structure changes", "Ongoing professional support"]
  },
  "compliance-governance": {
    lens: "recurring compliance, records and governance discipline",
    headings: ["Build a compliance calendar", "Board and shareholder actions", "Statutory records", "Filing readiness", "Director and disclosure records", "Event-based compliance", "Internal review controls", "Document retention", "Common compliance gaps", "Management dashboard", "Escalation and remediation", "Ongoing governance support"]
  },
  "grow-restructure": {
    lens: "growth planning, restructuring and corporate change",
    headings: ["Clarify the growth objective", "Ownership and capital planning", "Corporate restructuring", "Approvals and documentation", "Implementation sequence", "Stakeholder coordination", "Commercial continuity", "Risk and control review", "Common restructuring issues", "Decision checklist", "Post-change governance", "Long-term advisory support"]
  },
  "cross-border-regulatory": {
    lens: "cross-border transactions, documentation and regulatory coordination",
    headings: ["Map the cross-border activity", "Ownership and investment records", "Transaction documentation", "Approval and filing sequence", "Banking and stakeholder coordination", "Regulatory reporting", "Records after completion", "Timeline management", "Common cross-border gaps", "Management checklist", "Changes after the transaction", "Ongoing cross-border support"]
  },
  "csr-sustainability": {
    lens: "responsible business, CSR governance and sustainability documentation",
    headings: ["Define the objective", "Governance responsibilities", "Programme documentation", "Approval and implementation", "Partner and project records", "Monitoring and evidence", "Reporting discipline", "Budget and documentation", "Common CSR gaps", "Management checklist", "Annual review", "Ongoing governance support"]
  },
  "taxation": {
    lens: "corporate taxation, GST coordination and regulatory documentation",
    headings: ["Map the tax responsibilities", "Registration and master data", "Transaction documentation", "Approval and filing workflow", "GST and indirect-tax coordination", "Corporate income-tax coordination", "Records and reconciliations", "Deadline management", "Common tax-document gaps", "Management checklist", "Business changes and tax impact", "Ongoing advisory coordination"]
  }
};

function RichServiceContent({ content, serviceId, serviceTitle, onEnquire }) {
  if (!content) return null;
  const lines = content.split(/\n{2,}/).map(line => line.trim()).filter(Boolean);
  const visual = serviceVisuals[serviceId] || serviceVisuals["business-setup-registrations"];
  const expansion = serviceExpansion[serviceId] || serviceExpansion["business-setup-registrations"];
  const topic = serviceTitle || visual.label;
  const pageHeadings = [
    ...expansion.headings,
    "Management decisions and responsibilities",
    "Evidence, review and record retention",
    "Final action plan and next steps"
  ].slice(0, 15);

  const expandedBlocks = pageHeadings.map((heading, index) => ({
    heading,
    pageNumber: index + 1,
    paragraphs: [
      `${topic} should be approached as a connected business process rather than as a single form, filing or isolated advisory task. This section focuses on ${heading.toLowerCase()} and how that stage connects with the company's actual ownership, operations, records and decision-making responsibilities.`,
      `For this service, management should identify the relevant facts first, confirm the documents and approvals that support them, and keep a clear record of what was completed. The practical aim is to make the work easier to review, easier to evidence and easier to continue when the next stage begins.`,
      `Where the requirement involves a filing, transaction, approval or recurring obligation, build an internal review date before the external deadline. That extra checkpoint allows the team to identify missing information, clarify responsibilities and retain the final evidence in one organised place.`
    ],
    bullets: [
      `Confirm the facts and scope relevant to ${topic}.`,
      `Assign an owner and reviewer for each important action or document.`,
      "Keep supporting evidence together with the final submission, approval or decision.",
      "Record the next deadline, follow-up action or governance checkpoint before closing the task."
    ],
    table: {
      title: `${heading} — practical review table`,
      headers: ["Review area", "What to check", "Expected record"],
      rows: [
        ["Business context", `How ${topic} applies to the current business situation`, "Scope note / management instruction"],
        ["Documents", "Identity, corporate, transaction or supporting records relevant to the task", "Reviewed document set"],
        ["Approvals", "Board, shareholder, management or regulatory approval where applicable", "Resolution / approval evidence"],
        ["Completion", "Filing, submission, implementation or advisory action", "Acknowledgement / final record"],
        ["Next step", "Future deadline, renewal, monitoring or follow-up", "Calendar entry / action owner"]
      ]
    }
  }));

  return (
    <div className="detail-rich-content">
      <div className="service-content-media">
        <div className="service-content-image-wrap">
          <img src={visual.image} alt={visual.alt} loading="lazy" />
          <span>{visual.label}</span>
        </div>
        <div className="service-content-video-wrap">
          <video autoPlay muted loop playsInline preload="metadata" aria-label={`${visual.label} business video`}>
            <source src="/videos/services-video.mp4" type="video/mp4" />
          </video>
          <div className="service-video-badge">KVA · IN PRACTICE</div>
        </div>
      </div>

      <div className="service-content-intro-card">
        <span>Detailed service guide</span>
        <h3>From initial planning to practical follow-through</h3>
        <p>{topic} is presented as a structured working guide so the page can be used by founders, directors and management teams as a reference during the engagement.</p>
      </div>

      {lines.map((line, index) => {
        if (line.startsWith("## ")) return <h3 key={`source-${index}`}>{line.slice(3)}</h3>;
        if (line.startsWith("• ")) return <div className="detail-rich-bullet" key={`source-${index}`}>{line.slice(2)}</div>;
        if (line.startsWith("**Q: ") && line.endsWith("**")) return <h4 className="detail-rich-question" key={`source-${index}`}>{line.slice(5, -2)}</h4>;
        if (line.startsWith("A: ")) return <p className="detail-rich-answer" key={`source-${index}`}>{line.slice(3)}</p>;
        return <p key={`source-${index}`}>{line}</p>;
      })}

      <div className="service-long-form">
        <div className="service-roadmap-heading"><span>Practical roadmap</span><strong>Detailed working considerations</strong><small>Use these checkpoints alongside the service-specific information above.</small></div>
        {expandedBlocks.map((block, index) => (
          <React.Fragment key={block.heading}>
            <section className="service-long-block service-page-block">
              <div className="service-long-number">{String(block.pageNumber).padStart(2, "0")}</div>
              <div>
                <span className="service-page-label">Page {block.pageNumber} of 15</span>
                <h3>{block.heading}</h3>
                {block.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                <ul>{block.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}</ul>
                {(index % 3 === 1 || index === 14) && <div className="service-page-table-wrap">
                  <div className="service-page-table-title">{block.table.title}</div>
                  <div className="service-page-table-scroll"><table><thead><tr>{block.table.headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{block.table.rows.map((row,r)=><tr key={r}>{row.map((cell,c)=><td key={c}>{cell}</td>)}</tr>)}</tbody></table></div>
                </div>}
              </div>
            </section>
            {(index % 4 === 2 || index === 14) && (
              <div className="service-inline-cta">
                <div><span>Next step</span><strong>Discuss your {topic.toLowerCase()} requirement with the KVA team.</strong></div>
                <button type="button" onClick={onEnquire}>Contact Us <ArrowUpRight size={15}/></button>
              </div>
            )}
            {(index % 3 === 0 || index === 14) && (
              <div className="service-inline-media">
                <img src={visual.image} alt={visual.alt} loading="lazy" />
                <div><span>Related visual</span><strong>{topic} in practice</strong><p>Use the related visual as a quick reference while reviewing the business, documentation and compliance considerations in this section.</p></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="service-info-table">
        <div><strong>Service focus</strong><span>{visual.label}</span></div>
        <div><strong>Approach</strong><span>Practical, organised and business-focused</span></div>
        <div><strong>Support</strong><span>Guidance, documentation and ongoing assistance</span></div>
        <div><strong>Review point</strong><span>Confirm facts, approvals, records and next deadlines</span></div>
      </div>

      <div className="service-faq-grid">
        <div><span>FAQ</span><h3>What should I prepare before starting?</h3><p>Keep the basic entity, ownership, identity, address, transaction and prior-compliance records relevant to the selected service ready for review.</p></div>
        <div><span>FAQ</span><h3>What happens after the main task?</h3><p>The process should close with confirmation of records, applicable filings, pending actions and the next compliance or operational checkpoint.</p></div>
        <div><span>Important</span><h3>Timelines can vary</h3><p>Turnaround depends on document readiness, government or third-party review, clarifications and the facts of the engagement. Confirm the case-specific timeline before committing to a date.</p></div>
      </div>
    </div>
  );
}


function BusinessRegistrationPage({ page, onClose }) {
  const detailRef = useRef(null);
  const contact = () => {
    onClose();
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 0);
  };
  const tabs = ["Overview", "Benefits", "Requirement", "Documents", "Process", "Fees", "Timeline", "Why Karthick Vijayakumar & Associates", "FAQ"];
  const [activeTab, setActiveTab] = useState("Overview");
  const activeIndex = tabs.indexOf(activeTab);
  const tabIds = Object.fromEntries(tabs.map((tab) => [tab, `business-section-${tab.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`]));

  useEffect(() => {
    const scroller = detailRef.current;
    if (!scroller) return;
    const sections = tabs.map((tab) => scroller.querySelector(`#${tabIds[tab]}`)).filter(Boolean);
    const updateActive = () => {
      const scrollerRect = scroller.getBoundingClientRect();
      const probe = scrollerRect.top + Math.min(150, scroller.clientHeight * 0.22);
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= probe) current = section;
      }
      if (current) {
        const tab = tabs.find((name) => tabIds[name] === current.id);
        if (tab && tab !== activeTab) setActiveTab(tab);
      }
    };
    updateActive();
    scroller.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      scroller.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [activeTab, tabs.join("|")]);

  const scrollToTab = (tab) => {
    const target = detailRef.current?.querySelector(`#${tabIds[tab]}`);
    if (!target) return;
    setActiveTab(tab);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const primarySection = page.sections?.[Math.min(Math.max(activeIndex, 0), Math.max((page.sections?.length || 1) - 1, 0))];
  const tabContent = {
    Overview: {
      title: "Overview",
      paragraphs: [page.intro, ...(page.sections?.[0]?.paragraphs || [])],
      cards: [
        { label: "Structure", value: page.title },
        { label: "Focus", value: "Clear incorporation planning and compliant documentation" },
        { label: "Support", value: "Practical guidance from preparation through filing" }
      ]
    },
    Benefits: {
      title: "Benefits",
      paragraphs: ["A well-planned registration creates a clearer legal and operational foundation for the business. The practical benefits depend on the structure selected and the business's circumstances."],
      cards: [
        { label: "Legal identity", value: "A formal structure for contracts, assets and business operations" },
        { label: "Governance", value: "Defined ownership, roles and statutory records" },
        { label: "Growth", value: "A structure that can be planned around future ownership or funding needs" }
      ]
    },
    Requirement: {
      title: "Requirement",
      paragraphs: ["Requirements vary by entity and applicant profile. The preparation checklist below is intended to organise the information that normally needs to be reviewed before filing."],
      table: { title: "Pre-filing requirement checklist", headers: ["Area", "Typical requirement"], rows: [["Promoters / directors", "Identity, PAN and address information"], ["Registered office", "Address evidence and applicable consent/NOC"], ["Constitution", "MOA/AOA or applicable agreement"], ["Digital filing", "DSC/DIN-related requirements where applicable"]] }
    },
    Documents: {
      title: "Documents",
      paragraphs: ["Keeping the document set complete before submission helps reduce avoidable resubmissions. Exact documents should be confirmed for the selected entity and applicant circumstances."],
      cards: [
        { label: "Identity", value: "PAN and accepted identity documentation" },
        { label: "Address", value: "Current address proof for the relevant applicants" },
        { label: "Office", value: "Registered-office proof and supporting consent where required" },
        { label: "Constitution", value: "MOA, AOA, LLP agreement or other applicable documents" }
      ]
    },
    Process: {
      title: "Process",
      paragraphs: ["The process follows a sequence rather than a single filing event. The exact forms and approvals depend on the chosen structure and the facts of the applicants."],
      steps: ["Confirm the business structure and objectives", "Prepare identity, address and office documents", "Arrange digital signatures and identification requirements", "Draft and review the constitutional documents", "Submit the applicable MCA filing and respond to queries if raised", "Receive incorporation documents and set the post-registration compliance calendar"]
    },
    Fees: {
      title: "Fees",
      paragraphs: ["Registration cost depends on the entity, authorised capital where relevant, state-specific stamp duty, government charges and the professional scope of work. A single fixed amount should not be assumed for every applicant."],
      table: { title: "Fee components to review", headers: ["Component", "What it covers"], rows: [["Government filing fees", "MCA/statutory filing charges applicable to the case"], ["Stamp duty", "State and document-specific statutory charges where applicable"], ["Professional fee", "Advisory, preparation, filing and coordination scope"], ["Optional registrations", "Additional registrations selected for the business"]] }
    },
    Timeline: {
      title: "Timeline",
      paragraphs: ["Timelines depend on name availability, document readiness, government review and whether a resubmission or clarification is required. The existing service content provides indicative timelines for some structures; the actual case should be confirmed before filing."],
      cards: [
        { label: "Preparation", value: "Document collection and structure review" },
        { label: "Filing", value: "MCA submission after the file is ready" },
        { label: "Review", value: "ROC/MCA processing and any clarification" },
        { label: "Completion", value: "Certificate and post-registration handover" }
      ]
    },
    "Why Karthick Vijayakumar & Associates": {
      title: "Why Karthick Vijayakumar & Associates",
      paragraphs: ["Karthick Vijayakumar, B.Sc., ACS, (CA) is described as a qualified Company Secretary and an Associate Member of the Institute of Company Secretaries of India (ICSI), with professional expertise in Corporate Laws, Secretarial Compliance, Corporate Governance and Taxation.", "The practice advises companies, startups, entrepreneurs and business owners on corporate structuring, company law compliances, statutory and regulatory filings, GST, Income Tax and allied taxation matters. The stated approach is practical and solution-focused, helping clients navigate regulatory requirements while maintaining professional compliance."],
      cards: [
        { label: "Professional focus", value: "Corporate law, secretarial compliance, governance and taxation" },
        { label: "Client focus", value: "Companies, startups, entrepreneurs and business owners" },
        { label: "Approach", value: "Practical, solution-focused regulatory support" }
      ]
    },
    FAQ: {
      title: "Frequently Asked Questions",
      faqs: [
        ["What documents should be prepared before registration?", "The exact set varies by structure and applicant. Common preparation areas include identity and address documents, registered-office evidence, constitutional documents and digital filing requirements."],
        ["How long does registration take?", "The timeline depends on document readiness, name approval, government review and any resubmission. The existing page content gives indicative timelines where available."],
        ["Can the structure be changed later?", "A business can undertake restructuring or conversion in circumstances permitted by law, but planning the structure around the expected business model can avoid unnecessary future work."],
        ["What happens after incorporation?", "The business should organise statutory records, applicable registrations, initial governance actions and a recurring compliance calendar." ]
      ]
    }
  };
  const content = tabContent[activeTab];

  return <motion.div className="service-modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <motion.div className="service-explorer business-registration-page" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}} transition={{duration:.3}}>
      <div className="explorer-top">
        <div><span className="explorer-number">BUSINESS REGISTRATION</span><span className="explorer-eyebrow">Service detail</span></div>
        <button className="focus-close" onClick={onClose} aria-label="Close"><X/></button>
      </div>

      <div ref={detailRef} className="detail-page business-registration-detail-page">
        <button className="back-subtopics" onClick={onClose}><ArrowLeft size={16}/> Back to services</button>
        <article className="detail-page-content business-registration-content">
          <div className="detail-service-visual business-registration-visual">
            <img src={page.image} alt={`${page.title} related visual`} />
            <video src={page.video} autoPlay muted loop playsInline preload="metadata" aria-label={`${page.title} related video`} />
          </div>

          <span className="detail-kicker">Business Registration · KVA</span>
          <h2>{page.title}</h2>
          <div className="detail-rule" />
          <p className="detail-lead">{page.subtitle}</p>

          <nav className="business-tabs" aria-label="Business registration sections">
            {tabs.map(tab => <button key={tab} className={activeTab===tab ? "active" : ""} onClick={()=>scrollToTab(tab)}>{tab}</button>)}
          </nav>

          <div className="business-scroll-sections">
            {tabs.map((tab) => {
              const sectionContent = tabContent[tab];
              return (
                <section
                  key={tab}
                  id={tabIds[tab]}
                  className={`business-tab-panel business-scroll-section ${activeTab === tab ? "is-active" : ""}`}
                >
                  <span className="business-tab-kicker">{String(tabs.indexOf(tab) + 1).padStart(2, "0")} / {String(tabs.length).padStart(2, "0")}</span>
                  <h3>{sectionContent.title}</h3>
                  {sectionContent.paragraphs?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}

                  {sectionContent.cards && <div className="business-info-cards">
                    {sectionContent.cards.map((card, i) => <div className="business-info-card" key={i}><span>{card.label}</span><strong>{card.value}</strong></div>)}
                  </div>}

                  {sectionContent.steps && <div className="business-process-grid">
                    {sectionContent.steps.map((step, i) => <div className="business-process-step" key={i}><span>{String(i + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}
                  </div>}

                  {sectionContent.table && <div className="business-page-table-wrap">
                    <div className="business-table-heading">{sectionContent.table.title}</div>
                    <div className="business-table-scroll"><table className="business-page-table"><thead><tr>{sectionContent.table.headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{sectionContent.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
                  </div>}

                  {sectionContent.faqs && <div className="business-faq-list">
                    {sectionContent.faqs.map(([q, a], i) => <details key={i} open={i === 0}><summary>{q}<ChevronDown size={17}/></summary><p>{a}</p></details>)}
                  </div>}
                </section>
              );
            })}
          </div>

          <section className="business-15-page-guide">
            <div className="service-roadmap-heading">
              <span>15-page service guide</span>
              <strong>{page.title}: detailed implementation reference</strong>
              <small>Each section is designed as a full scrollable page of practical guidance, tables, records, actions and next steps.</small>
            </div>
            {Array.from({length:15}, (_, index) => {
              const source = page.sections?.[index % Math.max(page.sections.length, 1)];
              const heading = [
                "Business objective and structure",
                "Eligibility and key requirements",
                "Documents and information readiness",
                "Preparation and internal review",
                "Application / filing workflow",
                "Government and regulatory interaction",
                "Approvals and decision records",
                "Cost and fee planning",
                "Timeline and dependency management",
                "Common mistakes and avoidable delays",
                "Records, evidence and handover",
                "Post-registration responsibilities",
                "Management review checklist",
                "Ongoing support and future changes",
                "Final action plan and next steps"
              ][index];
              return <React.Fragment key={index}>
                <section className="business-15-page">
                  <div className="service-long-number">{String(index+1).padStart(2,"0")}</div>
                  <div>
                    <span className="service-page-label">Page {index+1} of 15</span>
                    <h3>{heading}</h3>
                    <p>{page.title} should be planned around the actual business objective, applicant profile, ownership structure and documents available for the filing. This page explains the practical considerations that should be reviewed before moving to the next stage.</p>
                    <p>Use the information already provided for this registration together with the selected entity's requirements. Keep a clear record of decisions, supporting evidence, approvals and any clarification requested during the process.</p>
                    {source?.paragraphs?.slice(0,1).map((p,i)=><p key={i}>{p}</p>)}
                    {(index % 3 === 1 || index === 14) && <div className="service-page-table-wrap"><div className="service-page-table-title">{heading} — working checklist</div><div className="service-page-table-scroll"><table><thead><tr><th>Area</th><th>What to review</th><th>Record</th></tr></thead><tbody>
                      <tr><td>Requirement</td><td>Confirm the entity-specific requirement and applicant facts</td><td>Reviewed checklist</td></tr>
                      <tr><td>Documents</td><td>Verify identity, address, office and constitutional records</td><td>Document set</td></tr>
                      <tr><td>Approval</td><td>Confirm signatures, resolutions or consents where applicable</td><td>Approval evidence</td></tr>
                      <tr><td>Completion</td><td>Retain filing acknowledgement and final registration records</td><td>Completion file</td></tr>
                    </tbody></table></div></div>}
                  </div>
                </section>
                {(index % 4 === 2 || index === 14) && <div className="service-inline-cta"><div><span>Next step</span><strong>Talk to KVA about your {page.title.toLowerCase()} requirement.</strong></div><button type="button" onClick={contact}>Contact Us <ArrowUpRight size={15}/></button></div>}
                {(index % 3 === 0 || index === 14) && <div className="service-inline-media"><img src={page.image} alt={`${page.title} related visual`} loading="lazy" /><div><span>Related image</span><strong>{page.title} in practice</strong><p>Keep the relevant records and decisions connected to the registration process.</p></div></div>}
              </React.Fragment>;
            })}
          </section>

          {primarySection && activeTab !== "Overview" && activeTab !== "FAQ" && <section className="business-source-section">
            <span>From the existing service content</span>
            <h4>{primarySection.heading}</h4>
            {primarySection.paragraphs?.slice(0,1).map((paragraph,i)=><p key={i}>{paragraph}</p>)}
          </section>}

          <div className="business-page-cta">
            <div><span>Next step</span><strong>{page.ctas[Math.min(activeIndex, page.ctas.length - 1)] || page.ctas[0]}</strong></div>
            <button onClick={contact}>Talk to KVA <ArrowUpRight size={15}/></button>
          </div>

          <figure className="business-page-inline-media">
            <img src={page.image} alt={`${page.title} related image`} loading="lazy" />
            <video src={page.video} muted loop playsInline preload="metadata" aria-label={`${page.title} related video`} />
          </figure>

          <section className="business-registration-detail-existing">
            <span className="business-tab-kicker">Existing detail</span>
            <h3>Detailed registration guidance</h3>
            {page.sections.map((section,index)=><div className="business-existing-block" key={section.heading}>
              <div className="business-section-number">{String(index+1).padStart(2,"0")}</div>
              <div><h4>{section.heading}</h4>{section.paragraphs?.map((p,i)=><p key={i}>{p}</p>)}{section.list&&<ul className="business-page-list">{section.list.map((item,i)=><li key={i}>{item}</li>)}</ul>}{section.table&&<div className="business-page-table-wrap"><div className="business-table-heading">{section.table.title}</div><div className="business-table-scroll"><table className="business-page-table"><thead><tr>{section.table.headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{section.table.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></div>}{section.highlight&&<div className="business-page-highlight"><span>Important point</span><h5>{section.highlight.title}</h5><p>{section.highlight.text}</p></div>}</div>
            </div>)}
          </section>

          <footer className="business-page-final">
            <div><span>Business Registration support</span><h3>{page.ctas[3] || page.ctas[0]}</h3><p>Tell us what you are planning and the KVA team can help you understand the relevant registration steps and documentation.</p></div>
            <button className="focus-cta" onClick={contact}>Talk to KVA <ArrowUpRight size={16}/></button>
          </footer>
        </article>
      </div>
      <div className="explorer-bottom"><span>{page.title}</span><span>Provided KVA content</span></div>
    </motion.div>
  </motion.div>;
}
function ServiceDetailCard({ service, initialItem=null, onClose, onEnquire }) {
  const [selectedItem,setSelectedItem]=useState(initialItem);
  useEffect(()=>setSelectedItem(initialItem ?? null),[service?.id,initialItem]);
  if(!service) return null;
  const selected = selectedItem === null ? null : (service.items[selectedItem] || service.items[0]);

  return <motion.div className="service-modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
    <motion.div className="service-explorer" initial={{opacity:0,y:24,scale:.985}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:18,scale:.985}} transition={{duration:.35,ease:[.22,1,.36,1]}} role="dialog" aria-modal="true" aria-labelledby="service-dialog-title" onClick={e => e.stopPropagation()}>
      <div className="explorer-top">
        <div><span className="explorer-number">{service.number} / {service.items.length}</span><span className="explorer-eyebrow">Service area</span></div>
        <button className="focus-close" onClick={onClose} aria-label="Close"><X/></button>
      </div>
      <AnimatePresence mode="wait">
        {selected === null ? (
          <motion.div key="list" className="explorer-list" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
            <div className="explorer-heading">
              <img className="explorer-service-image" src={service.image} alt="" />
              <div><h2 id="service-dialog-title">{service.title}</h2><p>{service.items.length} services in this service area.</p></div>
            </div>
            <div className="subtopic-intro"><span>Service pages</span><small>Select a service to view the provided content.</small></div>
            <div className="subtopic-grid-large">
              {service.items.map((item,i)=><motion.button key={item.title} onClick={()=>setSelectedItem(i)} whileHover={{scale:1.012,y:-2}} whileTap={{scale:.98}}>
                <span className="sub-number">{String(i+1).padStart(2,"0")}</span><span className="sub-name">{item.title}</span><ChevronRight/>
              </motion.button>)}
            </div>
          </motion.div>
        ) : (
          <motion.div key={`detail-${selectedItem}`} className="detail-page" initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-18}}>
            <button className="back-subtopics" onClick={()=>setSelectedItem(null)}><ArrowLeft size={16}/> Back to services</button>
            <article className="detail-page-content">
              <div className="detail-service-visual"><img src={service.image} alt="" /></div>
              <span className="detail-kicker">{service.number} / {String(selectedItem+1).padStart(2,"0")} · {service.title}</span>
              <h2>{selected.title}</h2>
              <div className="detail-rule"/>
              <RichServiceContent content={selected.content || selected.description} serviceId={service.id} serviceTitle={selected.title} onEnquire={onEnquire || onClose} />
              <a className="focus-cta" href="#contact" onClick={onClose}>Make an enquiry <ArrowDownRight size={17}/></a>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="explorer-bottom"><span>{selected ? "Service detail" : `${service.items.length} service pages`}</span><span>Provided KVA content</span></div>
    </motion.div>
  </motion.div>;
}

const serviceIcons = [Building2, ShieldCheck, GitBranch, Sparkles];

function Services({ onServiceOpen }) {
  const [openId,setOpenId]=useState(null);
  const toggle=(id)=>setOpenId(openId===id?null:id);

  return <section id="services" className="section services-section">
    <div className="container">
      <SectionHeading
        eyebrow="Our Services"
        title={<>Business support across the full <span className="title-highlight">corporate lifecycle.</span></>}
        text="Business Setup & Registrations, Compliance & Governance, Grow & Restructure, Cross-Border & Regulatory Advisory, CSR & Sustainability, and Taxation."
      />

      <motion.div className="service-directory-grid" initial="hidden" whileInView="show" viewport={{once:true,amount:.06}} variants={{show:{transition:{staggerChildren:.06}}}}>
        {services.map((service)=>{
          const isOpen=openId===service.id;
          return <motion.article className={`service-directory-card ${isOpen?"is-open":""}`} key={service.id}
            variants={{hidden:{opacity:0,y:25},show:{opacity:1,y:0,transition:{duration:.5,ease:[.22,1,.36,1]}}}}>
            <div className="service-directory-image-wrap">
               <img src={service.image} alt={`${service.title} service`} loading="lazy" />
              <span>{service.number}</span>
            </div>
            <div className="service-directory-content">
              <div className="service-directory-heading"><h3>{service.title}</h3><span>{service.items.length} services</span></div><p className="service-directory-subtitle">{service.subtitle}</p>
              <button className="service-directory-toggle" onClick={()=>toggle(service.id)} aria-expanded={isOpen} aria-controls={`directory-${service.id}`}>
                {isOpen ? "Hide services" : "View services"} <ChevronDown size={16} className={isOpen?"rotate":""}/>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && <motion.div id={`directory-${service.id}`} className="service-directory-list" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>
                  {service.items.map((item,index)=><button key={item.title} onClick={()=>onServiceOpen(service,index)}>
                    <span><b>{String(index+1).padStart(2,"0")}</b>{item.title}</span><ChevronRight size={15}/>
                  </button>)}
                </motion.div>}
              </AnimatePresence>
            </div>
          </motion.article>;
        })}
      </motion.div>
    </div>
  </section>;
}

function Approach(){const steps=[["01","Understand","We start with the business context, objective and applicable requirement."],["02","Structure","We map the work into clear actions, documents and responsibilities."],["03","Execute","We coordinate the filing, documentation, advisory or transaction process."],["04","Stay ahead","Where ongoing support is required, we help maintain a disciplined compliance rhythm."]];return <section className="section approach"><div className="container"><SectionHeading dark eyebrow="Our approach" title="Structured work. Clear communication. No unnecessary complexity." text="A simple four-step process keeps every engagement moving with purpose."/><div className="steps">{steps.map(([n,t,p])=><motion.div className="step" key={n} variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,amount:.2}}><span>{n}</span><h3>{t}</h3><p>{p}</p></motion.div>)}</div></div></section>}

function TeamMemberModal({member,index,onClose}){
  if(!member) return null;
  return <motion.div className="team-modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
     <motion.div className="team-modal" initial={{opacity:0,scale:.78,y:30}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.82,y:20}} transition={{type:"spring",stiffness:180,damping:18}} role="dialog" aria-modal="true" aria-labelledby="team-dialog-title" onClick={e=>e.stopPropagation()}>
      <button className="team-modal-close" onClick={onClose} aria-label="Close"><X/></button>
      <div className="team-modal-number">0{index+1} / TEAM</div>
      <img className="team-modal-photo" src={member.image || "/cs-logo.png"} alt={`${member.name} profile`} />
       <div className="team-modal-copy"><span>{member.role}</span><h2 id="team-dialog-title">{member.name}</h2><div className="detail-rule"/><p className="team-qualification"><strong>Qualification</strong>{member.qualification || "Professional profile details to be added"}</p><p>{member.bio}</p></div>
    </motion.div>
  </motion.div>
}

function Team(){
  const [selected,setSelected]=useState(null);

  useEffect(()=>{
    document.body.classList.toggle("team-modal-open",Boolean(selected));
    return()=>document.body.classList.remove("team-modal-open");
  },[selected]);

  useEffect(()=>{
    const onKey=e=>{if(e.key==="Escape")setSelected(null)};
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[]);

  return <section id="team" className="section team-section">
    <div className="container">
      <SectionHeading
        eyebrow="Our team"
        title="The people and support behind KVA."
        text="Two current team members are shown with space reserved for additional profiles as the practice grows. Select a card to view qualification and role details."
      />
      <motion.div
        className="team-grid"
        initial="hidden"
        whileInView="show"
        viewport={{once:true,amount:.08}}
        variants={{show:{transition:{staggerChildren:.08}}}}
      >
        {team.map((member,i)=>(
          <motion.article
            className={`team-card ${member.member ? "" : "is-placeholder"} ${selected?.index===i?"active":""}`}
            key={member.name}
            onClick={()=>setSelected({member,index:i})}
            onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setSelected({member,index:i})}}}
            tabIndex={0}
            role="button"
            aria-label={`View profile for ${member.name}`}
            variants={{hidden:{opacity:0,y:34},show:{opacity:1,y:0}}}
            transition={{duration:.55,ease:[.22,1,.36,1]}}
            whileHover={{y:-8}}
            whileTap={{scale:.985}}
          >
            <div className="team-photo-wrap">
              <img loading="lazy" className="profile-photo real" src={member.image || `/team/team-${i+1}.png`} alt={`${member.name} profile`} />
              <span className="team-view">View profile <ArrowUpRight size={13}/></span>
            </div>
            <div className="team-index">0{i+1}</div>
            <h3>{member.name}</h3>
            <span>{member.role}</span>
          </motion.article>
        ))}
      </motion.div>
    </div>
    <AnimatePresence>
      {selected&&<TeamMemberModal member={selected.member} index={selected.index} onClose={()=>setSelected(null)}/>}
    </AnimatePresence>
  </section>;
}

function Articles({ onArticleOpen }) {
  return <section id="articles" className="section articles-section">
    <div className="container">
      <SectionHeading eyebrow="Insights & Advisory" title="Practical insight for better business decisions." text="Clear, useful guidance on governance, compliance, incorporation and corporate growth." />
      <motion.div className="articles-grid" initial="hidden" whileInView="show" viewport={{once:true,amount:.08}} variants={{show:{transition:{staggerChildren:.08}}}}>
        {articles.map((article) => (
          <motion.article
            key={article.slug}
            className="article-card"
            onClick={() => onArticleOpen(article)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onArticleOpen(article); } }}
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
              }
            }}
          >
            <div className="article-card-image">
              <img src={article.image || "/images/services/compliance-governance.jpeg"} alt="" loading="eager" onError={(e) => { e.currentTarget.src = "/images/services/compliance-governance.jpeg"; }} />
              <span>{article.category}</span>
            </div>
            <div className="article-card-copy">
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <button className="article-read-more" onClick={(e) => { e.stopPropagation(); onArticleOpen(article); }}>
                Read More <ArrowUpRight size={15} />
              </button>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  </section>;
}

function ArticleDetailPage({ article, onClose }) {
  const [activeId, setActiveId] = useState("");
  useEffect(() => {
    if (!article) return;
    const tocItems = article.sections.flatMap((section, sectionIndex) =>
      section.subsections.map((sub, subIndex) => ({
        id: `${section.id}-${subIndex + 1}`,
        label: `${sectionIndex + 1}.${subIndex + 1} ${sub.heading}`,
      }))
    );
    setActiveId(tocItems[0]?.id || "");
    const onScroll = () => {
      const current = tocItems.slice().reverse().find(item => {
        const node = document.getElementById(item.id);
        return node && node.getBoundingClientRect().top <= 170;
      });
      if (current) setActiveId(current.id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive:true});
    return () => window.removeEventListener("scroll", onScroll);
  }, [article]);

  if (!article) return null;

  const tocItems = article.sections.flatMap((section, sectionIndex) =>
    section.subsections.map((sub, subIndex) => ({
      id: `${section.id}-${subIndex + 1}`,
      label: `${sectionIndex + 1}.${subIndex + 1} ${sub.heading}`,
    }))
  );
  const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  const contact = () => {
    onClose();
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}), 0);
  };
  const articleImages = article.relatedImages?.length ? article.relatedImages : [article.image, "/images/services/compliance-governance.jpeg", "/images/services/business-setup.png", "/images/services/grow-restructure.png", "/images/services/cross-border.jpeg", "/images/services/csr-sustainability.jpeg", "/assets/images/due-diligence.png"];

  return <motion.div className="article-detail-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <div className="article-detail-page">
      <div className="article-detail-topbar"><button className="article-back" onClick={onClose}><ArrowLeft size={17}/> Back to Insights & Advisory</button><button className="article-close" onClick={onClose} aria-label="Close article"><X/></button></div>
      <div className="container article-detail-layout">
        <aside className="article-toc"><span>Table of Contents</span><small className="article-toc-note">Jump to a section</small><nav>{tocItems.map(item => <button key={item.id} className={activeId===item.id?"active":""} onClick={() => jumpTo(item.id)}>{item.label}</button>)}</nav></aside>
        <article className="article-content">
          <span className="article-detail-kicker">{article.category} · {article.readTime}</span>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.excerpt}</p>
          <img className="article-detail-image" src={article.image || articleImages[0]} alt="Related advisory visual" />
          <div className="article-related-images" aria-label="Related insight images">
            {articleImages.slice(0, 3).map((src, index) => <img key={`${src}-${index}`} src={src} alt="Related business advisory" loading="lazy" />)}
          </div>
          {article.sections.map((section, sectionIndex) => <React.Fragment key={section.id}>
            <section className="article-section-block"><h2>{sectionIndex + 1}. {section.heading}</h2>
              {section.subsections.map((sub, subIndex) => {
                const subsectionId = `${section.id}-${subIndex + 1}`;
                const sectionNumber = `${sectionIndex + 1}.${subIndex + 1}`;
                return <React.Fragment key={subsectionId}>
                  <div id={subsectionId} className="article-subsection article-subsection-numbered">
                    <h3><span>{sectionNumber}</span>{sub.heading}</h3>
                    {sub.paragraphs?.map((p,i)=><p key={i}>{p}</p>)}
                    {sub.list && <ul>{sub.list.map((item,i)=><li key={i}>{item}</li>)}</ul>}
                  </div>
                  {(sectionIndex + subIndex) % 2 === 1 && <div className="article-inline-cta"><div><span>Need practical guidance?</span><strong>Discuss this requirement with the KVA team.</strong></div><button onClick={contact}>Contact Us <ArrowUpRight size={15}/></button></div>}
                </React.Fragment>;
              })}
            </section>
            {sectionIndex < article.sections.length - 1 && <img className="article-section-image" src={articleImages[(sectionIndex + 1) % articleImages.length]} alt="" loading="lazy" />}
          </React.Fragment>)}
        </article>
        <aside className="article-cta"><div className="article-cta-inner"><span>Need guidance?</span><h2>Talk to our team.</h2><p>Discuss your requirement with the KVA team and get a clear next step.</p><button onClick={contact}>Contact Us <ArrowUpRight size={15}/></button><button onClick={contact}>Consult an Expert <ArrowUpRight size={15}/></button><button onClick={contact}>Book Your Appointment <ArrowUpRight size={15}/></button></div></aside>
      </div>
    </div>
  </motion.div>;
}
function SiteCTA({ onEnquire, eyebrow="Need practical guidance?", title="Let's make the next step clear.", text="Share your requirement with the KVA team and get a focused next step.", label="Make an enquiry" }) {
  return <section className="site-cta-section"><div className="container"><motion.div className="site-cta-card" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}}>
    <div><span>{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>
    <button className="btn primary" onClick={onEnquire}>{label} <ArrowUpRight size={17}/></button>
  </motion.div></div></section>;
}

function AdvisoryDirectory({ onPageOpen }) {
  return <section className="section advisory-directory"><div className="container">
    <SectionHeading eyebrow="Insights & Advisory" title="Explore our specialist corporate support pages." text="Detailed pages for the areas businesses commonly need help with across their corporate lifecycle." />
    <div className="advisory-grid">
      {professionalPages.map(page => <motion.button key={page.slug} className="advisory-card" onClick={() => onPageOpen?.(page.slug)} whileHover={{y:-7}} whileTap={{scale:.985}}>
        <div className="advisory-card-image"><img src={page.image} alt="" loading="lazy"/><span>{page.category}</span></div>
        <div className="advisory-card-copy"><h3>{page.title}</h3><p>{page.subtitle}</p><ArrowUpRight size={17}/></div>
      </motion.button>)}
    </div>
  </div></section>;
}

function ProfessionalPage({ page, onEnquire, onPageOpen }) {
  if (!page) return null;
  return <div className="professional-page">
    <section className="professional-page-hero">
      <div className="container professional-hero-grid">
        <motion.div className="professional-hero-copy" variants={fadeUp} initial="hidden" animate="show">
          <span className="professional-kicker">{page.category} · Karthick Vijayakumar &amp; Associates</span>
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
          <div className="professional-actions">
            <button className="btn primary" onClick={onEnquire}>Make an enquiry <ArrowDownRight size={17}/></button>
            <a className="btn ghost" href="#professional-content">Explore the page <ArrowDownRight size={17}/></a>
          </div>
        </motion.div>
        <motion.div className="professional-hero-media" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.7}}>
          <img src={page.image} alt="" />
          <div className="professional-media-caption"><span>Professional advisory</span><strong>Clear process. Practical support.</strong></div>
        </motion.div>
      </div>
    </section>

    <section id="professional-content" className="section professional-content">
      <div className="container">
        <SectionHeading eyebrow={page.category} title={page.title} text={page.subtitle}/>
        <div className="professional-video-wrap">
          <video autoPlay muted loop playsInline preload="metadata" aria-label={`${page.title} supporting video`}>
            <source src={page.video} type="video/mp4" />
          </video>
          <div><span>Inside the work</span><strong>Structured support around your business requirement.</strong></div>
        </div>
        <div className="professional-sections">
          {page.sections.map(([heading, text], index) => <React.Fragment key={heading}>
            <motion.article className="professional-section-card" variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,amount:.15}}>
              <span>{String(index + 1).padStart(2,"0")}</span>
              <div><h2>{heading}</h2><p>{text}</p></div>
            </motion.article>
            {index === 1 && <div className="professional-inline-media"><img src={page.image} alt="" loading="lazy"/><div><span>Relevant to this service</span><strong>{page.title}</strong></div></div>}
          </React.Fragment>)}
        </div>
        <div className="professional-cta">
          <div><span>Ready to discuss your requirement?</span><h2>{page.cta}</h2><p>Share the context with our team and get a clear next step.</p></div>
          <button className="btn primary" onClick={onEnquire}>Contact KVA <ArrowUpRight size={17}/></button>
        </div>
      </div>
    </section>

    <section className="section professional-related">
      <div className="container">
        <SectionHeading eyebrow="More from KVA" title="Explore related advisory pages." text="Continue with another area of corporate, compliance or advisory support." />
        <div className="professional-related-grid">
          {professionalPages.filter(item => item.slug !== page.slug).slice(0,3).map(item => <button key={item.slug} onClick={() => onPageOpen?.(item.slug)} className="professional-related-card">
            <img src={item.image} alt="" /><span>{item.category}</span><h3>{item.title}</h3><ArrowUpRight size={17}/>
          </button>)}
        </div>
      </div>
    </section>
  </div>;
}

function Contact(){
  const [form,setForm]=useState({name:"",email:"",phone:"",need:"",message:"",website:""});
  const [status,setStatus]=useState("idle");
  const [feedback,setFeedback]=useState("");

  const update=(field)=>(event)=>setForm(current=>({...current,[field]:event.target.value}));

  const submit=async (event)=>{
    event.preventDefault();
    setStatus("sending");
    setFeedback("");
    try{
      const apiBase=(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/,"");
      const response=await fetch(`${apiBase}/api/contact`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form),
      });
      const result=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(result.message || "The enquiry could not be sent.");
      setStatus("success");
      setFeedback("Thanks — your enquiry has been sent to the KVA team.");
      setForm({name:"",email:"",phone:"",need:"",message:"",website:""});
    }catch(error){
      setStatus("error");
      setFeedback(error.message || "Something went wrong. Please try again.");
    }
  };

  return <section id="contact" className="contact section">
    <div className="container">
      <SectionHeading dark eyebrow="Contact us" title="Let's discuss what your business needs." text="Share a few details and the team can understand the requirement before the initial conversation."/>
      <div className="contact-grid">
      <div>
        <h3 className="hours-heading">Hours of Service</h3>
        <div className="contact-details">
          <a href="tel:+918695008695"><Phone/> +91 86950 08695</a>
          <a href="mailto:connect@kvacs.in"><Mail/> connect@kvacs.in</a>
          <span><Building2/> Chennai, Tamil Nadu</span>
        </div>
        <div className="contact-map"><iframe title="Karthick Vijayakumar & Associates location map" src="https://www.google.com/maps?q=Chennai%2C%20Tamil%20Nadu%2C%20India&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div>
      </div>
      <motion.form onSubmit={submit} variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,amount:.2}} aria-describedby="contact-feedback">
        <label>Name<input required value={form.name} onChange={update("name")} placeholder="Your name" autoComplete="name"/></label>
        <div className="form-row">
          <label>Email<input required type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" autoComplete="email"/></label>
          <label>Phone<input required value={form.phone} onChange={update("phone")} placeholder="+91" autoComplete="tel"/></label>
        </div>
        <label>Requirement<select required value={form.need} onChange={update("need")}><option value="">Select a service area</option>{services.map(s=><option key={s.id}>{s.title}</option>)}</select></label>
        <label>Message<textarea rows="4" value={form.message} onChange={update("message")} placeholder="Tell us briefly what you need help with"/></label>
        <label className="form-honeypot" aria-hidden="true">Website<input tabIndex="-1" autoComplete="off" value={form.website} onChange={update("website")}/></label>
        <button className="btn primary full" disabled={status==="sending"}>{status==="sending"?"Sending securely…":"Send enquiry"}<Send size={17}/></button>
        <p id="contact-feedback" className={`form-feedback ${status}`} role={status==="error"?"alert":"status"} aria-live="polite">{feedback}</p>
        <small className="form-note">Your enquiry is sent securely to the KVA team by email.</small>
      </motion.form>
      </div>
    </div>
  </section>;
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Left Side */}
        <div className="footer-company">
          <h2>Karthick Vijayakumar &amp; Associates</h2>
          <p className="footer-role">Company Secretaries</p>

          <div className="footer-location">
            <span className="footer-label">Location</span>
            <span>Chennai, Tamil Nadu, India</span>
          </div>
        </div>

        <div className="footer-navigation">

  <div className="footer-nav-column">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#why">Why Choose Us</a>
  </div>

  <div className="footer-nav-column">
    <a href="#team">Team</a>
    <a href="#contact">Contact</a>

    <a
      href="https://www.instagram.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Instagram
    </a>

    <a
      href="https://www.linkedin.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      LinkedIn
    </a>
  </div>

</div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © 2026 Karthick Vijayakumar &amp; Associates. All rights reserved.
        </p>

        <p>
          Corporate compliance · Governance · Advisory
        </p>
      </div>
    </footer>
  );
}
export function App(){
  const [mobileOpen,setMobileOpen]=useState(false);
  const [selectedService,setSelectedService]=useState(null);
  const [selectedItem,setSelectedItem]=useState(null);
  const articleFromPath=()=>{
    const match=window.location.pathname.match(/^\/articles\/([^/]+)/);
    return match ? (articles.find(article=>article.slug===match[1]) || null) : null;
  };
  const [selectedArticle,setSelectedArticle]=useState(articleFromPath);
  const [selectedBusinessPage,setSelectedBusinessPage]=useState(null);
  const [pageSlug,setPageSlug]=useState(()=>window.location.pathname.replace(/^\/+|\/+$/g,"") || null);

  const openProfessionalPage=(slug)=>{
    if(!slug){
      window.history.pushState({},"","/");
      setPageSlug(null);
      window.scrollTo({top:0,behavior:"smooth"});
      setMobileOpen(false);
      return;
    }
    window.history.pushState({},"",`/pages/${slug}`);
    setPageSlug(slug);
    setMobileOpen(false);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const openArticle=(article)=>{
    if(!article) return;
    window.history.pushState({},"",`/articles/${article.slug}`);
    setSelectedArticle(article);
    setMobileOpen(false);
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const closeArticle=()=>{
    window.history.pushState({},"","/");
    setSelectedArticle(null);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  useEffect(()=>{
    const onPop=()=>{
      const article=articleFromPath();
      setSelectedArticle(article);
      setPageSlug(window.location.pathname.match(/^\/pages\/([^/]+)/)?.[1] || null);
    };
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[]);

  const openService=(service,item=null)=>{if(service?.id==="business-setup-registrations" && item!==null){const title=service.items[item]?.title;const page=businessRegistrationPages.find(p=>p.title===title);if(page){setSelectedBusinessPage(page);return;}}setSelectedService(service);setSelectedItem(item)};
  const closeService=()=>setSelectedService(null);
  const onEnquire=()=>{if(pageSlug)openProfessionalPage(null);setTimeout(()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}),80)};
  useEffect(()=>{document.body.classList.toggle("menu-open",mobileOpen);return()=>document.body.classList.remove("menu-open")},[mobileOpen]);
  useEffect(()=>{document.body.classList.toggle("modal-open",Boolean(selectedService||selectedArticle||selectedBusinessPage));return()=>document.body.classList.remove("modal-open")},[selectedService,selectedArticle,selectedBusinessPage]);
  useEffect(()=>{const onKey=e=>{if(e.key==="Escape"){if(mobileOpen)setMobileOpen(false);if(selectedService)closeService();if(selectedArticle)closeArticle();if(selectedBusinessPage)setSelectedBusinessPage(null)}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[mobileOpen,selectedService,selectedArticle,selectedBusinessPage]);

  const professionalPage=professionalPageMap[pageSlug];
  return <MotionConfig reducedMotion="user">
    <ScrollProgress/>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onServiceOpen={openService} onArticleOpen={openArticle} onPageOpen={openProfessionalPage}/>
    <main id="main-content">
      {professionalPage ? <ProfessionalPage page={professionalPage} onEnquire={onEnquire} onPageOpen={openProfessionalPage}/> : <>
        <Hero onEnquire={onEnquire}/><About/><WhyUs/><SiteCTA onEnquire={onEnquire} title="Need help setting up or staying compliant?" text="Talk to KVA about business setup, compliance, governance and advisory requirements." label="Talk to KVA"/><Services onServiceOpen={openService}/><Approach/><Team/><Articles onArticleOpen={openArticle}/><SiteCTA onEnquire={onEnquire} eyebrow="Before you decide" title="Get a clear corporate next step." text="Tell us what you are planning, changing or reviewing and we can discuss the relevant support." label="Contact KVA"/><Contact/><Footer/>
      </>}
    </main>
    <AnimatePresence>{selectedService&&<ServiceDetailCard service={selectedService} initialItem={selectedItem} onClose={closeService} onEnquire={onEnquire}/>}</AnimatePresence>
    <AnimatePresence>{selectedArticle&&<ArticleDetailPage article={selectedArticle} onClose={closeArticle}/>}</AnimatePresence>
    <AnimatePresence>{selectedBusinessPage&&<BusinessRegistrationPage page={selectedBusinessPage} onClose={()=>setSelectedBusinessPage(null)}/>}</AnimatePresence>
  </MotionConfig>
}
