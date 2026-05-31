import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Mail, 
    MapPin, 
    MessageSquare, 
    Phone, 
    Instagram, 
    Clock, 
    Sparkles, 
    HelpCircle 
} from 'lucide-react';
import ContactForm from '../components/forms/ContactForm';
import Button from '../components/layout/Button';

const FAQS = [
    {
        q: 'How does the free demo class work?',
        a: 'After you fill in the form, our team contacts you within 24 hours to schedule a live 1-on-1 session with one of our teachers. The class is tailored to your child\'s age and interests — no prior art experience needed.',
    },
    {
        q: 'Which courses do you currently offer?',
        a: 'We currently offer Drawing, Painting, and Calligraphy for children aged 5–14. Each course is divided into age-appropriate batches: 5–7 years, 8–11 years, and 12–14 years.',
    },
    {
        q: 'How are the classes conducted — what platform do you use?',
        a: 'All classes are conducted live via Zoom or Google Meet. You\'ll receive a link before each session. Classes are interactive, not recorded videos — your child learns in real time with a teacher.',
    },
    {
        q: 'What materials does my child need?',
        a: 'A materials list is shared after you enroll. For Drawing, only paper and pencils are needed to start. Painting requires basic watercolour or acrylic sets. Calligraphy requires a calligraphy pen and ink — all affordable and easily available online.',
    },
    {
        q: 'Are the classes one-on-one or in a group?',
        a: 'We offer both. The free demo is always 1-on-1. Enrolled batches are small groups (maximum 6 students) to ensure every child gets personal attention from the teacher.',
    },
    {
        q: 'Do you offer sibling discounts or long-term packages?',
        a: 'Yes! We offer sibling discounts when two or more children from the same family enroll simultaneously. We also have quarterly and half-yearly packages at reduced rates. Contact us to learn more.',
    },
    {
        q: 'What happens if my child misses a class?',
        a: 'We understand life happens. Missed classes can be rescheduled within the same batch week, subject to teacher availability. We also provide a catch-up summary so your child never falls behind.',
    },
    {
        q: 'Do you provide a certificate at the end of the course?',
        a: 'Yes! Every student who completes a course receives a digital Certificate of Completion from Miimiko Minds. Advanced students also have the option to build a curated digital portfolio.',
    },
];

const FaqItem = ({ faq }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item">
            <div
                className="faq-question"
                onClick={() => setOpen(o => !o)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
                aria-expanded={open}
            >
                <span className="faq-question-text">{faq.q}</span>
                <span className={`faq-arrow${open ? ' open' : ''}`}>▾</span>
            </div>
            <div className={`faq-answer${open ? ' open' : ''}`}>
                <p>{faq.a}</p>
            </div>
        </div>
    );
};

