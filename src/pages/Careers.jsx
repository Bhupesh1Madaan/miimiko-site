import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Sparkles, 
    Globe, 
    Calendar, 
    DollarSign, 
    GraduationCap, 
    Users, 
    Palette, 
    Heart, 
    FileText, 
    Phone,
    Briefcase,
    Milestone,
    HelpCircle,
    UserCheck,
    Pencil,
    PenTool
} from 'lucide-react';
import TeacherApplicationForm from '../components/forms/TeacherApplicationForm';
import Button from '../components/layout/Button';

const WHY_JOIN = [
    { icon: <Globe size={24} style={{ color: 'var(--maroon)' }} />, title: 'Work From Anywhere', desc: 'Fully remote — teach from your home, your city, your country. All you need is a good internet connection and a passion for art.' },
    { icon: <Calendar size={24} style={{ color: 'var(--maroon)' }} />, title: 'Flexible Schedule', desc: 'You choose when you teach. Morning batches, afternoon, evening — build a schedule that fits your life, not the other way around.' },
    { icon: <DollarSign size={24} style={{ color: 'var(--maroon)' }} />, title: 'Transparent Pay', desc: 'Competitive, clearly structured compensation. No hidden clauses. You know exactly what you earn per class, every time.' },
    { icon: <GraduationCap size={24} style={{ color: 'var(--maroon)' }} />, title: 'Grow with Us', desc: 'Access to pedagogy workshops, peer feedback sessions, and curriculum training. We invest in our teachers continuously.' },
    { icon: <Sparkles size={24} style={{ color: 'var(--maroon)' }} />, title: 'Global Impact', desc: 'Your lessons reach children across multiple countries. Few career choices give you this scale of meaningful impact from a single session.' },
    { icon: <Users size={24} style={{ color: 'var(--maroon)' }} />, title: 'Supportive Community', desc: 'Join a team of passionate educators who share resources, ideas, and support. You\'re never teaching alone.' },
];

const POSITIONS = [
    {
        id: 'expert',
        icon: <Pencil size={24} style={{ color: 'var(--maroon)' }} />,
        iconClass: 'expert',
        title: 'Online Art Teacher (Drawing)',
        tags: [
            { label: 'Remote', cls: 'remote' },
            { label: 'Part-time', cls: 'parttime' },
            { label: 'Flexible', cls: 'flexible' },
        ],
        summary: 'Teach live online drawing classes to children aged 5–14 in your specialised medium.',
        requirements: [
            'Formal training or degree in Fine Arts, Applied Arts, or a related field',
            'Minimum 1 year of experience teaching or mentoring children',
            'Strong command of Drawing, Sketching, and Shading techniques',
            'Comfortable on camera and using Zoom / Google Meet',
            'Reliable internet connection (minimum 10 Mbps)',
            'Fluent in English; Hindi proficiency is a bonus',
        ],
        responsibilities: [
            'Conduct live, interactive 45-minute classes for small groups (max 6 students)',
            'Follow and adapt the Miimiko Minds curriculum to individual student needs',
            'Track student progress and share regular parent updates',
            'Participate in monthly teacher training & peer review sessions',
            'Contribute ideas and feedback to improve the curriculum',
        ],
    },
    {
        id: 'calligraphy',
        icon: <PenTool size={24} style={{ color: 'var(--maroon)' }} />,
        iconClass: 'calligraphy',
        title: 'Calligraphy Teacher',
        tags: [
            { label: 'Remote', cls: 'remote' },
            { label: 'Part-time', cls: 'parttime' },
            { label: 'Flexible', cls: 'flexible' },
        ],
        summary: 'Teach the beautiful art of lettering and decorative writing to children aged 7–14 years.',
        requirements: [
            'Proven expertise in traditional or modern calligraphy and hand lettering',
            'Minimum 1 year of experience teaching calligraphy/lettering to children',
            'Deep understanding of pen angles, letter formations, and ink flow',
            'Comfortable on camera and using Zoom / Google Meet',
            'Reliable internet connection (minimum 10 Mbps)',
            'Fluent in English',
        ],
        responsibilities: [
            'Conduct live, interactive 40-minute calligraphy classes for small groups (max 6)',
            'Provide real-time corrections on posture, pen grip, and brush stroke technique',
            'Track student progress and share regular parent updates',
            'Participate in monthly pedagogy meetings and curriculum training',
        ],
    },
    {
        id: 'painting_trainer',
        icon: <Palette size={24} style={{ color: 'var(--maroon)' }} />,
        iconClass: 'painting',
        title: 'Painting Trainer',
        tags: [
            { label: 'Remote', cls: 'remote' },
            { label: 'Part-time', cls: 'parttime' },
            { label: 'Flexible', cls: 'flexible' },
        ],
        summary: 'Guide students in watercolours, acrylics, and color theory, helping them discover their unique color voice.',
        requirements: [
            'Formal training or degree in Fine Arts with a focus on painting',
            'Minimum 1 year of experience teaching painting/color theory to kids',
            'Strong command of watercolours, acrylics, color mixing, and brush techniques',
            'Comfortable on camera and using Zoom / Google Meet',
            'Reliable internet connection (minimum 10 Mbps)',
            'Fluent in English',
        ],
        responsibilities: [
            'Conduct live, interactive 45-minute painting classes for small groups (max 6)',
            'Explain colour mixing, light and shadow, and blending techniques clearly',
            'Guide kids to explore expressiveness over copying pictures',
            'Assess student creations and offer constructive, positive feedback',
        ],
    },
];

