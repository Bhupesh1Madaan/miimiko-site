import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Sparkles, 
    BookOpen, 
    Target, 
    Eye, 
    Users, 
    Lightbulb, 
    Leaf, 
    RefreshCw, 
    Smile, 
    Globe, 
    Brain,
    Palette
} from 'lucide-react';
import Button from '../components/layout/Button';

const STATS = [
    { num: '500+', label: 'Happy Students' },
    { num: '5+', label: 'Countries Reached' },
    { num: '4.9★', label: 'Average Rating' },
    { num: '3', label: 'Signature Courses' },
];


const VALUES = [
    { icon: <Leaf size={32} style={{ color: 'var(--gold-dark)' }} />, num: '01', title: 'Child-Led Curiosity', desc: 'We follow the child\'s spark, not a rigid syllabus. Curiosity is the curriculum.' },
    { icon: <RefreshCw size={32} style={{ color: 'var(--gold-dark)' }} />, num: '02', title: 'Process Over Product', desc: 'The joy of making matters more than a perfect result. Mistakes are our best teachers.' },
    { icon: <Smile size={32} style={{ color: 'var(--gold-dark)' }} />, num: '03', title: 'Joy as Method', desc: 'If a child isn\'t having fun, we\'re doing it wrong. Delight and rigour go hand in hand.' },
    { icon: <Globe size={32} style={{ color: 'var(--gold-dark)' }} />, num: '04', title: 'Global Perspective', desc: 'Students encounter art from every culture — building empathy that lasts a lifetime.' },
    { icon: <Brain size={32} style={{ color: 'var(--gold-dark)' }} />, num: '05', title: 'Whole-Brain Learning', desc: 'Art activates both analytical and creative thinking, improving performance across all subjects.' },
    { icon: <Users size={32} style={{ color: 'var(--gold-dark)' }} />, num: '06', title: 'Community & Belonging', desc: 'Every child belongs here. Our classrooms celebrate every background, ability, and style.' },
];

