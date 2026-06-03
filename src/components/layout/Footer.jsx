import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react';
import Button from './Button';
import logoImg from '../../assets/logo.png';

const QUICK_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Our Courses', to: '/courses' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact Us', to: '/contact' },
];

const COURSES = [
    { label: 'Drawing', to: '/courses/drawing' },
    { label: 'Calligraphy', to: '/courses/calligraphy' },
    { label: 'Phonics', to: '/courses/phonics' },
];

const SOCIAL = [
    { icon: <Facebook size={18} />, href: 'https://facebook.com', title: 'Facebook' },
    { icon: <Instagram size={18} />, href: 'https://instagram.com', title: 'Instagram' },
    { icon: <Youtube size={18} />, href: 'https://youtube.com', title: 'YouTube' },
    { icon: <Twitter size={18} />, href: 'https://twitter.com', title: 'Twitter' },
];

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">

            {/* decorative blob */}
            <div
                className="creative-blob"
                style={{
                    width: 350, height: 350,
                    background: 'rgba(255,200,87,0.04)',
                    top: -60, right: -80,
                }}
            />

            {/* ── Top grid ── */}
            <div className="footer-top">

                {/* Brand column */}
                <div>
                    <div className="footer-brand-logo">
                        <div className="footer-brand-icon"><img src={logoImg} alt="Miimiko Logo" /></div>
                        <span className="footer-brand-name">Miimiko Minds</span>
                    </div>
                    <p className="footer-brand-desc">
                        Unfold your Creative Vision with Miimiko Minds - Your Gateway to Artistic Mastery. Join us to explore a world of creativity and transform your passion into skill.
                    </p>
                    <div className="footer-social">
                        {SOCIAL.map(({ icon, href, title }) => (
                            <a
                                key={title}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-link"
                                aria-label={title}
                                title={title}
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick links */}
                <div>
                    <h4 className="footer-col-title">Quick Links</h4>
                    <ul className="footer-links">
                        {QUICK_LINKS.map(({ label, to }) => (
                            <li key={to}>
                                <Link to={to} className="footer-link">{label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Courses */}
                <div>
                    <h4 className="footer-col-title">Our Courses</h4>
                    <ul className="footer-links">
                        {COURSES.map(({ label, to }) => (
                            <li key={to}>
                                <Link to={to} className="footer-link">{label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="footer-col-title">Get In Touch</h4>

                    <div className="footer-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Mail size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <a href="mailto:support@miimiko.com" style={{ color: 'inherit' }}>
                            support@miimiko.com
                        </a>
                    </div>

                    <div className="footer-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.75rem' }}>
                        <Phone size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <a href="tel:+918799757218" style={{ color: 'inherit' }}>
                            +91 87997 57218
                        </a>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <Button variant="gold" size="sm" to="/contact?scroll=form" arrow>
                            Book Free Demo
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="footer-divider" />

            {/* ── Bottom bar ── */}
            <div className="footer-bottom">
                <p className="footer-copyright">
                    © {year} Miimiko Minds. All rights reserved.
                </p>
                <div className="footer-bottom-links">
                    <a href="/privacy" className="footer-bottom-link">Privacy Policy</a>
                    <a href="/terms" className="footer-bottom-link">Terms of Use</a>
                    <a href="/sitemap" className="footer-bottom-link">Sitemap</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;