const PROCESS = [
    { icon: <FileText size={24} style={{ color: 'var(--gold)' }} />, title: 'Apply', desc: 'Fill in the application form below. Tell us about yourself and your relationship with art.' },
    { icon: <Phone size={24} style={{ color: 'var(--gold)' }} />, title: 'Intro Call', desc: 'A friendly 20-minute call with our team to understand your experience and answer your questions.' },
    { icon: <Palette size={24} style={{ color: 'var(--gold)' }} />, title: 'Demo Class', desc: 'Conduct a short live demo class with our evaluators acting as students. We look for warmth, clarity, and engagement.' },
    { icon: <Sparkles size={24} style={{ color: 'var(--gold)' }} />, title: 'Onboard', desc: 'Orientation, curriculum training, and your first assigned batch. You\'re now part of the Miimiko Minds family.' },
];

const PositionCard = ({ pos }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="position-card animate-fadeInUp">
            <div className="position-card-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
                <div className="position-card-header-left">
                    <div className={`position-icon ${pos.iconClass}`}>{pos.icon}</div>
                    <div>
                        <div className="position-title">{pos.title}</div>
                        <div className="position-tags">
                            {pos.tags.map((t, i) => (
                                <span key={i} className={`position-tag ${t.cls}`}>{t.label}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: 320, display: 'none' }}
                        className="position-summary">{pos.summary}</span>
                    <Button
                        variant={pos.iconClass === 'expert' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={e => { e.stopPropagation(); document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                    >
                        Apply Now
                    </Button>
                    <span style={{ color: 'var(--maroon)', fontSize: '1.2rem', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
            </div>

            {open && (
                <div className="position-card-body animate-fadeIn">
                    <div>
                        <div className="position-section-title">Requirements</div>
                        <div className="position-list">
                            {pos.requirements.map((r, i) => (
                                <div key={i} className="position-list-item">{r}</div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="position-section-title">Responsibilities</div>
                        <div className="position-list">
                            {pos.responsibilities.map((r, i) => (
                                <div key={i} className="position-list-item">{r}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Careers = () => (
    <main>

        {/* ── Page Hero ── */}
        <section className="page-hero">
            <div className="page-hero-bg-pattern" />
            <div className="container">
                <div className="page-hero-content animate-fadeInUp">
                    <nav className="page-hero-breadcrumb">
                        <Link to="/">Home</Link><span className="sep">›</span>
                        <span className="current">Careers</span>
                    </nav>
                    <div className="page-hero-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Sparkles size={14} /> Join the Team
                    </div>
                    <h1 className="page-hero-title">
                        Teach Art. Change Lives.<br /><span>Work From Anywhere.</span>
                    </h1>
                    <p className="page-hero-desc">
                        We're looking for passionate artists and educators who believe every child deserves
                        a creative education. Join a global team doing meaningful work from the comfort of home.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button variant="gold" onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })} arrow size="lg">
                            Apply Now
                        </Button>
                        <Button variant="outline-gold" onClick={() => document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' })} size="lg">
                            See Open Roles
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* ── Why Join ── */}
        <section className="careers-why">
            <div className="container">
                <div className="text-center animate-fadeInUp">
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Sparkles size={14} /> Why Miimiko Minds
                    </span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        A Team Worth <span style={{ color: 'var(--maroon)' }}>Joining</span>
                    </h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>
                        We don't just hire teachers — we build careers around your life, not against it
                    </p>
                </div>
                <div className="careers-why-grid">
                    {WHY_JOIN.map((item, i) => (
                        <div key={i} className={`careers-why-card animate-fadeInUp delay-${(i % 3) * 100 + 100}`}>
                            <span className="careers-why-icon">{item.icon}</span>
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Open Positions ── */}
        <section className="careers-positions" id="open-roles">
            <div className="container">
                <div className="text-center animate-fadeInUp">
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Briefcase size={14} /> Open Roles
                    </span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Current <span style={{ color: 'var(--maroon)' }}>Openings</span>
                    </h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>
                        Click any role to expand requirements and responsibilities
                    </p>
                </div>
                <div style={{ marginTop: '3.5rem' }}>
                    {POSITIONS.map(pos => <PositionCard key={pos.id} pos={pos} />)}
                </div>
            </div>
        </section>

        {/* ── Application Process ── */}
        <section className="careers-process">
            <div className="container">
                <div className="text-center animate-fadeInUp">
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Milestone size={14} /> The Journey
                    </span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        How the <span style={{ color: 'var(--maroon)' }}>Application</span> Works
                    </h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>
                        A simple, transparent process from application to your first class
                    </p>
                </div>
                <div className="process-steps">
                    {PROCESS.map((step, i) => (
                        <div key={i} className={`process-step animate-fadeInUp delay-${i * 100 + 100}`}>
                            <div className="process-step-circle">{step.icon}</div>
                            <div className="process-step-title">{step.title}</div>
                            <p className="process-step-desc">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Application Form ── */}
        <section style={{ padding: '4.5rem 0', background: 'var(--cream)' }} id="apply-form">
            <div className="container">
                <div className="text-center animate-fadeInUp" style={{ marginBottom: '3.5rem' }}>
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileText size={14} /> Apply
                    </span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Ready to <span style={{ color: 'var(--maroon)' }}>Join Us?</span>
                    </h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>
                        Fill in the form and our team will reach out within 2 working days
                    </p>
                </div>
                <div style={{ maxWidth: 780, margin: '0 auto' }}>
                    <div className="contact-form-card animate-scaleIn">
                        <div className="contact-form-header">
                            <h3>Career Application</h3>
                            <p>Tell us about yourself and why you'd like to be part of Miimiko Minds.</p>
                        </div>
                        <TeacherApplicationForm />
                    </div>
                </div>
            </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section style={{ padding: '3.5rem 0', background: 'var(--grad-maroon)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="creative-blob" style={{ width: 300, height: 300, background: 'rgba(255,200,87,0.07)', top: -80, right: -60 }} />
            <div className="container animate-fadeInUp">
                <span className="section-label" style={{ background: 'rgba(255,200,87,0.12)', borderColor: 'rgba(255,200,87,0.3)', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <HelpCircle size={14} /> Any Questions?
                </span>
                <h2 className="section-title on-dark" style={{ fontSize: '2.6rem', margin: '1rem 0 0.75rem' }}>
                    Not sure which role is right for you?
                </h2>
                <p className="section-sub on-dark" style={{ margin: '0 auto 2rem' }}>
                    Write to us at <a href="mailto:careers@miimiko.com" style={{ color: 'var(--gold)', fontWeight: 700 }}>careers@miimiko.com</a> and we'll help you figure it out.
                </p>
                <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                    <Button variant="gold" to="/contact" arrow size="lg">Contact Us</Button>
                </div>
            </div>
        </section>

    </main>
);

export default Careers;