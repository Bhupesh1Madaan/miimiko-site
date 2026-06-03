import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Palette, PenTool, Languages, Sparkles, BarChart2, BookOpen, HelpCircle, Gift } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import Button from '../components/layout/Button';

import drawingImg from '../assets/Drawing.jpeg';
import calligraphyImg from '../assets/Calligraphy.jpeg';
import phonicsImg from '../assets/Phonics.jpeg';

// Student Artworks
import art1 from '../assets/artwork/art1.jpeg';
import art2 from '../assets/artwork/art2.jpeg';
import art3 from '../assets/artwork/art3.jpeg';
import art4 from '../assets/artwork/art4.jpeg';
import art5 from '../assets/artwork/art5.jpeg';

const API_URL = "https://script.google.com/macros/s/AKfycbzoeq_65uqlNtvXz89LwYOpvomuouIdogPfVqNIFsi5AiZzaUZSp-c2kHb-8E-UgCC5/exec";

const FALLBACK_COURSES = [
    {
        id: 'drawing',
        name: 'Drawing',
        icon: <Pencil size={64} />,
        brief: 'Build the foundation of all visual arts. Master lines, proportion, shading, and composition from the ground up.',
        image: drawingImg,
        duration: '3 Months',
        totalClasses: 24,
        category: 'Foundation',
        categoryColor: '#ff9a57',
        sessionDuration: '45 min',
        minAge: 5,
        maxAge: 14,
    },
    {
        id: 'calligraphy',
        name: 'Calligraphy',
        icon: <PenTool size={64} />,
        brief: 'The meditative craft of beautiful writing — from foundational letterforms to flowing decorative scripts.',
        image: calligraphyImg,
        duration: '2 Months',
        totalClasses: 16,
        category: 'All Levels',
        categoryColor: '#9b59b6',
        sessionDuration: '40 min',
        minAge: 7,
        maxAge: 14,
    },
    {
        id: 'phonics',
        name: 'Phonics',
        icon: <Languages size={64} />,
        brief: 'Develop strong reading, pronunciation, and spelling skills through interactive phonics classes.',
        image: phonicsImg,
        duration: '3 Months',
        totalClasses: 24,
        category: 'Language',
        categoryColor: '#2ecc71',
        sessionDuration: '40 min',
        minAge: 5,
        maxAge: 9,
    },
];

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

const mapCourseForCard = (course) => {
    let icon = null;
    const cid = String(course.id || course.name || '').toLowerCase();
    if (cid.includes('drawing')) icon = <Pencil size={64} />;
    else if (cid.includes('calligraphy')) icon = <PenTool size={64} />;
    else if (cid.includes('phonics')) icon = <Languages size={64} />;
    else icon = <Palette size={64} />;

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
        sessionDuration: course.sessionDuration || (cid.includes('drawing') ? '45 min' : '40 min'),
        minAge: course.minAge,
        maxAge: course.maxAge,
    };
};

const getCompareRows = (courseList) => {
    const drawing = courseList.find(c => c.id === 'drawing') || {};
    const calligraphy = courseList.find(c => c.id === 'calligraphy') || {};
    const phonics = courseList.find(c => c.id === 'phonics') || {};

    return [
        {
            feature: 'Duration',
            drawing: drawing.duration || '3 Months',
            calligraphy: calligraphy.duration || '2 Months',
            phonics: phonics.duration || '3 Months'
        },
        {
            feature: 'Total Classes',
            drawing: drawing.totalClasses ? `${drawing.totalClasses} Classes` : '24 Classes',
            calligraphy: calligraphy.totalClasses ? `${calligraphy.totalClasses} Classes` : '16 Classes',
            phonics: phonics.totalClasses ? `${phonics.totalClasses} Classes` : '24 Classes'
        },
        {
            feature: 'Session Length',
            drawing: drawing.sessionDuration || '45 min',
            calligraphy: calligraphy.sessionDuration || '40 min',
            phonics: phonics.sessionDuration || '40 min'
        },
        {
            feature: 'Age Group',
            drawing: drawing.minAge && drawing.maxAge ? `${drawing.minAge}–${drawing.maxAge} yrs` : '5–14 yrs',
            calligraphy: calligraphy.minAge && calligraphy.maxAge ? `${calligraphy.minAge}–${calligraphy.maxAge} yrs` : '7–14 yrs',
            phonics: phonics.minAge && phonics.maxAge ? `${phonics.minAge}–${phonics.maxAge} yrs` : '5–9 yrs',
        },
        { feature: 'Class Size', drawing: 'Max 6', calligraphy: 'Max 6', phonics: 'Max 6' },
        { feature: 'Certificate', drawing: '✓', calligraphy: '✓', phonics: '✓' },
        { feature: 'Beginner Friendly', drawing: '✓', calligraphy: '✓', phonics: '✓' },
        { feature: 'Materials Cost', drawing: 'Very Low', calligraphy: 'Low', phonics: 'Very Low' },
        { feature: 'Free Demo Available', drawing: '✓', calligraphy: '✓', phonics: '✓' },
    ];
};

