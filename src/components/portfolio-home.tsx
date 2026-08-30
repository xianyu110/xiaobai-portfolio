import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  ExternalLink,
  FolderOpen,
  Mail,
  Play,
  X,
} from 'lucide-react';

import '@/styles/portfolio-home.css';

type Section = 'home' | 'internship' | 'program' | 'creation' | 'more';

const sections: Array<{ id: Section; label: string }> = [
  { id: 'home', label: 'HOME' },
  { id: 'internship', label: 'INTERNSHIP' },
  { id: 'program', label: 'PROGRAM' },
  { id: 'creation', label: 'CREATION' },
  { id: 'more', label: 'MORE' },
];

const projects = [
  {
    name: 'User Research & Needs Interviews',
    detail: 'Designed research plans, questionnaires and interview notes.',
    tag: 'RESEARCH',
  },
  {
    name: 'Bond Underwriting Intern',
    detail: 'Project due diligence, data scraping and indicator calculation.',
    tag: 'INTERNSHIP',
  },
  {
    name: 'Public-Science Program',
    detail: 'Wrote popular-science proposals, scripts and short films.',
    tag: 'PROGRAM',
  },
];

const traits = [
  ['🌸', 'Time Management'],
  ['🌿', 'Stress Resistant'],
  ['🎯', 'Goal Oriented'],
  ['✅', 'Multitask Coordinator'],
];

