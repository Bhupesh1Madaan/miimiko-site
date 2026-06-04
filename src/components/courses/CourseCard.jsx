import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Pencil, PenTool, Languages, Palette } from 'lucide-react';
import Button from '../layout/Button';

// Local assets fallbacks (agar Google sheet mein image link galat ho ya khali ho)
import drawingFallback from '../../assets/Drawing.jpeg';
import calligraphyFallback from '../../assets/Calligraphy.jpeg';
import phonicsFallback from '../../assets/Phonics.jpeg';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    const {
        id,
        name,
        brief,
        image,
        duration,
        totalClasses,
        category,
        categoryColor = '#7a004b',
    } = course;

    // 1. Dynamic Route Navigation Links
    const toDetails = () => navigate(`/courses/${id}`);
    const toContact = () => navigate(`/contact?course=${id}&scroll=form`);

    // 2. Dynamic Lucide Icons Selection based on Course ID
    const getCourseIcon = (courseId) => {
        const cid = String(courseId || '').toLowerCase();
        if (cid.includes('drawing')) return <Pencil size={64} />;
        if (cid.includes('calligraphy')) return <PenTool size={64} />;
        if (cid.includes('phonics')) return <Languages size={64} />;
        return <Palette size={64} />; // Default fallback icon
    };

    // 3. Smart Image Handlers (Online URL vs Local Fallbacks)
    const getCourseImage = () => {
        if (image && (image.startsWith('http://') || image.startsWith('https://'))) {
            return image; // Agar live image url hai toh wahi dikhao
        }
        // Agar image khali hai ya local path hai, toh static assets use karo
        const cid = String(id || '').toLowerCase();
        if (cid.includes('drawing')) return drawingFallback;
        if (cid.includes('calligraphy')) return calligraphyFallback;
        if (cid.includes('phonics')) return phonicsFallback;
        return null;
    };

    const displayImage = getCourseImage();

    return (
        <div className="course-card">

            {/* ── Image Area ── */}
            <div className="course-card-image-wrap">

                {/* Know More overlay – Top-Left */}
                <button
                    className="course-card-know-more"
                    onClick={toDetails}
                    aria-label={`Know more about ${name}`}
                >
                    Know More ›
                </button>

                {/* Category Pill – Top-Right */}
                <span
                    className="course-card-category"
                    style={{
                        background: categoryColor,
                        color: '#fff',
                    }}
                >
                    {category || 'Art Program'}
                </span>

                {/* Main Image Rendering */}
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={`${name} course`}
                        className="course-card-image"
                        onError={(e) => {
                            // Agar kabhi link fail ho jaye toh gradient fallback dikhao
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}

                {/* Gradient Fallback Box with Dynamic Icon (If image fails or not available) */}
                <div
                    className="course-card-image"
                    style={{
                        background: 'linear-gradient(135deg, var(--maroon) 0%, var(--maroon-dark) 100%)',
                        display: displayImage ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gold)',
                    }}
                >
                    {getCourseIcon(id)}
                </div>
            </div>

            {/* ── Body Content ── */}
            <div className="course-card-body">
                <h3 className="course-card-name">{name}</h3>
                <p className="course-card-brief">{brief}</p>

                {/* Meta Rows (Duration & Total Classes) */}
                <div className="course-card-meta">
                    <div className="course-card-meta-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span className="course-card-meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={16} style={{ color: 'var(--maroon)' }} /> {duration || '3 Months'}
                        </span>
                        <span className="course-card-meta-label">Duration</span>
                    </div>
                    <div className="course-card-meta-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span className="course-card-meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <BookOpen size={16} style={{ color: 'var(--maroon)' }} /> {totalClasses || 24}
                        </span>
                        <span className="course-card-meta-label">Total Classes</span>
                    </div>
                </div>

                {/* Bottom CTA Actions */}
                <div className="course-card-actions">
                    <Button
                        variant="outline"
                        onClick={toDetails}
                        aria-label={`View details for ${name}`}
                    >
                        Course Details
                    </Button>
                    <Button
                        variant="gold"
                        onClick={toContact}
                        arrow
                        aria-label={`Book demo for ${name}`}
                    >
                        Book Demo
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;