const FAQS = [
    { q: 'Can my child join with zero art experience?', a: 'Absolutely. All our courses start from the very beginning. Our teachers are trained to meet every child exactly where they are, regardless of prior experience.' },
    { q: 'Can my child take more than one course?', a: 'Yes! Many students enroll in multiple courses either simultaneously or sequentially. Our team can advise on the best combination based on your child\'s age and interests.' },
    { q: 'How do I know which course is right for my child?', a: 'That\'s exactly what the free demo class is for. Our teacher assesses your child\'s interests and abilities during the session and recommends the most suitable course.' },
    { q: 'What if my child doesn\'t enjoy it?', a: 'We offer a satisfaction guarantee. If your child isn\'t happy after the first two paid classes, we\'ll refund your enrollment — no questions asked.' },
];

const FaqItem = ({ faq }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item">
            <div className="faq-question" onClick={() => setOpen(o => !o)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}>
                <span className="faq-question-text">{faq.q}</span>
                <span className={`faq-arrow${open ? ' open' : ''}`}>▾</span>
            </div>
            <div className={`faq-answer${open ? ' open' : ''}`}>
                <p>{faq.a}</p>
            </div>
        </div>
    );
};

const Courses = () => {
    const [courses, setCourses] = useState(FALLBACK_COURSES);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(API_URL);
                const data = await res.json();
                const parsedList = parseGoogleSheetsData(data);
                if (parsedList.length > 0) {
                    const mapped = parsedList.map(mapCourseForCard);
                    setCourses(mapped);
                }
            } catch (err) {
                console.error("Error fetching courses from Google Sheets:", err);
            }
        };
        fetchCourses();
    }, []);

    const compareRows = getCompareRows(courses);

    return (
        <main>

            {/* ── Page Hero ── */}
            <section className="page-hero">
                <div className="page-hero-bg-pattern" />
                <div className="container">
                    <div className="page-hero-content animate-fadeInUp">
                        <nav className="page-hero-breadcrumb">
                            <Link to="/">Home</Link><span className="sep">›</span>
                            <span className="current">Courses</span>
                        </nav>
                        <div className="page-hero-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Palette size={16} /> Our Courses
                        </div>
                        <h1 className="page-hero-title">
                            Signature Courses.<br /><span>Infinite Creative Possibilities.</span>
                        </h1>
                        <p className="page-hero-desc">
                            Every course is crafted by expert artists and child educators to develop real skill,
                            deep confidence, and a lifelong love of making things.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Course Cards Grid ── */}
            <section style={{ padding: '4.5rem 0', background: 'var(--cream)' }}>
                <div className="container">
                    <div className="text-center animate-fadeInUp">
                        <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <BookOpen size={14} /> All Courses
                        </span>
                        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            Choose Your Child's <span style={{ color: 'var(--maroon)' }}>Creative Path</span>
                        </h2>
                        <p className="section-sub" style={{ margin: '0 auto' }}>
                            Not sure which one? Book a free demo — our teachers will guide you.
                        </p>
                    </div>
                    <div className="courses-page-grid">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                    <div className="text-center mt-lg">
                        <Button variant="gold" to="/contact?scroll=form" arrow size="lg">Book Free Demo for Any Course</Button>
                    </div>
                </div>
            </section>

            {/* ── Comparison Table ── */}
            <section className="compare-section">
                <div className="container">
                    <div className="text-center animate-fadeInUp">
                        <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <BarChart2 size={14} /> Compare
                        </span>
                        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            Course <span style={{ color: 'var(--maroon)' }}>Comparison</span>
                        </h2>
                        <p className="section-sub" style={{ margin: '0 auto' }}>
                            A side-by-side look to help you choose
                        </p>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: 180 }}>Feature</th>
                                    <th>Drawing</th>
                                    <th>Calligraphy</th>
                                    <th>Phonics</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compareRows.map((row, i) => (
                                    <tr key={i}>
                                        <td className="feature-name">{row.feature}</td>
                                        <td>
                                            {row.drawing === '✓'
                                                ? <span className="compare-check">✓</span>
                                                : row.drawing === '✗'
                                                    ? <span className="compare-cross">✗</span>
                                                    : row.drawing}
                                        </td>
                                        <td>
                                            {row.calligraphy === '✓'
                                                ? <span className="compare-check">✓</span>
                                                : row.calligraphy === '✗'
                                                    ? <span className="compare-cross">✗</span>
                                                    : row.calligraphy}
                                        </td>
                                        <td>
                                            {row.phonics === '✓'
                                                ? <span className="compare-check">✓</span>
                                                : row.phonics === '✗'
                                                    ? <span className="compare-cross">✗</span>
                                                    : row.phonics}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        {/* ── Student Artwork Showcase ── */}
        <section className="student-artwork-section" style={{ padding: '4.5rem 0', background: 'transparent' }}>
            <div className="container">
                <div className="text-center animate-fadeInUp">
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Sparkles size={14} /> Artwork Gallery
                    </span>
                    <h3 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Created by Our <span style={{ color: 'var(--maroon)' }}>Students</span>
                    </h3>
                    <p className="section-sub" style={{ margin: '0 auto 3.5rem' }}>
                        A glimpse into the stunning work created by our young minds in their live classes!
                    </p>
                </div>
                <div className="artwork-gallery">
                    {[art1, art2, art3, art4, art5].map((imgUrl, i) => (
                        <div key={i} className="artwork-item animate-scaleIn">
                            <div className="artwork-card">
                                <img src={imgUrl} alt={`Student Masterpiece ${i + 1}`} />
                                <div className="artwork-overlay">
                                    <span>Masterpiece #{i + 1}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: '4.5rem 0', background: 'transparent' }}>
            <div className="container">
                <div className="text-center animate-fadeInUp">
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <HelpCircle size={14} /> Quick Answers
                    </span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Course <span style={{ color: 'var(--maroon)' }}>FAQs</span>
                    </h2>
                </div>
                <div className="faq-grid" style={{ marginTop: '3.5rem' }}>
                    {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} />)}
                </div>
            </div>
        </section>

        {/* ── Final CTA ── */}
        <section style={{ padding: '4rem 0', background: 'var(--grad-maroon)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="creative-blob" style={{ width: 350, height: 350, background: 'rgba(255,200,87,0.07)', top: -80, right: -80 }} />
            <div className="creative-blob" style={{ width: 200, height: 200, background: 'rgba(255,182,193,0.06)', bottom: -60, left: -40, animationDelay: '8s' }} />
            <div className="container animate-fadeInUp">
                <span className="section-label" style={{ background: 'rgba(255,200,87,0.12)', borderColor: 'rgba(255,200,87,0.3)', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Gift size={14} /> No Commitment
                </span>
                <h2 className="section-title on-dark" style={{ fontSize: '3rem', margin: '1rem 0 0.75rem' }}>
                    Still Deciding? <span style={{ color: 'var(--gold)' }}>Try It Free First.</span>
                </h2>
                <p className="section-sub on-dark" style={{ margin: '0 auto 2.5rem' }}>
                    Book a free 1-on-1 demo class — our teacher will match your child to the perfect course live.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button variant="gold" to="/contact?scroll=form" arrow size="lg">Book Free Demo</Button>
                    <Button variant="outline-gold" to="/contact?scroll=form" size="lg">Ask a Question</Button>
                </div>
            </div>
        </section>

    </main>
    );
};

export default Courses;