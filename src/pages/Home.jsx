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
import banner1 from '../assets/miimiko-bg.png';

const API_URL = "https://script.google.com/macros/s/AKfycbzf7Qe2F__VTutTPo_YfQb3JmcEu44-oZhaX6aY6KvMO0SG6tftcR9ZU22-w1ZoOW-K/exec";

/* ================================================================
   HELPER TO PARSE AND MERGE DYNAMIC SHEET STRUCTURES
   ================================================================ */
const parseGoogleSheetsData = (data) => {
    let rawCourses = [];
    let rawDetails = [];

    if (Array.isArray(data)) {
        rawCourses = data;
    } else if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        const coursesKey = keys.find(k => k.toLowerCase().includes('course') && !k.toLowerCase().includes('detail'));
        const detailsKey = keys.find(k => k.toLowerCase().includes('detail') || k.toLowerCase().includes('curriculum') || k.toLowerCase().includes('learn') || k.toLowerCase().includes('sheet2'));

        rawCourses = data[coursesKey || keys[0]] || [];
        rawDetails = data[detailsKey || keys[1]] || [];
    }

    // 1. Normalize courses basic details
    const normalized = rawCourses.map(c => {
        const norm = {};
        for (let key of Object.keys(c)) {
            const lower = key.toLowerCase().replace(/[\s_-]/g, '');
            if (lower === 'courseid' || lower === 'id') norm.id = c[key];
            else if (lower === 'coursename' || lower === 'name') norm.name = c[key];
            else if (lower === 'tagline') norm.tagline = c[key];
            else if (lower === 'brief') norm.brief = c[key];
            else if (lower === 'description' || lower === 'desc') norm.description = c[key];
            else if (lower === 'duration' || lower === 'displayduration') norm.duration = c[key];
            else if (lower === 'totalsessions' || lower === 'totalclasses') norm.totalSessions = c[key];
            else if (lower === 'sessionsperlevel') norm.sessionsPerLevel = c[key];
            else if (lower === 'category') norm.category = c[key];
            else if (lower === 'minage') norm.minAge = c[key];
            else if (lower === 'maxage') norm.maxAge = c[key];
            else if (lower === 'mode') norm.mode = c[key];
            else if (lower === 'schedule') norm.schedule = c[key];
            else if (lower === 'frequency') norm.frequency = c[key];
            else if (lower === 'materials' || lower === 'materialrequired') norm.materials = c[key];
            else if (lower === 'certificate') norm.certificate = c[key];
            else if (lower === 'teachers') norm.teachers = c[key];
            else if (lower === 'language') norm.language = c[key];
            else if (lower === 'icon') norm.icon = c[key];
            else if (lower === 'image') norm.image = c[key];
            else if (lower === 'whatyoulllearn') norm.whatYoullLearn = c[key];
            else if (lower === 'curriculum') norm.curriculum = c[key];
            else norm[key] = c[key];
        }

        if (norm.id) norm.id = String(norm.id).toLowerCase().trim();
        if (norm.minAge) norm.minAge = parseInt(norm.minAge, 10) || 5;
        if (norm.maxAge) norm.maxAge = parseInt(norm.maxAge, 10) || 14;

        if (typeof norm.whatYoullLearn === 'string') {
            norm.whatYoullLearn = norm.whatYoullLearn.split(/[|,\n]/).map(x => x.trim()).filter(Boolean);
        }
        return norm;
    });

    // 2. Merge granular course details if present in a second sheet
    if (Array.isArray(rawDetails) && rawDetails.length > 0) {
        normalized.forEach(course => {
            const courseId = String(course.id || '').toLowerCase().trim();

            const courseRows = rawDetails.filter(r => {
                const rId = String(r.id || r.courseId || r['course id'] || r['Course ID'] || '').toLowerCase().trim();
                return rId === courseId;
            });

            if (courseRows.length > 0) {
                // Parse What You'll Learn bullet points
                const learnRows = courseRows.filter(r => {
                    const t = String(r.type || r.Type || '').toLowerCase();
                    return t.includes('learn') || t.includes('bullet') || t.includes('what');
                });
                if (learnRows.length > 0) {
                    course.whatYoullLearn = learnRows.map(r => r.content || r.Content || r.value || r.Value || '');
                }

                // Parse Curriculum
                const curriculumRows = courseRows.filter(r => {
                    const t = String(r.type || r.Type || '').toLowerCase();
                    return t.includes('curriculum') || t.includes('syll') || t.includes('less') || t.includes('level');
                });
                if (curriculumRows.length > 0) {
                    const levelsMap = {};
                    curriculumRows.forEach(r => {
                        const lvl = String(r.level || r.Level || 'Level 1').trim();
                        if (!levelsMap[lvl]) {
                            levelsMap[lvl] = [];
                        }
                        const val = r.content || r.Content || r.value || r.Value;
                        if (val) {
                            if (typeof val === 'string' && val.includes('|')) {
                                val.split('|').map(x => x.trim()).forEach(x => levelsMap[lvl].push(x));
                            } else {
                                levelsMap[lvl].push(val);
                            }
                        }
                    });

                    course.curriculum = Object.keys(levelsMap).map(lvl => ({
                        level: lvl,
                        sessions: levelsMap[lvl]
                    }));
                }
            }
        });
    }

    return normalized;
};

