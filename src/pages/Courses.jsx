import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Palette, BarChart2, BookOpen, HelpCircle, Gift, Sparkles } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import Button from '../components/layout/Button';

const API_URL = "https://script.google.com/macros/s/AKfycbzf7Qe2F__VTutTPo_YfQb3JmcEu44-oZhaX6aY6KvMO0SG6tftcR9ZU22-w1ZoOW-K/exec";

// Fallback Data jab tak API load nahi hoti ya network error ho
const FALLBACK_DATA = {
    courses: [
        { id: 'drawing', name: 'Drawing', brief: 'Build the foundation of all visual arts.', duration: '3 Months', totalClasses: 24, category: 'Foundation', categoryColor: '#ff9a57' },
        { id: 'calligraphy', name: 'Calligraphy', brief: 'The craft of beautiful writing.', duration: '2 Months', totalClasses: 16, category: 'All Levels', categoryColor: '#9b59b6' },
        { id: 'phonics', name: 'Phonics', brief: 'Develop strong reading and pronunciation skills.', duration: '3 Months', totalClasses: 24, category: 'Language', categoryColor: '#2ecc71' }
    ],
    comparison: {
        coursesOrder: ['drawing', 'calligraphy', 'phonics'],
        rows: [
            { feature: 'Duration', drawing: '3 Months', calligraphy: '2 Months', phonics: '3 Months' },
            { feature: 'Certificate', drawing: 'true', calligraphy: 'true', phonics: 'true' },
            { feature: 'Class Size', drawing: 'Max 6', calligraphy: 'Max 6', phonics: 'Max 6' }
        ]
    },
    gallery: [],
    faqs: [
        { Question: 'Can my child join with zero experience?', Answer: 'Absolutely. All our courses start from the very beginning.' }
    ]
};

const FaqItem = ({ faq }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item">
            <div className="faq-question" onClick={() => setOpen(o => !o)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}>
                <span className="faq-question-text">{faq.Question}</span>
                <span className={`faq-arrow${open ? ' open' : ''}`}>▾</span>
            </div>
            <div className={`faq-answer${open ? ' open' : ''}`}>
                <p>{faq.Answer}</p>
            </div>
        </div>
    );
};

const Courses = () => {
    const [pageData, setPageData] = useState(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllPageData = () => {
            // 1. Ek unique global function name banao jise Google call karega
            const callbackName = 'googleSheetsCallback_' + Math.floor(Math.random() * 100000);

            // 2. Us function ko window object par register karo data catch karne ke liye
            window[callbackName] = (data) => {
                if (data && data.courses && data.courses.length > 0) {
                    setPageData(data);
                }
                setLoading(false);

                // Cleanup: Kaam hone ke baad script tag aur function delete karo
                cleanup();
            };

            // 3. Dynamic Script Tag generate karo jo CORS bypass karega
            const script = document.createElement('script');
            // Hum URL ke end mein ?callback= globally registered function ka naam bhej rahe hain
            script.src = `${API_URL}${API_URL.includes('?') ? '&' : '?'}callback=${callbackName}`;
            script.id = callbackName;
            script.async = true;

            // Error handling agar script fail ho jaye
            script.onerror = (err) => {
                console.error("JSONP script failed to load, falling back:", err);
                setLoading(false);
                cleanup();
            };

            const cleanup = () => {
                const el = document.getElementById(callbackName);
                if (el) el.remove();
                delete window[callbackName];
            };

            // 4. Page par script inject karo jo automatic execute ho jayegi
            document.body.appendChild(script);

            return () => cleanup();
        };

        fetchAllPageData();
    }, []);


    // Helper to format comparison table cells (True/False/Null/Text)
    const renderCompareCell = (val) => {
        if (val === undefined || val === null || val.toString().trim() === "") {
            return <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Null</span>;
        }

        const cleanVal = val.toString().toLowerCase().trim();
        if (cleanVal === 'true') {
            return <span className="compare-check" style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>;
        }
        if (cleanVal === 'false') {
            return <span className="compare-cross" style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>✗</span>;
        }
        return val;
    };

    return (
        <main>
            {/* ── 1st Section: Page Hero (STATIC - No Backend) ── */}
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

            {/* ── 2nd Section: Course Cards Grid (Fetched dynamically) ── */}
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
                        {pageData.courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    <div className="text-center mt-lg">
                        <Button variant="gold" to="/contact?scroll=form" arrow size="lg">Book Free Demo for Any Course</Button>
                    </div>
                </div>
            </section>

            {/* ── 3rd Section: Course Comparison Table (Scrollable & Dynamic Width) ── */}
            <section className="compare-section" style={{ padding: '4.5rem 0' }}>
                <div className="container">
                    <div className="text-center animate-fadeInUp">
                        <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <BarChart2 size={14} /> Compare
                        </span>
                        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            Course <span style={{ color: 'var(--maroon)' }}>Comparison</span>
                        </h2>
                        <p className="section-sub" style={{ margin: '0 auto 2.5rem' }}>
                            A side-by-side look to help you choose
                        </p>
                    </div>

                    {/* Horizontal scroll handle karne ke liye overflowX lagaya hai */}
                    <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                        <table className="compare-table" style={{ width: '100%', minWidth: `${200 + (pageData.comparison.coursesOrder.length * 150)}px`, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ minWidth: 180, textAlign: 'left', padding: '1rem' }}>Feature</th>
                                    {pageData.comparison.coursesOrder.map(courseId => (
                                        <th key={courseId} style={{ textTransform: 'capitalize', padding: '1rem' }}>
                                            {courseId}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.comparison.rows.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                        <td className="feature-name" style={{ fontWeight: 'bold', padding: '1rem' }}>{row.feature}</td>
                                        {pageData.comparison.coursesOrder.map(courseId => (
                                            <td key={courseId} style={{ textAlign: 'center', padding: '1rem' }}>
                                                {renderCompareCell(row[courseId])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── 4th Section: Student Artwork Showcase (Scrollable Gallery) ── */}
            {pageData.gallery.length > 0 && (
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

                        {/* Overflow-X allow karega user ko swipe karne ke liye agar bohot saari images hain */}
                        <div className="artwork-gallery-wrapper" style={{ overflowX: 'auto', display: 'flex', gap: '1.5rem', paddingBottom: '1rem', WebkitOverflowScrolling: 'touch' }}>
                            {pageData.gallery.map((art, i) => (
                                <div key={i} className="artwork-item animate-scaleIn" style={{ flex: '0 0 auto', width: '280px' }}>
                                    <div className="artwork-card">
                                        <img src={art.imageUrl} alt={`Student Masterpiece ${i + 1}`} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div className="artwork-overlay">
                                            <span>Masterpiece #{i + 1}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 5th Section: FAQs (Fetched dynamically, UI structure preserved) ── */}
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
                        {pageData.faqs.map((faq, i) => (
                            <FaqItem key={i} faq={faq} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6th Section: Final CTA (STATIC - No Changes) ── */}
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