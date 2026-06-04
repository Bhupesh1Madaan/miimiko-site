import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, BookOpen, Calendar, Monitor, Award, Users, Globe, Palette, Pencil, PenTool, Languages } from 'lucide-react';
import Button from '../layout/Button';

const API_URL = "https://script.google.com/macros/s/AKfycbxFW23UARN9vDVxfRjFD3CSCbkuUNuDaDDg_3jp2zD7rqll6qqtPZxWCoWNmkU12KAA/exec";

/* ================================================================
   ACCORDION DROPDOWN COMPONENT
   ================================================================ */
const formatLessonText = (text) => {
    const cleaned = text.replace(/^[▶➤►➔➜➜•●■\-*\s]+/, '').trim();
    const colonIndex = cleaned.indexOf(':');
    if (colonIndex > -1) {
        return <><strong style={{ fontWeight: '800', color: 'var(--maroon)' }}>{cleaned.substring(0, colonIndex + 1)}</strong>{cleaned.substring(colonIndex + 1)}</>;
    }
    const dashIndex = cleaned.indexOf(' - ');
    if (dashIndex > -1) {
        return <><strong style={{ fontWeight: '800', color: 'var(--maroon)' }}>{cleaned.substring(0, dashIndex + 3)}</strong>{cleaned.substring(dashIndex + 3)}</>;
    }
    return cleaned;
};

