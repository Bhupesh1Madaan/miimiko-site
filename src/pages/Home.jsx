import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Sparkles, 
    Pencil, 
    Palette, 
    PenTool, 
    Languages, 
    Star, 
    Heart, 
    BookOpen, 
    Award, 
    Users, 
    Globe, 
    Clock, 
    Gift, 
    Smile, 
    Brain, 
    TrendingUp, 
    Shield,
    Lightbulb
} from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import Button from '../components/layout/Button';

import drawingImg from '../assets/Drawing.jpeg';
import calligraphyImg from '../assets/Calligraphy.jpeg';
import phonicsImg from '../assets/Phonics.jpeg';

/* ================================================================
   BANNER DATA
   Swap `gradient` with `image: new URL('../assets/banner1.jpg', import.meta.url).href`
   once you add real images to src/assets/
   ================================================================ */
const BANNERS = [
    {
        id: 1,
        tag: 'New Batch Starting',
        title: 'Unleash Your Child\'s Creative Genius',
        sub: 'Join live online art classes designed for ages 5–14. Expert teachers, flexible schedules, global community.',
        cta: 'Book Free Demo',
        ctaLink: '/contact',
        gradient: 'linear-gradient(135deg, #7a004b 0%, #b5006e 50%, #4a0028 100%)',
        image: null,   // replace with: new URL('../assets/banner1.jpg', import.meta.url).href
    },
    {
        id: 2,
        tag: 'Drawing • Calligraphy • Phonics',
        title: 'Three Courses, Infinite Possibilities',
        sub: 'From pencil lines to brushstrokes — discover the course that sets your child\'s creativity on fire.',
        cta: 'Explore Courses',
        ctaLink: '/courses',
        gradient: 'linear-gradient(135deg, #4a0028 0%, #7a004b 40%, #ff9a57 100%)',
        image: null,
    },
    {
        id: 3,
        tag: 'Proud Parents Worldwide',
        title: 'Trusted by 500+ Families Across 5+ Countries',
        sub: 'Real results. Real growth. Real confidence. Join us today and start your child\'s journey.',
        cta: 'Book Free Demo',
        ctaLink: '/contact',
        gradient: 'linear-gradient(135deg, #2a0016 0%, #7a004b 60%, #ffc857 100%)',
        image: null,
    },
];

/* ================================================================
   COURSES DATA (home page preview)
   ================================================================ */
const HOME_COURSES = [
    {
        id: 'drawing',
        name: 'Drawing',
        icon: <Pencil size={40} style={{ color: 'var(--maroon)' }} />,
        brief: 'Build the foundation of all visual arts. Master lines, proportion, shading, and composition from the ground up.',
        image: drawingImg,
        duration: '3 Months',
        totalClasses: 24,
        category: 'Foundation',
        categoryColor: '#ff9a57',
    },
    {
        id: 'calligraphy',
        name: 'Calligraphy',
        icon: <PenTool size={40} style={{ color: 'var(--maroon)' }} />,
        brief: 'The meditative craft of beautiful writing — from foundational letterforms to flowing decorative scripts.',
        image: calligraphyImg,
        duration: '2 Months',
        totalClasses: 16,
        category: 'All Levels',
        categoryColor: '#9b59b6',
    },
    {
        id: 'phonics',
        name: 'Phonics',
        icon: <Languages size={40} style={{ color: 'var(--maroon)' }} />,
        brief: 'Develop strong reading, pronunciation, and spelling skills through interactive phonics classes.',
        image: phonicsImg,
        duration: '3 Months',
        totalClasses: 24,
        category: 'Language',
        categoryColor: '#2ecc71',
    },
];

/* ================================================================
   ENROLL COURSES
   ================================================================ */
const ENROLL_COURSES = [
    { id: 'drawing', icon: <Pencil size={20} style={{ color: 'var(--maroon)' }} />, name: 'Drawing', meta: '3 Months · 24 Classes' },
    { id: 'calligraphy', icon: <PenTool size={20} style={{ color: 'var(--maroon)' }} />, name: 'Calligraphy', meta: '2 Months · 16 Classes' },
    { id: 'phonics', icon: <Languages size={20} style={{ color: 'var(--maroon)' }} />, name: 'Phonics', meta: '3 Months · 24 Classes' },
];

