import React, { useState } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import Button from '../layout/Button';

const RESPONSE_API_URL = "https://script.google.com/macros/s/AKfycbzGV15DsYRkVoLNLXfqH8EaXRWz_HP7RP6XIBqQCvLsXjk8qGNevzDbhg3UGLonjgLi1A/exec";

const FormField = ({ label, required, error, children }) => (
    <div className="form-field">
        <label className="form-label">{label}{required && <span>*</span>}</label>
        {children}
        {error && <span className="form-error-msg">{error}</span>}
    </div>
);

const SPECIALIZATION_OPTIONS = [
    'Drawing', 'Phonics', 'Calligraphy', 'Sketching & Shading',
    'Digital Art', 'Craft & Origami', 'Multiple Mediums', 'Other',
];

const EXPERIENCE_OPTIONS = [
    'Less than 1 Year', '1–3 Years', '3–5 Years', '5+ Years',
];

const validate = (fields) => {
    const errors = {};
    if (!fields.fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!fields.email.trim()) errors.email = 'Please enter your email.';
    else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email = 'Please enter a valid email.';
    if (!fields.phone.trim()) errors.phone = 'Please enter your phone number.';
    if (!fields.country.trim()) errors.country = 'Please enter your country.';
    if (!fields.specialization) errors.specialization = 'Please select your specialization.';
    if (!fields.experience) errors.experience = 'Please select your teaching experience.';
    if (!fields.portfolio.trim()) {
        errors.portfolio = 'Please enter your portfolio or resume link.';
    } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(fields.portfolio)) {
        errors.portfolio = 'Please enter a valid URL.';
    }
    if (!fields.aboutMe.trim()) errors.aboutMe = 'Please write a short statement about your experience.';
    if (!fields.onlineComfortable) errors.onlineComfortable = 'You must confirm comfort with online teaching.';
    return errors;
};

const TeacherApplicationForm = () => {
    const [fields, setFields] = useState({
        fullName: '',
        email: '',
        phone: '',
        country: '',
        specialization: '',
        experience: '',
        portfolio: '',
        aboutMe: '',
        onlineComfortable: false,
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFields(prev => ({ ...prev, [key]: val }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate(fields);
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('formType', 'vacancy');
            formData.append('fullName', fields.fullName);
            formData.append('email', fields.email);
            formData.append('phone', fields.phone);
            formData.append('country', fields.country);
            formData.append('specialization', fields.specialization);
            formData.append('experience', fields.experience);
            formData.append('portfolio', fields.portfolio);
            formData.append('aboutMe', fields.aboutMe);
            formData.append('onlineComfortable', fields.onlineComfortable ? "Yes" : "No");

            await fetch(RESPONSE_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            setLoading(false);
            setSubmitted(true);
        } catch (err) {
            console.error("Submission error:", err);
            setLoading(false);
            alert("Submission failed due to network restriction.");
        }
    };

    if (submitted) {
        return (
            <div className="form-success animate-scaleIn">
                <div className="form-success-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Sparkles size={48} style={{ color: 'var(--gold)' }} />
                </div>
                <h4>Application Submitted Successfully!</h4>
                <p>
                    Thank you for applying to teach at Miimiko Minds. Our academic board will review
                    your portfolio/resume and contact you within 2–3 working days.
                </p>
                <Button variant="primary" onClick={() => { setSubmitted(false); setFields({ fullName: '', email: '', phone: '', country: '', specialization: '', experience: '', portfolio: '', aboutMe: '', onlineComfortable: false }); }}>
                    Submit Another Application
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="contact-form-body">
                <div className="form-row">
                    <FormField label="Full Name" required error={errors.fullName}>
                        <input className={`form-input${errors.fullName ? ' error' : ''}`} type="text" placeholder="e.g. Elena Rostova" value={fields.fullName} onChange={set('fullName')} autoComplete="name" />
                    </FormField>
                    <FormField label="Email Address" required error={errors.email}>
                        <input className={`form-input${errors.email ? ' error' : ''}`} type="email" placeholder="elena@example.com" value={fields.email} onChange={set('email')} autoComplete="email" />
                    </FormField>
                </div>

                <div className="form-row">
                    <FormField label="Phone / WhatsApp" required error={errors.phone}>
                        <input className={`form-input${errors.phone ? ' error' : ''}`} type="tel" placeholder="e.g. +1 555 0199" value={fields.phone} onChange={set('phone')} autoComplete="tel" />
                    </FormField>
                    <FormField label="Country of Residence" required error={errors.country}>
                        <input className={`form-input${errors.country ? ' error' : ''}`} type="text" placeholder="e.g. United Kingdom" value={fields.country} onChange={set('country')} />
                    </FormField>
                </div>

                <div className="form-row">
                    <FormField label="Primary Specialization" required error={errors.specialization}>
                        <div className="form-select-wrap">
                            <select className={`form-select${errors.specialization ? ' error' : ''}`} value={fields.specialization} onChange={set('specialization')}>
                                <option value="">Select medium…</option>
                                {SPECIALIZATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </FormField>
                    <FormField label="Teaching Experience" required error={errors.experience}>
                        <div className="form-select-wrap">
                            <select className={`form-select${errors.experience ? ' error' : ''}`} value={fields.experience} onChange={set('experience')}>
                                <option value="">Select duration…</option>
                                {EXPERIENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </FormField>
                </div>

                <FormField label="Portfolio or Resume Link (Google Drive, Behance, Website, etc.)" required error={errors.portfolio}>
                    <input className={`form-input${errors.portfolio ? ' error' : ''}`} type="url" placeholder="https://behance.net/yourname or resume link..." value={fields.portfolio} onChange={set('portfolio')} />
                </FormField>

                <FormField label="Tell us about your art background & teaching philosophy" required error={errors.aboutMe}>
                    <textarea className={`form-textarea${errors.aboutMe ? ' error' : ''}`} placeholder="Write a brief intro..." value={fields.aboutMe} onChange={set('aboutMe')} rows={4} />
                </FormField>

                <div className="form-field checkbox-field" style={{ margin: '1rem 0 1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={fields.onlineComfortable} onChange={set('onlineComfortable')} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--maroon)' }} />
                        <span>I have a laptop, webcam, and high-speed internet, and I am comfortable teaching online. *</span>
                    </label>
                    {errors.onlineComfortable && <span className="form-error-msg" style={{ display: 'block', marginTop: '0.25rem' }}>{errors.onlineComfortable}</span>}
                </div>

                <Button type="submit" variant="gold" size="lg" arrow style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                    {loading ? '✦ Submitting Application…' : 'Submit Application'}
                </Button>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--maroon)' }} /> We protect your data and contact details.
                </p>
            </div>
        </form>
    );
};

// VITE REQUIREMENT: EXPORT DEFAULT STRICTLY AT THE END
export default TeacherApplicationForm;