function SiteNav({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (section: Section) => void;
}) {
  return (
    <nav className="replica-nav" aria-label="Portfolio sections">
      {sections.map((section) => (
        <button
          key={section.id}
          className={active === section.id ? 'active' : ''}
          type="button"
          onClick={() => onSelect(section.id)}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}

export function PortfolioHome() {
  const [active, setActive] = useState<Section>('home');
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[number] | null
  >(null);
  const [showCreations, setShowCreations] = useState(false);
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id as Section);
      },
      { threshold: 0.55 }
    );
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = 'Genius Octopus';
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedName(target.slice(0, index));
      if (index === target.length) window.clearInterval(timer);
    }, 95);
    return () => window.clearInterval(timer);
  }, []);

  function goTo(section: Section) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    setActive(section);
  }

  return (
    <main className="replica-page">
      <section id="home" className="replica-screen hero-screen">
        <SiteNav active={active} onSelect={goTo} />
        <div className="hero-card">
          <p className="hero-title">Welcome to My World</p>
          <h1>
            {typedName}
            <span className="type-caret">▮</span>
          </h1>
          <p className="hero-subtitle">MBTI: ENTP (Daily) &amp; ESTJ (Work)</p>
          <div className="trait-grid">
            {traits.map(([icon, label]) => (
              <span key={label}>
                <b>{icon}</b>
                {label}
              </span>
            ))}
          </div>
        </div>
        <img
          className="character character-home"
          src="/portfolio/chibi-home.jpg"
          alt="卡通人物插画"
        />
        <div className="scroll-hint">
          <ArrowDown size={16} /> scroll to explore
        </div>
      </section>

      <section
        id="internship"
        className="replica-screen forest-screen internship-screen"
      >
        <SiteNav active={active} onSelect={goTo} />
        <div className="internship-copy section-copy">
          <span className="screen-index">02 / EXPERIENCE</span>
          <h2>
            THE
            <br />
            INTERNSHIP
          </h2>
          <p>
            Two chapters of research, finance and practical problem solving.
          </p>
        </div>
        <div className="experience-stack">
          {projects.slice(0, 2).map((project) => (
            <button
              key={project.name}
              className="experience-card"
              type="button"
              onClick={() => setSelectedProject(project)}
            >
              <span className="card-mark">◆</span>
              <span>
                <b>{project.name}</b>
                <small>{project.detail}</small>
              </span>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
        <img
          className="character character-work"
          src="/portfolio/chibi-work.jpg"
          alt="使用电脑工作的卡通人物"
        />
      </section>

      <section id="program" className="replica-screen program-screen">
        <SiteNav active={active} onSelect={goTo} />
        <div className="program-heading">
          <h2>THE PROGRAMS</h2>
        </div>
        <div className="program-grid">
          {projects.map((project, index) => (
            <button
              key={project.name}
              className="program-card"
              type="button"
              onClick={() => setSelectedProject(project)}
            >
              <span className="program-number">0{index + 1}</span>
              <FolderOpen size={34} strokeWidth={1.2} />
              <b>{project.tag}</b>
              <strong>{project.name}</strong>
              <small>{project.detail}</small>
            </button>
          ))}
        </div>
      </section>

      <section
        id="creation"
        className="replica-screen forest-screen creation-screen"
      >
        <SiteNav active={active} onSelect={goTo} />
        <div className="creation-heading">
          <h2>THE CREATIONS</h2>
        </div>
        <div className="phone-stage">
          <img src="/portfolio/phones.jpg" alt="自媒体作品手机界面" />
          <button
            className="phone-hotspot"
            type="button"
            onClick={() => setShowCreations(true)}
            aria-label="打开自媒体作品"
          >
            <Play size={22} fill="currentColor" />
          </button>
        </div>
        <img
          className="character character-creation"
          src="/portfolio/chibi-home.jpg"
          alt="卡通人物"
        />
      </section>

      <section id="more" className="replica-screen more-screen">
        <SiteNav active={active} onSelect={goTo} />
        <div className="photo-board">
          <div className="pin pin-a" />
          <div className="pin pin-b" />
          <div className="pin pin-c" />
          <div className="pin pin-d" />
          <div className="pin pin-e" />
          <div className="pin pin-f" />
          <div className="photo photo-a">
            <img src="/portfolio/more-climbing.jpg" alt="climbing day" />
            <span>climbing day</span>
          </div>
          <div className="photo photo-b">
            <img src="/portfolio/more-dujiangyan.jpg" alt="Dujiangyan" />
            <span>Dujiangyan</span>
          </div>
          <div className="photo photo-c">
            <img src="/portfolio/more-museum.jpg" alt="museum vibes" />
            <span>museum vibes</span>
          </div>
          <div className="photo photo-d">
            <img src="/portfolio/more-concert.jpg" alt="live concert" />
            <span>live concert</span>
          </div>
          <div className="photo photo-e">
            <img src="/portfolio/more-yummy.jpg" alt="yummy" />
            <span>yummy!</span>
          </div>
          <div className="photo photo-f">
            <img src="/portfolio/more-paris.jpg" alt="Paris nights" />
            <span>Paris nights</span>
          </div>
          <div className="photo photo-g">
            <img src="/portfolio/more-zju.jpg" alt="ZJU offer" />
            <span>ZJU offer</span>
          </div>
        </div>
        <img
          className="character character-more"
          src="/portfolio/chibi-more.jpg"
          alt="戴帽子的卡通人物"
        />
        <a className="contact-link" href="mailto:hello@xiaobai.example">
          <Mail size={15} /> say hello <ExternalLink size={14} />
        </a>
      </section>

      <button
        className="floating-top"
        type="button"
        onClick={() => goTo('home')}
        aria-label="返回顶部"
      >
        <ArrowDown size={18} />
      </button>

      {selectedProject ? (
        <div
          className="replica-overlay"
          role="presentation"
          onClick={() => setSelectedProject(null)}
        >
          <article
            className="replica-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="关闭"
            >
              <X size={17} />
            </button>
            <span className="screen-index">{selectedProject.tag}</span>
            <h2>{selectedProject.name}</h2>
            <p>{selectedProject.detail}</p>
            <div className="modal-note">
              角色 / Research · Coordination · Storytelling
            </div>
          </article>
        </div>
      ) : null}
      {showCreations ? (
        <div
          className="replica-overlay"
          role="presentation"
          onClick={() => setShowCreations(false)}
        >
          <article
            className="creation-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setShowCreations(false)}
              aria-label="关闭"
            >
              <X size={17} />
            </button>
            <span className="screen-index">CREATOR AI WORKS</span>
            <h2>我的自媒体作品</h2>
            <p>在这里查看短视频、日常记录和灵感片段。</p>
            <a href="https://www.douyin.com/" target="_blank" rel="noreferrer">
              打开抖音主页 <ArrowUpRight size={16} />
            </a>
          </article>
        </div>
      ) : null}
    </main>
  );
}