/* ================================================================
   TESTIMONIALS DATA
   ================================================================ */
const TESTIMONIALS = [
    {
        stars: 5,
        quote: 'My daughter used to be terribly shy. After just two months with Miimiko Minds, she presents her artwork to the whole family with such pride. The transformation is unbelievable.',
        name: 'Priya Sharma',
        role: 'Mother of Aanya, 8',
        avatar: 'PS',
    },
    {
        stars: 5,
        quote: 'The teachers genuinely care. They noticed my son preferred abstract over realistic drawing and tailored lessons around his strengths. That level of attention is rare.',
        name: 'Rahul Mehta',
        role: 'Father of Kabir, 11',
        avatar: 'RM',
    },
    {
        stars: 5,
        quote: 'We are in Canada and worried about the time zone, but scheduling was completely flexible. Now Zara wakes up excited on class days — she calls it her happy hour!',
        name: 'Sunita Kapoor',
        role: 'Mother of Zara, 7',
        avatar: 'SK',
    },
    {
        stars: 5,
        quote: 'Calligraphy gave my son patience he never had before. His school teachers have noticed a dramatic improvement in focus and handwriting. Incredible.',
        name: 'Amit Verma',
        role: 'Father of Rohan, 12',
        avatar: 'AV',
    },
    {
        stars: 5,
        quote: 'We tried two other online art classes before Miimiko Minds. Nothing comes close. The curriculum actually builds on itself — you can see the progress every single week.',
        name: 'Meena Joshi',
        role: 'Mother of Sia, 9',
        avatar: 'MJ',
    },
    {
        stars: 5,
        quote: 'My twins attend different courses simultaneously and both have flourished. The platform handles it beautifully and both instructors are exceptional.',
        name: 'Deepak Nair',
        role: 'Father of Riya & Ravi, 10',
        avatar: 'DN',
    },
];

/* ================================================================
   FOCUS PILLARS
   ================================================================ */
const FOCUS_PILLARS = [
    {
        icon: <Pencil size={24} style={{ color: '#ff9a57' }} />,
        bg: 'rgba(255,152,87,0.12)',
        title: 'Drawing & Sketching',
        desc: 'Line control, shading, perspective — the vocabulary every visual artist needs.',
    },
    {
        icon: <Palette size={24} style={{ color: '#3498db' }} />,
        bg: 'rgba(52,152,219,0.1)',
        title: 'Colour & Painting',
        desc: 'Colour theory, mixing techniques, and expressive brushwork across multiple mediums.',
    },
    {
        icon: <PenTool size={24} style={{ color: '#9b59b6' }} />,
        bg: 'rgba(155,89,182,0.1)',
        title: 'Calligraphy & Lettering',
        desc: 'Precision, patience, and the timeless beauty of hand-lettered art.',
    },
    {
        icon: <Lightbulb size={24} style={{ color: '#ffc857' }} />,
        bg: 'rgba(255,200,87,0.12)',
        title: 'Creative Thinking',
        desc: 'Every class is a prompt to imagine, solve visually, and think beyond the obvious.',
    },
];

const PERSONALITY_TRAITS = [
    { emoji: <Award size={36} style={{ color: 'var(--maroon)' }} />, title: 'Confidence', desc: 'A child who creates learns to trust their own voice.' },
    { emoji: <Brain size={36} style={{ color: 'var(--maroon)' }} />, title: 'Focus', desc: 'Art builds the concentration muscles used in every subject.' },
    { emoji: <Smile size={36} style={{ color: 'var(--maroon)' }} />, title: 'Emotional IQ', desc: 'Expression through art develops deep emotional awareness.' },
    { emoji: <TrendingUp size={36} style={{ color: 'var(--maroon)' }} />, title: 'Resilience', desc: 'Every mistake is a layer. They learn to keep going.' },
];

const AGE_OPTIONS = [
    '5 Years', '6 Years', '7 Years', '8 Years',
    '9 Years', '10 Years', '11 Years', '12 Years',
    '13 Years', '14 Years',
];


/* ================================================================
   BANNER CAROUSEL (extracted component for clarity)
   ================================================================ */
