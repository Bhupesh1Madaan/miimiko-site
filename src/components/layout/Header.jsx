import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Button from './Button';

const COURSES_DROPDOWN = [
    {
        id: 'drawing',
        icon: '✏️',
        bg: 'rgba(255,152,87,0.12)',
        name: 'Drawing',
        meta: '3 Months · 24 Classes · Ages 5–14',
    },
    {
        id: 'painting',
        icon: '🎨',
        bg: 'rgba(52,152,219,0.1)',
        name: 'Painting',
        meta: '3 Months · 24 Classes · Ages 5–14',
    },
    {
        id: 'calligraphy',
        icon: '🖋️',
        bg: 'rgba(155,89,182,0.1)',
        name: 'Calligraphy',
        meta: '2 Months · 16 Classes · Ages 7–14',
    },
];

const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Courses', to: '/courses', hasDropdown: true },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
];

/* ── Courses dropdown panel ── */
const CoursesDropdown = () => (
    <div className="nav-dropdown" role="menu" aria-label="Courses menu">

        {/* Top header bar */}
        {/* <div className="nav-dropdown-header">
            <span className="nav-dropdown-header-icon">🎨</span>
            <div className="nav-dropdown-header-text">
                <strong>Our Courses</strong>
                <span>Live online · Ages 5–14 · Global</span>
            </div>
        </div> */}

        {/* Individual course rows */}
        {COURSES_DROPDOWN.map((course) => (
            <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="nav-dropdown-link"
                role="menuitem"
            >
                <div
                    className="nav-dropdown-link-icon"
                    style={{ background: course.bg }}
                >
                    {course.icon}
                </div>
                <div className="nav-dropdown-link-body">
                    <span className="nav-dropdown-link-name">{course.name}</span>
                    <span className="nav-dropdown-link-meta">{course.meta}</span>
                </div>
                <span className="nav-dropdown-link-arrow">›</span>
            </Link>
        ))}

        <div className="nav-dropdown-divider" />

        {/* View all link */}
        <Link to="/courses" className="nav-dropdown-footer">
            View All Courses &nbsp;→
        </Link>
    </div>
);

/* ── Main Header ── */
const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
    const location = useLocation();

    /* scroll listener */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* close mobile menu on route change */
    useEffect(() => {
        setMenuOpen(false);
        setMobileCoursesOpen(false);
    }, [location]);

    /* lock body scroll when mobile menu is open */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <header className={`header${scrolled ? ' scrolled' : ''}`}>
            <div className="header-inner">

                {/* ── Logo ── */}
                <Link to="/" className="header-logo" aria-label="Miimiko Minds Home">
                    <div className="header-logo-icon"><img src="/src/assets/logo.png" alt="Miimiko Logo" /></div>
                    <div className="header-logo-text">
                        <span className="header-logo-name">Miimiko Minds</span>
                        <span className="header-logo-tagline">Unfold your creative vision</span>
                    </div>
                </Link>

                {/* ── Desktop Nav ── */}
                <nav className="header-nav" aria-label="Main navigation">
                    {NAV_LINKS.map(({ label, to, hasDropdown }) =>
                        hasDropdown ? (

                            /* Courses — wrapper gives position:relative for dropdown */
                            <div key={to} className="nav-item" role="none">
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        `nav-link${isActive ? ' active' : ''}`
                                    }
                                    aria-haspopup="true"
                                >
                                    {label}
                                    <span className="nav-link-chevron">▼</span>
                                </NavLink>
                                <CoursesDropdown />
                            </div>

                        ) : (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `nav-link${isActive ? ' active' : ''}`
                                }
                            >
                                {label}
                            </NavLink>
                        )
                    )}
                </nav>

                {/* ── Desktop CTAs ── */}
                <div className="header-cta">
                    <Button variant="outline" size="sm" to="/contact">
                        Raise a Query
                    </Button>
                    <Button variant="gold" size="sm" to="/contact" arrow>
                        Book Free Demo
                    </Button>
                </div>

                {/* ── Hamburger (mobile only) ── */}
                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    <span
                        className="hamburger-line"
                        style={{ transform: menuOpen ? 'translateY(7.5px) rotate(45deg)' : undefined }}
                    />
                    <span
                        className="hamburger-line"
                        style={{ opacity: menuOpen ? 0 : 1 }}
                    />
                    <span
                        className="hamburger-line"
                        style={{ transform: menuOpen ? 'translateY(-7.5px) rotate(-45deg)' : undefined }}
                    />
                </button>
            </div>

            {/* ── Mobile Menu ── */}
            <nav
                className={`mobile-menu${menuOpen ? ' open' : ''}`}
                aria-label="Mobile navigation"
            >
                {NAV_LINKS.map(({ label, to, hasDropdown }) =>
                    hasDropdown ? (

                        /* Courses — expandable accordion in mobile */
                        <div key={to}>
                            <div
                                role="button"
                                tabIndex={0}
                                aria-expanded={mobileCoursesOpen}
                                onClick={() => setMobileCoursesOpen(o => !o)}
                                onKeyDown={e => e.key === 'Enter' && setMobileCoursesOpen(o => !o)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    background: mobileCoursesOpen
                                        ? 'rgba(60, 98, 174, 0.05)' : 'transparent',
                                    transition: 'background var(--duration-fast)',
                                }}
                            >
                                <span style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--maroon)' }}>
                                    {label}
                                </span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--maroon)',
                                    transition: 'transform 0.3s var(--ease)',
                                    transform: mobileCoursesOpen ? 'rotate(180deg)' : 'none',
                                }}>
                                    ▼
                                </span>
                            </div>

                            {/* Sub-links */}
                            {mobileCoursesOpen && (
                                <div style={{
                                    paddingLeft: '1rem',
                                    marginLeft: '1rem',
                                    borderLeft: '2px solid rgba(60, 98, 174, 0.12)',
                                    marginBottom: '0.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.1rem',
                                }}>
                                    {COURSES_DROPDOWN.map(course => (
                                        <Link
                                            key={course.id}
                                            to={`/courses/${course.id}`}
                                            onClick={() => setMenuOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.65rem',
                                                padding: '0.6rem 0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                textDecoration: 'none',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.95rem',
                                                transition: 'background var(--duration-fast)',
                                            }}
                                        >
                                            <span style={{
                                                width: 32, height: 32, flexShrink: 0,
                                                background: course.bg,
                                                borderRadius: 8,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1rem',
                                            }}>
                                                {course.icon}
                                            </span>
                                            <div>
                                                <span style={{ display: 'block', fontWeight: 600, color: 'var(--maroon)', fontSize: '0.93rem' }}>
                                                    {course.name}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {course.meta}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}

                                    <Link
                                        to="/courses"
                                        onClick={() => setMenuOpen(false)}
                                        style={{
                                            display: 'block',
                                            padding: '0.6rem 0.75rem',
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            color: 'var(--maroon)',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        View All Courses →
                                    </Link>
                                </div>
                            )}
                        </div>

                    ) : (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `mobile-nav-link${isActive ? ' active' : ''}`
                            }
                        >
                            {label}
                        </NavLink>
                    )
                )}

                {/* Mobile CTAs */}
                <div className="mobile-menu-cta">
                    <Button variant="outline" to="/contact" onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
                        Raise a Query
                    </Button>
                    <Button variant="gold" to="/contact" arrow onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
                        Book Free Demo
                    </Button>
                </div>
            </nav>
        </header>
    );
};

export default Header;