const AboutUs = () => (
    <main>

        {/* ── Page Hero ── */}
        <section className="page-hero">
            <div className="page-hero-bg-pattern" />
            <div className="container">
                <div className="page-hero-content animate-fadeInUp">
                    <nav className="page-hero-breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span>
                        <span className="current">About Us</span>
                    </nav>
                    <div className="page-hero-eyebrow">✦ Our Story</div>
                    <h1 className="page-hero-title">
                        We're on a Mission to<br /><span>Unlock Every Child's</span><br />Creative Potential
                    </h1>
                    <p className="page-hero-desc">
                        Miimiko Minds began with a simple belief — that art education is not a luxury but a
                        fundamental right for every child, everywhere on earth.
                    </p>
                </div>
            </div>
        </section>

        {/* ── Our Story ── */}
        <section className="about-story">
            <div className="container">
                <div className="about-story-grid">

                    {/* Visual */}
                    <div className="about-story-visual animate-slideInLeft">
                        <div className="about-story-img-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
                            {/*
                Replace the emoji below with a real image:
                <img src={new URL('../assets/about-story.jpg', import.meta.url).href} alt="Our story" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              */}
                            <Sparkles size={48} style={{ color: 'var(--maroon)' }} />
                        </div>
                        <div className="about-story-badge">
                            <span className="badge-num">2019</span>
                            <span className="badge-text">Founded with love</span>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="about-story-text animate-slideInRight">
                        <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <BookOpen size={14} /> How It Started
                        </span>
                        <h2 style={{ marginTop: '1rem' }}>
                            A Classroom of <em>One</em> That Grew Into a<br />Global Movement
                        </h2>
                        <p>
                            Miimiko Minds started in 2019 in a tiny Mumbai apartment where our founder, Ananya Krishnan,
                            taught her niece how to draw. Within a week, the neighbour's children wanted in.
                            Within a month, word had spread to families across the city.
                        </p>
                        <p>
                            Ananya realised something powerful: parents everywhere were searching for art education
                            that went beyond copying pictures from YouTube. They wanted structure, progression, and
                            teachers who genuinely understood child development.
                        </p>
                        <p>
                            So she built exactly that. What started as four students on a video call is now a thriving
                            academy with 500+ students across 5+ countries, a team of certified art educators, and
                            a curriculum recognised by parents for its depth, warmth, and results.
                        </p>
                        <p>
                            The name <strong style={{ color: 'var(--maroon)' }}>Miimiko</strong> comes from a word
                            meaning "to imitate with heart" — because all art begins with looking closely at the world
                            and then making it your own.
                        </p>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Button variant="primary" to="/contact" arrow>Book Free Demo</Button>
                            <Button variant="outline" to="/courses">View Courses</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ── Stats Strip ── */}
        <section className="about-stats">
            <div className="creative-blob" style={{ width: 300, height: 300, background: 'rgba(255,200,87,0.06)', top: -80, right: -60 }} />
            <div className="container">
                <div className="about-stats-grid">
                    {STATS.map((s, i) => (
                        <div key={i} className={`about-stat-cell animate-fadeInUp delay-${i * 100 + 100}`}>
                            <div className="about-stat-num">{s.num}</div>
                            <div className="about-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Mission & Vision ── */}
        <section className="about-mission">
            <div className="container">
                <div className="text-center animate-fadeInUp">
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Target size={14} /> Purpose
                    </span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Mission & <span style={{ color: 'var(--maroon)' }}>Vision</span>
                    </h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>
                        Two sides of the same brushstroke
                    </p>
                </div>
                <div className="mission-vision-grid">
                    <div className="mv-card mission animate-slideInLeft">
                        <span className="mv-card-icon" style={{ display: 'block', marginBottom: '1rem' }}>
                            <Target size={36} style={{ color: 'var(--maroon)' }} />
                        </span>
                        <h3>Our Mission</h3>
                        <p>
                            To make world-class art education accessible to every child regardless of geography,
                            background, or prior experience — through live, expert-led online classes that build
                            not just artistic skill, but cognitive strength, emotional resilience, and creative confidence.
                        </p>
                    </div>
                    <div className="mv-card vision animate-slideInRight">
                        <span className="mv-card-icon" style={{ display: 'block', marginBottom: '1rem' }}>
                            <Eye size={36} style={{ color: 'var(--maroon)' }} />
                        </span>
                        <h3>Our Vision</h3>
                        <p>
                            A world where every child grows up knowing they are creative. Where art is not a
                            separate subject but a way of thinking, seeing, and solving — woven into the fabric of
                            how young minds approach every challenge they face in school and in life.
                        </p>
                    </div>
                </div>
            </div>
        </section>



        {/* ── Values ── */}
        <section className="about-values">
            <div className="creative-blob" style={{ width: 280, height: 280, background: 'rgba(122,0,75,0.04)', bottom: -60, right: -60 }} />
            <div className="container">
                <div className="text-center animate-fadeInUp">
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Lightbulb size={14} /> What Drives Us
                    </span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Our Core <span style={{ color: 'var(--maroon)' }}>Values</span>
                    </h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>
                        Principles we live by in every classroom, every call, every brushstroke
                    </p>
                </div>
                <div className="values-grid">
                    {VALUES.map((v, i) => (
                        <div key={i} className={`value-card animate-fadeInUp delay-${(i % 3) * 100 + 100}`}>
                            <div className="value-num">{v.num}</div>
                            <span className="value-icon">{v.icon}</span>
                            <div className="value-title">{v.title}</div>
                            <p className="value-desc">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '4rem 0', background: 'var(--grad-maroon)', position: 'relative', overflow: 'hidden' }}>
            <div className="creative-blob" style={{ width: 350, height: 350, background: 'rgba(255,200,87,0.07)', top: -80, right: -80 }} />
            <div className="container text-center animate-fadeInUp">
                <span className="section-label" style={{ background: 'rgba(255,200,87,0.12)', borderColor: 'rgba(255,200,87,0.3)', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Palette size={14} /> Start the Journey
                </span>
                <h2 className="section-title on-dark" style={{ fontSize: '3rem', margin: '1rem 0 0.75rem' }}>
                    Ready to See the <span style={{ color: 'var(--gold)' }}>Difference?</span>
                </h2>
                <p className="section-sub on-dark" style={{ margin: '0 auto 2.5rem' }}>
                    Book a completely free demo class — no commitment, no credit card, just pure creative joy.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button variant="gold" to="/contact" arrow size="lg">Book Free Demo</Button>
                    <Button variant="outline-gold" to="/courses" size="lg">Explore Courses</Button>
                </div>
            </div>
        </section>

    </main>
);

export default AboutUs;