const mapCourseForHome = (course) => {
    let icon = null;
    const cid = String(course.id || course.name || '').toLowerCase();
    if (cid.includes('drawing')) icon = <Pencil size={40} style={{ color: 'var(--maroon)' }} />;
    else if (cid.includes('calligraphy')) icon = <PenTool size={40} style={{ color: 'var(--maroon)' }} />;
    else if (cid.includes('phonics')) icon = <Languages size={40} style={{ color: 'var(--maroon)' }} />;
    else icon = <Palette size={40} style={{ color: 'var(--maroon)' }} />;

    let img = null;
    if (course.image && (course.image.startsWith('http') || course.image.startsWith('/'))) {
        img = course.image;
    } else {
        if (cid.includes('drawing')) img = drawingImg;
        else if (cid.includes('calligraphy')) img = calligraphyImg;
        else if (cid.includes('phonics')) img = phonicsImg;
    }

    let catColor = '#ff9a57';
    if (cid.includes('drawing')) catColor = '#ff9a57';
    else if (cid.includes('calligraphy')) catColor = '#9b59b6';
    else if (cid.includes('phonics')) catColor = '#2ecc71';

    return {
        id: course.id || cid,
        name: course.name,
        brief: course.brief || course.tagline || '',
        image: img,
        duration: course.displayDuration || course.duration || '3 Months',
        totalClasses: course.totalSessions || course.totalClasses || 24,
        category: course.category || 'Art Program',
        categoryColor: catColor,
        icon: icon,
    };
};

// Banners array removed in favor of parallax hero overview section.

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
        icon: <Languages size={24} style={{ color: '#2ecc71' }} />,
        bg: 'rgba(46, 204, 113, 0.1)',
        title: 'Phonics & Reading',
        desc: 'Letter sounds, blends, digraphs, and fluent pronunciation through interactive storytelling.',
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
   HERO PARALLAX SECTION
   ================================================================ */