const ContactUs = () => {
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (location.hash === '#contact-form' || searchParams.get('scroll') === 'form') {
            const timer = setTimeout(() => {
                const element = document.getElementById('contact-form-container');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location]);

    return (
        <main>

            {/* ── Page Hero ── */}
            <section className="page-hero">
                <div className="page-hero-bg-pattern" />
                <div className="container">
                    <div className="page-hero-content animate-fadeInUp">
                        <nav className="page-hero-breadcrumb">
                            <Link to="/">Home</Link><span className="sep">›</span>
                            <span className="current">Contact Us</span>
                        </nav>
                        <div className="page-hero-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Mail size={14} /> Get In Touch
                        </div>
                        <h1 className="page-hero-title">
                            Let's Start Your Child's<br /><span>Creative Journey</span> Together
                        </h1>
                        <p className="page-hero-desc">
                            Book a free demo, ask a question, or just say hello. Our team responds within 24 hours — usually much sooner.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Contact Form + Info ── */}
            <section className="contact-section">
                <div className="container">
                    <div className="contact-grid">

                        {/* ── Left: Form ── */}
                        <div id="contact-form-container" className="contact-form-card animate-slideInLeft">
                            <div className="contact-form-header">
                                <h3>Send Us a Message</h3>
                                <p>Fill in the details below and we'll be in touch very soon.</p>
                            </div>
                            <ContactForm />
                        </div>

                    {/* ── Right: Info sidebar ── */}
                    <aside className="contact-info animate-slideInRight">

                        {/* Quick contact */}
                        <div className="contact-info-card">
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <MapPin size={18} style={{ color: 'var(--maroon)' }} /> Quick Contact
                            </h4>
                            <div className="contact-detail">
                                <div className="contact-detail-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={16} style={{ color: 'var(--gold)' }} />
                                </div>
                                <div className="contact-detail-body">
                                    <strong>Email Us</strong>
                                    <a href="mailto:support@miimiko.com">support@miimiko.com</a>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        Usually replies within 4–6 hours
                                    </span>
                                </div>
                            </div>
                            <div className="contact-detail">
                                <div className="contact-detail-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MessageSquare size={16} style={{ color: 'var(--gold)' }} />
                                </div>
                                <div className="contact-detail-body">
                                    <strong>WhatsApp</strong>
                                    <a href="https://wa.me/918799757218">+91 87997 57218</a>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        Tap to chat directly
                                    </span>
                                </div>
                            </div>
                            <div className="contact-detail">
                                <div className="contact-detail-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Phone size={16} style={{ color: 'var(--gold)' }} />
                                </div>
                                <div className="contact-detail-body">
                                    <strong>Call Us</strong>
                                    <a href="tel:+918799757218">+91 87997 57218</a>
                                </div>
                            </div>
                            <div className="contact-detail">
                                <div className="contact-detail-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Instagram size={16} style={{ color: 'var(--gold)' }} />
                                </div>
                                <div className="contact-detail-body">
                                    <strong>Instagram</strong>
                                    <a href="https://instagram.com/miimikoart" target="_blank" rel="noopener noreferrer">
                                        @miimikoart
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Office hours */}
                        <div className="contact-info-card">
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Clock size={18} style={{ color: 'var(--maroon)' }} /> Support Hours
                            </h4>
                            {[
                                { day: 'Monday – Friday', hrs: '9:00 AM – 7:00 PM IST' },
                                { day: 'Saturday', hrs: '10:00 AM – 4:00 PM IST' },
                                { day: 'Sunday', hrs: 'Closed (WhatsApp only)' },
                            ].map((row, i) => (
                                <div key={i} className="contact-hours-row">
                                    <strong>{row.day}</strong>
                                    <span>{row.hrs}</span>
                                </div>
                            ))}
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.55 }}>
                                <Clock size={12} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} /> We aim to respond to all queries within 24 hours during working days.
                            </p>
                        </div>

                        {/* Quick CTA */}
                        <div className="contact-info-card" style={{ background: 'var(--grad-maroon)', border: '2px solid rgba(255,200,87,0.2)' }}>
                            <h4 style={{ color: 'var(--gold)', borderColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Sparkles size={18} style={{ color: 'var(--gold)' }} /> Skip the Queue
                            </h4>
                            <p style={{ fontSize: '0.93rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                                Want to talk to someone right now? Click below to open a WhatsApp chat directly with our team.
                            </p>
                            <Button
                                variant="gold"
                                href="https://wa.me/918799757218?text=Hi%20Miimiko%20Minds!%20I%20want%20to%20book%20a%20free%20demo%20class."
                                arrow
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Chat on WhatsApp
                            </Button>
                        </div>

                    </aside>
                </div>
            </div>
        </section>

        {/* ── FAQ ── */}
        <section className="faq-section">
            <div className="container">
                <div className="text-center animate-fadeInUp">
                    <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <HelpCircle size={14} /> FAQ
                    </span>
                    <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Frequently Asked <span style={{ color: 'var(--maroon)' }}>Questions</span>
                    </h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>
                        Everything parents want to know before enrolling their child
                    </p>
                </div>
                <div className="faq-grid">
                    {FAQS.map((faq, i) => (
                        <FaqItem key={i} faq={faq} />
                    ))}
                </div>
                <div className="text-center mt-lg">
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Still have questions? We'd love to hear from you.
                    </p>
                    <Button variant="primary" to="/contact?scroll=form" arrow>Send Us a Message</Button>
                </div>
            </div>
        </section>

    </main>
    );
};

export default ContactUs;