const BannerCarousel = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(0);
    const timerRef = useRef(null);

    const goTo = useCallback((idx) => {
        setActive((idx + BANNERS.length) % BANNERS.length);
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => goTo(active + 1), 5000);
        return () => clearInterval(timerRef.current);
    }, [active, goTo]);

    const restart = (idx) => {
        clearInterval(timerRef.current);
        goTo(idx);
    };

    return (
        <section className="banner-section">
            <div className="banner-track" style={{ transform: `translateX(-${active * 100}%)` }}>
                {BANNERS.map((b, i) => (
                    <div
                        key={b.id}
                        className="banner-slide"
                        onClick={() => navigate(b.ctaLink)}
                        aria-label={b.title}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && navigate(b.ctaLink)}
                    >
                        {/* Background */}
                        {b.image
                            ? <img src={b.image} alt={b.title} className="banner-slide-img" />
                            : <div className="banner-slide-gradient" style={{ background: b.gradient }} />
                        }
                        <div className="banner-slide-overlay" />

                        {/* Content */}
                        <div className="banner-slide-content">
                            <span className="banner-slide-tag">{b.tag}</span>
                            <h2 className="banner-slide-title">{b.title}</h2>
                            <p className="banner-slide-sub">{b.sub}</p>
                            <Button
                                variant="gold"
                                to={b.ctaLink}
                                arrow
                                size="lg"
                                onClick={e => e.stopPropagation()}
                            >
                                {b.cta}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prev / Next */}
            <button className="banner-arrow prev" onClick={e => { e.stopPropagation(); restart(active - 1); }} aria-label="Previous banner">‹</button>
            <button className="banner-arrow next" onClick={e => { e.stopPropagation(); restart(active + 1); }} aria-label="Next banner">›</button>

            {/* Dots */}
            <div className="banner-dots">
                {BANNERS.map((_, i) => (
                    <button
                        key={i}
                        className={`banner-dot${i === active ? ' active' : ''}`}
                        onClick={e => { e.stopPropagation(); restart(i); }}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};


/* ================================================================
   ENROLL SECTION (extracted for state isolation)
   ================================================================ */
const EnrollSection = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0 = age, 1 = course
    const [selectedAge, setSelectedAge] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);

    const handleAgeSelect = (age) => {
        setSelectedAge(age);
        setSelectedCourses([]);
        // small delay for feedback then slide
        setTimeout(() => setStep(1), 350);
    };

    const handleBack = () => {
        setStep(0);
        setSelectedCourses([]);
    };

    const handleCourseSelect = (courseId) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const handleEnroll = () => {
        navigate(`/contact?course=${selectedCourses.join(',')}&age=${encodeURIComponent(selectedAge)}&scroll=form`);
    };

    return (
        <section className="enroll-section">
            <div className="container">
                <div className="text-center">
                    <span className="section-label">🎓 Start Today</span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Enroll Your Child in <span >Minutes</span>
                    </h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>
                        Pick your child's age, choose a course, and we'll handle everything else.
                    </p>
                </div>

                <div className={`enroll-flow-wrapper step-${step}`}>

                    {/* Step indicator */}
                    <div style={{ padding: '2rem 3rem 0', display: 'flex', justifyContent: 'center' }}>
                        <div className="enroll-steps-indicator">
                            <div className="enroll-step-dot">
                                <div className={`enroll-step-circle${step === 0 ? ' active' : ' done'}`}>
                                    {step > 0 ? '✓' : '1'}
                                </div>
                            </div>
                            <div className={`enroll-step-line${step > 0 ? ' done' : ''}`} />
                            <div className="enroll-step-dot">
                                <div className={`enroll-step-circle${step === 1 ? ' active' : step > 1 ? ' done' : ''}`}>
                                    2
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step container */}
                    <div className="enroll-step-container">
                        {step === 0 && (
                            <div className="enroll-step animate-fadeIn">
                                <h3 className="age-selector-title">How old is your child?</h3>
                                <p className="age-selector-sub">We tailor every class to the right developmental stage</p>
                                <div className="age-chips">
                                    {AGE_OPTIONS.map(age => (
                                        <button
                                            key={age}
                                            className={`age-chip${selectedAge === age ? ' selected' : ''}`}
                                            onClick={() => handleAgeSelect(age)}
                                        >
                                            {age}
                                        </button>
                                    ))}
                                </div>
                                <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                                    Select an age to continue →
                                </p>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="enroll-step animate-fadeIn">
                                <h3 className="age-selector-title">
                                    Perfect! Now pick one or more courses for your {selectedAge}-old
                                </h3>
                                <p className="age-selector-sub">All courses have been adapted for {selectedAge}</p>

                                <div className="enroll-courses-grid">
                                    {ENROLL_COURSES.map(course => {
                                        const isSelected = selectedCourses.includes(course.id);
                                        return (
                                            <div
                                                key={course.id}
                                                className={`enroll-course-tile${isSelected ? ' selected' : ''}`}
                                                onClick={() => handleCourseSelect(course.id)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={e => e.key === 'Enter' && handleCourseSelect(course.id)}
                                                aria-pressed={isSelected}
                                            >
                                                <div className="tile-check">✓</div>
                                                <div className="enroll-course-tile-content">
                                                    <span className="tile-icon">{course.icon}</span>
                                                    <div className="tile-name">{course.name}</div>
                                                    <div className="tile-meta">{course.meta}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="enroll-cta-row">
                                    <Button variant="ghost" onClick={handleBack}>
                                        ← Change Age
                                    </Button>
                                    <Button
                                        variant="gold"
                                        size="lg"
                                        arrow
                                        onClick={handleEnroll}
                                        disabled={selectedCourses.length === 0}
                                        style={{
                                            opacity: selectedCourses.length > 0 ? 1 : 0.45,
                                            cursor: selectedCourses.length > 0 ? 'pointer' : 'not-allowed',
                                            transition: 'opacity 0.3s ease',
                                        }}
                                    >
                                        Enroll Now
                                    </Button>
                                </div>

                                {selectedCourses.length === 0 && (
                                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                        Select a course above to enable enrollment
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};


/* ================================================================
   HOME PAGE
   ================================================================ */
const Home = () => {
    return (
        <main>

            {/* ══════════════════════════════════════
          1. BANNER CAROUSEL
      ══════════════════════════════════════ */}
            <BannerCarousel />


            {/* ══════════════════════════════════════
          2. COURSE CARDS
      ══════════════════════════════════════ */}
            <section className="courses-section">
                <div className="container">
                    <div className="text-center animate-fadeInUp">
                        <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <BookOpen size={14} /> What We Teach
                        </span>
                        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            Our <span >Signature Courses</span>
                        </h2>
                        <p className="section-sub" style={{ margin: '0 auto' }}>
                            Each course is crafted to develop specific creative and cognitive abilities
                        </p>
                    </div>

                    <div className="courses-grid animate-fadeInUp delay-200">
                        {HOME_COURSES.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    <div className="text-center mt-lg">
                        <Button variant="primary" to="/courses" arrow size="lg">
                            View All Courses
                        </Button>
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════
          3. WHAT WE FOCUS ON
      ══════════════════════════════════════ */}
            <section className="focus-section">
                {/* Decorative blobs */}
                <div className="creative-blob" style={{ width: 320, height: 320, background: 'rgba(255,200,87,0.07)', top: -60, right: -80 }} />
                <div className="creative-blob" style={{ width: 200, height: 200, background: 'rgba(122,0,75,0.05)', bottom: 40, left: -60, animationDelay: '6s' }} />

                <div className="container">
                    <div className="text-center animate-fadeInUp" style={{ marginBottom: '4rem' }}>
                        <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Sparkles size={14} /> Our Approach
                        </span>
                        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            More Than Art — <span >We Grow Humans</span>
                        </h2>
                        <p className="section-sub" style={{ margin: '0 auto' }}>
                            Every brushstroke and pencil line is building something bigger than a drawing
                        </p>
                    </div>

                    <div className="focus-grid">
                        {/* Left: Skill pillars */}
                        <div className="focus-pillars animate-slideInLeft">
                            <p style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--maroon)', marginBottom: '1.5rem', lineHeight: 1.3 }}>
                                Skills we build<br />
                                <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem', fontFamily: 'var(--font-body)' }}>in every single class</span>
                            </p>
                            {FOCUS_PILLARS.map((p, i) => (
                                <div key={i} className="focus-pillar">
                                    <div className="focus-pillar-icon" style={{ background: p.bg }}>
                                        {p.icon}
                                    </div>
                                    <div className="focus-pillar-body">
                                        <h4>{p.title}</h4>
                                        <p>{p.desc}</p>
                                    </div>
                                </div>
                            ))}

                            {/* <div style={{ marginTop: '1.5rem' }}>
                                <Button variant="primary" to="/about" arrow>
                                    Our Full Philosophy
                                </Button>
                            </div> */}
                        </div>

                        {/* Right: Personality */}
                        <div className="animate-slideInRight">
                            <h3 className="focus-personality-header">
                                The child that grows:<br />
                                <em style={{ color: 'var(--gold-dark)', fontStyle: 'normal', fontSize: '1.5rem' }}>Personality First</em>
                            </h3>
                            <div className="personality-cards">
                                {PERSONALITY_TRAITS.map((t, i) => (
                                    <div key={i} className="personality-card">
                                        <div className="personality-card-emoji">{t.emoji}</div>
                                        <h5>{t.title}</h5>
                                        <p>{t.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════
          4A. BOOK FREE CLASS WITH MIIMIKO
      ══════════════════════════════════════ */}
            <section className="miimiko-section">
                {/* Decorative blobs */}
                <div className="creative-blob" style={{ width: 400, height: 400, background: 'rgba(255,200,87,0.06)', top: -80, right: -100 }} />
                <div className="creative-blob" style={{ width: 250, height: 250, background: 'rgba(255,182,193,0.06)', bottom: -60, left: -60, animationDelay: '8s' }} />

                <div className="container">
                    <div className="miimiko-inner">

                        {/* Left: CTA text */}
                        <div className="miimiko-left animate-slideInLeft">
                            <span className="section-label" style={{ background: 'rgba(255,200,87,0.12)', borderColor: 'rgba(255,200,87,0.3)', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Gift size={14} /> Completely Free
                            </span>
                            <h2 className="miimiko-title mt-sm">
                                Book Your First<br />
                                Free Class with<br />
                                <span>Miimiko Minds</span>
                            </h2>
                            <p className="miimiko-desc">
                                Before you commit to anything, let your child experience the magic firsthand.
                                A live 1-on-1 session, tailored to their age and interests — no pressure, no obligations.
                              </p>
                            <div className="miimiko-perks">
                                {[
                                    'Live session with a certified art teacher',
                                    'Personalised for your child\'s age & interests',
                                    'No credit card or signup fee required',
                                    'Works on any device — tablet, laptop, phone',
                                    'Available in English and Hindi',
                                ].map((perk, i) => (
                                    <div key={i} className="miimiko-perk">
                                        <div className="miimiko-perk-check">✓</div>
                                        <span>{perk}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Button variant="gold" to="/contact" arrow size="lg">Book Free Demo</Button>
                                <Button variant="outline-gold" to="/contact" size="lg">Raise a Query</Button>
                            </div>
                        </div>

                        {/* Right: Mascot card */}
                        <div className="miimiko-card animate-slideInRight">
                            <span className="miimiko-mascot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={36} style={{ color: 'var(--gold)' }} />
                            </span>
                            <h3>Meet Miimiko Minds</h3>
                            <p>
                                Miimiko Minds is our creative philosophy — an artistic guide that helps every student
                                unfold their creative vision with confidence, playfulness, and wisdom.
                            </p>
                            <div className="proud-parents-strip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                                <Award size={16} style={{ color: 'var(--gold)' }} /> Join <strong style={{ margin: '0 4px' }}>500+</strong> Proud Parents Worldwide
                            </div>

                            {/* Mini stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                {[
                                    { val: '5+', lbl: 'Countries' },
                                    { val: '4.9★', lbl: 'Rating' },
                                    { val: '3', lbl: 'Courses' },
                                    { val: '5–14', lbl: 'Age Group' },
                                ].map((s, i) => (
                                    <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '0.85rem' }}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold)' }}>{s.val}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.2rem' }}>{s.lbl}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>





            {/* ── Our Philosophy ── */}
            <section className="philosophy-section">
                <div className="creative-blob" style={{ width: 300, height: 300, background: 'rgba(122,0,75,0.04)', bottom: -60, right: -60 }} />
                <div className="container">
                    <div className="text-center animate-fadeInUp" style={{ marginBottom: '4rem' }}>
                        <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <BookOpen size={14} /> What We Believe
                        </span>
                        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            Our <span>Approach</span>
                        </h2>
                    </div>

                    <div className="philosophy-inner">
                        {/* Quote block */}
                        <div className="philosophy-quote-block animate-slideInLeft">
                            <p className="philosophy-quote-text">
                                "Every child is born an artist. Our only job is to make sure they don't forget that
                                as they grow up. Art is not a subject — it is the language of the soul."
                            </p>
                            <p className="philosophy-quote-attribution">— The Miimiko Minds Teaching Manifesto</p>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Button variant="outline-gold" to="/about" arrow>
                                    Read Our Full Story
                                </Button>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="philosophy-values animate-slideInRight">
                            {[
                                { title: 'Child-Led Learning', desc: 'We follow the child\'s curiosity, not a rigid syllabus. Every lesson adapts to what lights that child up.' },
                                { title: 'Process Over Product', desc: 'We celebrate the journey of creating, not just the final painting. Mistakes are our best teachers.' },
                                { title: 'Joy as a Method', desc: 'If a child isn\'t having fun, we\'re doing it wrong. Playfulness and rigour are not opposites.' },
                                { title: 'Global Perspective', desc: 'Our students encounter art from every culture, building empathy and a worldview that goes beyond borders.' },
                            ].map((v, i) => (
                                <div key={i} className="philosophy-value">
                                    <div className="philosophy-value-num">0{i + 1}</div>
                                    <div className="philosophy-value-body">
                                        <h4>{v.title}</h4>
                                        <p>{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════
          5. ENROLLMENT FLOW
      ══════════════════════════════════════ */}
            <EnrollSection />


            {/* ══════════════════════════════════════
          6. JOIN US
      ══════════════════════════════════════ */}
            <section className="join-section">
                <div className="container">
                    <div className="text-center animate-fadeInUp">
                        <span className="section-label">🤝 Be Part of Miimiko Minds</span>
                        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            Join Our <span >Growing Family</span>
                        </h2>
                        <p className="section-sub" style={{ margin: '0 auto' }}>
                            Whether you're an art expert or a passionate volunteer — there's a place for you here
                        </p>
                    </div>

                    <div className="join-grid">

                        {/* Art Expert card */}
                        <div className="join-card expert animate-slideInLeft">
                            <div className="join-card-blob" />
                            <span className="join-card-icon">👩‍🎨</span>
                            <h3 className="join-card-title">Join as an<br />Art Expert</h3>
                            <p className="join-card-desc">
                                Are you a trained artist or art educator? Teach children across the globe from the
                                comfort of your home. Share your craft, inspire young minds, and build a meaningful career.
                            </p>
                            <div className="join-card-perks">
                                {[
                                    'Competitive and transparent pay',
                                    'Flexible hours — you set your schedule',
                                    'Continuous training & mentorship',
                                    'Global student base',
                                    'Certificate of Teaching Excellence',
                                ].map((perk, i) => (
                                    <div key={i} className="join-card-perk">
                                        <div className="join-perk-dot" />
                                        {perk}
                                    </div>
                                ))}
                            </div>
                            <Button variant="gold" to="/careers" arrow size="lg" style={{ position: 'relative', zIndex: 1 }}>
                                Apply as Teacher
                            </Button>
                        </div>

                        {/* Volunteer card */}
                        <div className="join-card volunteer animate-slideInRight">
                            <div className="join-card-blob" />
                            <span className="join-card-icon">🙌</span>
                            <h3 className="join-card-title">Join as a<br />Volunteer</h3>
                            <p className="join-card-desc">
                                You don't have to be an artist to make a difference. Help us spread art education to
                                underserved communities — as a mentor, coordinator, or community champion.
                            </p>
                            <div className="join-card-perks">
                                {[
                                    'No art expertise required',
                                    'Make a direct impact on children\'s lives',
                                    'Join a passionate global community',
                                    'Volunteer recognition certificate',
                                    'Workshops and skill-building sessions',
                                ].map((perk, i) => (
                                    <div key={i} className="join-card-perk">
                                        <div className="join-perk-dot" />
                                        {perk}
                                    </div>
                                ))}
                            </div>
                            <Button variant="primary" to="/careers" arrow size="lg" style={{ position: 'relative', zIndex: 1 }}>
                                Volunteer with Us
                            </Button>
                        </div>

                    </div>
                </div>
            </section>

        </main>
    );
};

export default Home;