const HeroSection = () => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollToForm = () => {
        const target = document.getElementById('enroll-section');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/contact?scroll=form');
        }
    };

    // Painting / Creative Ornaments configuration
    const ornaments = [
        { icon: <Palette size={48} />, top: '12%', left: '72%', speed: 0.25, color: '#fdb849', duration: '6s', delay: '0s' },
        { icon: <Pencil size={36} />, top: '24%', left: '85%', speed: 0.45, color: '#ff9a57', duration: '8s', delay: '-2s' },
        { icon: <PenTool size={42} />, top: '65%', left: '68%', speed: 0.15, color: '#ff66c4', duration: '7s', delay: '-1s' },
        { icon: <Sparkles size={52} />, top: '45%', left: '80%', speed: 0.35, color: '#ffd700', duration: '9s', delay: '-3s' },
        { icon: <Languages size={40} />, top: '75%', left: '86%', speed: 0.5, color: '#2ecc71', duration: '10s', delay: '-4s' },
        { icon: <Star size={30} />, top: '8%', left: '58%', speed: 0.3, color: '#ffffff', duration: '5s', delay: '-0.5s' },
        { icon: <Lightbulb size={32} />, top: '32%', left: '52%', speed: 0.2, color: '#ffe66d', duration: '11s', delay: '-1.5s' },
    ];

    return (
        <section className="hero-parallax-section">
            {/* Background Parallax Layer */}
            <div
                className="hero-parallax-bg"
                style={{ transform: `translateY(${scrollY * 0.35}px)` }}
            />

            {/* Flying Ornaments Layer */}
            {ornaments.map((orb, index) => (
                <div
                    key={index}
                    className="hero-parallax-ornament"
                    style={{
                        top: orb.top,
                        left: orb.left,
                        color: orb.color,
                        transform: `translateY(${scrollY * orb.speed}px)`,
                    }}
                >
                    <div
                        className="animate-float-ornament"
                        style={{
                            animationDuration: orb.duration,
                            animationDelay: orb.delay,
                        }}
                    >
                        {orb.icon}
                    </div>
                </div>
            ))}

            <div className="container">
                <div className="hero-left-content">
                    <span className="hero-parallax-badge">
                        🎨 Welcome to Miimiko Minds
                    </span>
                    <h1 className="hero-parallax-title">
                        Unfold Your Child's <br />
                        <span>Creative Vision</span>
                    </h1>
                    <p className="hero-parallax-desc">
                        Miimiko Minds is a premier online learning space offering structured, live interactive classes in Drawing, Calligraphy, and Phonics for kids aged 5–14. Led by expert educators, we turn raw curiosity into lasting creative confidence, one artwork at a time.
                    </p>
                    <div className="hero-parallax-ctas">
                        <Button
                            variant="gold"
                            onClick={handleScrollToForm}
                            arrow
                            size="lg"
                        >
                            Book Free Demo
                        </Button>
                        <Button
                            variant="outline-gold"
                            to="/courses"
                            size="lg"
                        >
                            Explore Courses
                        </Button>
                    </div>
                </div>
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
    const [courses, setCourses] = useState(HOME_COURSES);

    useEffect(() => {
        // 1. Home page ke liye ek unique global callback function name banao
        const callbackName = 'homeSheetsCallback_' + Math.floor(Math.random() * 100000);

        // 2. Window object par register karo taaki Google ka response direct pakad sakein
        window[callbackName] = (data) => {
            if (data && data.courses && data.courses.length > 0) {
                // Hame poore master data package me se sirf 'courses' tab ka array chahiye
                const mapped = data.courses.map(mapCourseForHome);
                setCourses(mapped);
            }
            cleanup();
        };

        // 3. Dynamic Script Tag inject karo jo CORS ko bypass karega
        const script = document.createElement('script');
        script.src = `${API_URL}${API_URL.includes('?') ? '&' : '?'}callback=${callbackName}`;
        script.id = callbackName;
        script.async = true;

        script.onerror = (err) => {
            console.error("Home page live fetch failed, using local fallbacks:", err);
            cleanup();
        };

        const cleanup = () => {
            const el = document.getElementById(callbackName);
            if (el) el.remove();
            delete window[callbackName];
        };

        document.body.appendChild(script);
        return () => cleanup();
    }, []);

    return (
        <main>

            {/* ══════════════════════════════════════
          1. HERO PARALLAX SECTION
      ══════════════════════════════════════ */}
            <HeroSection />


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
                            Our <span>Signature Courses</span>
                        </h2>
                        <p className="section-sub" style={{ margin: '0 auto' }}>
                            Each course is crafted to develop specific creative and cognitive abilities
                        </p>
                    </div>

                    <div className="courses-grid animate-fadeInUp delay-200">
                        {courses.map(course => (
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
                                { title: 'Process Over Product', desc: 'We celebrate the journey of creating, not just the final artwork. Mistakes are our best teachers.' },
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