const AccordionItem = ({ module }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="curriculum-module">
            <div className={`curriculum-module-header${open ? ' open' : ''}`} onClick={() => setOpen(p => !p)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(p => !p)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="curriculum-module-num">{module.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{module.lessonCount} sessions</div>
                </div>
                <span className={`curriculum-module-arrow${open ? ' open' : ''}`}>▼</span>
            </div>
            <div className={`curriculum-module-lessons${open ? ' open' : ''}`}>
                {module.lessons.map((lesson, i) => (
                    <div key={i} className="curriculum-lesson">
                        <span className="curriculum-lesson-icon" style={{ color: 'var(--gold)' }}>•</span>
                        <span>{formatLessonText(lesson)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ================================================================
   MAIN COURSE DETAILS PAGE
   ================================================================ */
const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchFailed, setFetchFailed] = useState(false);

    const getCourseIcon = (cid) => {
        const idStr = String(cid || '').toLowerCase();
        if (idStr.includes('drawing')) return <Pencil size={32} />;
        if (idStr.includes('calligraphy')) return <PenTool size={32} />;
        if (idStr.includes('phonics')) return <Languages size={32} />;
        return <Palette size={32} />;
    };

    // Central core processing engine
    const processCourseData = (data, cid) => {
        if (!data || !data.courses) return null;

        const found = data.courses.find(c => String(c.id).toLowerCase().trim() === String(cid).toLowerCase().trim());
        if (!found) return null;

        const currentCid = String(cid).toLowerCase().trim();

        // 1. Group 'Curriculum' tab rows dynamically into continuous levels
        const levelsMap = {};
        if (data.curriculumRows && Array.isArray(data.curriculumRows)) {
            data.curriculumRows.forEach(r => {
                const rowCid = String(r.courseId || '').toLowerCase().trim();
                if (rowCid === currentCid && r.levelName && r.sessionName) {
                    const lvl = String(r.levelName).trim();
                    if (!levelsMap[lvl]) levelsMap[lvl] = [];
                    levelsMap[lvl].push(String(r.sessionName).trim());
                }
            });
        }

        const transformedCurriculum = Object.keys(levelsMap).map((lvl, idx) => ({
            id: `level-${idx}`,
            title: lvl,
            lessonCount: levelsMap[lvl].length,
            lessons: levelsMap[lvl]
        }));

        // 2. Filter 'WhatYouWillLearn' tab rows safely
        let whatYoullLearnPoints = [];
        if (data.learnPoints && Array.isArray(data.learnPoints)) {
            whatYoullLearnPoints = data.learnPoints
                .filter(r => String(r.courseId || '').toLowerCase().trim() === currentCid)
                .map(r => r.point || '')
                .filter(Boolean);
        }

        return {
            ...found,
            category: found.category || "Art Program",
            icon: getCourseIcon(cid),
            stats: [
                { icon: <Calendar size={20} />, value: found.duration, label: 'Duration' },
                { icon: <BookOpen size={20} />, value: found.totalClasses, label: 'Total Classes' },
                { icon: <Clock size={20} />, value: found.sessionDuration || '45 min', label: 'Per Session' },
                { icon: <Users size={20} />, value: `${found.minAge || 5}–${found.maxAge || 14} yrs`, label: 'Age Group' },
            ],
            sidebarFeatures: [
                { icon: <Globe size={18} style={{ color: 'var(--maroon)' }} />, label: 'Mode', value: found.mode || '100% Online, Live' },
                { icon: <Calendar size={18} style={{ color: 'var(--maroon)' }} />, label: 'Schedule', value: found.schedule || 'Flexible' },
                { icon: <Clock size={18} style={{ color: 'var(--maroon)' }} />, label: 'Frequency', value: found.frequency || '2 Sessions/week' },
                { icon: <Monitor size={18} style={{ color: 'var(--maroon)' }} />, label: 'Material Required', value: found.materials || 'Basic Stationery' },
                { icon: <Award size={18} style={{ color: 'var(--maroon)' }} />, label: 'Certificate', value: found.certificate || 'On Completion' },
                { icon: <Users size={18} style={{ color: 'var(--maroon)' }} />, label: 'Teachers', value: found.teachers || 'Certified Experts' },
                { icon: <Globe size={18} style={{ color: 'var(--maroon)' }} />, label: 'Language', value: found.language || 'English / Hindi' },
            ],
            curriculum: transformedCurriculum,
            whatYoullLearn: whatYoullLearnPoints,
        };
    };

    useEffect(() => {
        const callbackName = 'detailsBifurcationCallback_' + courseId + '_' + Math.floor(Math.random() * 100000);

        window[callbackName] = (data) => {
            if (data) {
                const processed = processCourseData(data, courseId);
                if (processed) {
                    setCourse(processed);
                    setFetchFailed(false);
                } else {
                    setFetchFailed(true);
                }
            }
            setLoading(false);
            cleanup();
        };

        const script = document.createElement('script');
        script.src = `${API_URL}${API_URL.includes('?') ? '&' : '?'}callback=${callbackName}`;
        script.id = callbackName;
        script.async = true;

        script.onerror = () => {
            setFetchFailed(true);
            setLoading(false);
            cleanup();
        };

        const cleanup = () => {
            const el = document.getElementById(callbackName);
            if (el) el.remove();
            delete window[callbackName];
        };

        document.body.appendChild(script);
        return () => cleanup();
    }, [courseId]);

    if (loading && !course) return <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Detailed Syllabus Blueprint...</div>;
    if (fetchFailed || !course) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                <Palette size={64} style={{ color: 'var(--maroon)' }} />
                <h2 style={{ color: 'var(--maroon)', fontSize: '2rem' }}>Course blueprint not found</h2>
                <Button variant="primary" to="/courses" arrow>Back to All Courses</Button>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 0 }}>
            <section className="course-details-hero">
                <div className="course-details-hero-bg" style={{ background: 'var(--grad-maroon)' }} />
                <div className="page-hero-bg-pattern" />
                <div className="course-details-hero-content animate-fadeInUp">
                    <nav style={{ marginBottom: '1.25rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                        <span>›</span> <Link to="/courses" style={{ color: 'inherit', textDecoration: 'none' }}>Courses</Link>
                        <span>›</span> <span style={{ color: 'var(--gold)' }}>{course.name}</span>
                    </nav>
                    <span className="course-details-badge">{course.category}</span>
                    <h1 className="course-details-title">{course.icon} {course.name}</h1>
                    <p className="course-details-subtitle">{course.tagline}</p>
                </div>
            </section>

            <div className="container">
                <div className="course-details-stats animate-scaleIn">
                    {course.stats.map((s, i) => (
                        <div key={i} className="course-stat-item">
                            <div className="course-stat-icon">{s.icon}</div>
                            <div className="course-stat-value">{s.value}</div>
                            <div className="course-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="course-details-body">
                <div>
                    <section className="course-section animate-fadeInUp">
                        <h2 className="course-section-title">About This Course</h2>
                        {course.description.trim().split('\n\n').map((para, i) => <p key={i}>{para.trim()}</p>)}
                    </section>

                    {course.whatYoullLearn.length > 0 && (
                        <section className="course-section animate-fadeInUp delay-100">
                            <h2 className="course-section-title">What You'll Learn</h2>
                            <div className="learn-grid">
                                {course.whatYoullLearn.map((item, i) => (
                                    <div key={i} className="learn-item">
                                        <div className="learn-item-check">✓</div>
                                        <p className="learn-item-text">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {course.curriculum.length > 0 && (
                        <section className="course-section animate-fadeInUp delay-200">
                            <h2 className="course-section-title">Course Curriculum</h2>
                            {course.curriculum.map(module => <AccordionItem key={module.id} module={module} />)}
                        </section>
                    )}
                </div>

                <aside className="course-details-sidebar">
                    <div className="sidebar-card animate-slideInRight">
                        <div className="sidebar-card-header">
                            <h3>Course Highlights</h3>
                            <p>Everything you need to know</p>
                        </div>
                        <div className="sidebar-card-body">
                            {course.sidebarFeatures.map((f, i) => (
                                <div key={i} className="sidebar-feature-item">
                                    <div className="sidebar-feature-icon">{f.icon}</div>
                                    <div className="sidebar-feature-text"><strong>{f.label}</strong>{f.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-card animate-slideInRight delay-100">
                        <div className="sidebar-card-body">
                            <div className="sidebar-cta-group">
                                <Button variant="gold" to={`/contact?course=${course.id}&scroll=form`} arrow style={{ width: '100%', justifyContent: 'center' }}>Book a Free Demo</Button>
                                <Button variant="primary" to={`/contact?course=${course.id}&scroll=form`} style={{ width: '100%', justifyContent: 'center' }}>Raise a Query</Button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CourseDetails;