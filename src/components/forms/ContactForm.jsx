import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const INQUIRY_TYPES = [
    'Book a Free Demo Class',
    'Course Enquiry — Drawing',
    'Course Enquiry — Calligraphy',
    'Course Enquiry — Phonics',
    'General Question',
    'Partnership / Collaboration',
    'Career / Teaching',
];

const AGE_OPTIONS = [
    '5 Years', '6 Years', '7 Years', '8 Years', '9 Years',
    '10 Years', '11 Years', '12 Years', '13 Years', '14 Years',
    'Not Applicable',
];

const validate = (fields) => {
    const errors = {};
    if (!fields.parentName.trim()) errors.parentName = 'Please enter your name.';
    if (!fields.email.trim()) errors.email = 'Please enter your email.';
    else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email = 'Please enter a valid email.';
    if (!fields.phone.trim()) errors.phone = 'Please enter your phone number.';
    if (!fields.childAge) errors.childAge = 'Please select an age.';
    if (!fields.inquiryType) errors.inquiryType = 'Please select an inquiry type.';
    if (!fields.message.trim()) errors.message = 'Please write a short message.';
    return errors;
};

const ContactForm = ({ prefillInquiry = '', compact = false }) => {
    const [searchParams] = useSearchParams();
    const [fields, setFields] = useState({
        parentName: '',
        childName: '',
        email: '',
        phone: '',
        country: '',
        childAge: '',
        inquiryType: prefillInquiry || '',
        message: '',
    });

    useEffect(() => {
        const queryCourse = searchParams.get('course');
        const queryAge = searchParams.get('age');

        let initialInquiry = prefillInquiry || '';
        let initialMessage = '';
        let initialAge = '';

        if (queryCourse) {
            const coursesList = queryCourse.split(',');
            if (coursesList.length === 1) {
                const singleCourse = coursesList[0].toLowerCase();
                if (singleCourse === 'drawing') initialInquiry = 'Course Enquiry — Drawing';
                else if (singleCourse === 'calligraphy') initialInquiry = 'Course Enquiry — Calligraphy';
                else if (singleCourse === 'phonics') initialInquiry = 'Course Enquiry — Phonics';
            } else {
                initialInquiry = 'Book a Free Demo Class';
                const prettyCourses = coursesList.map(c => {
                    const clean = c.trim().toLowerCase();
                    return clean.charAt(0).toUpperCase() + clean.slice(1);
                });
                initialMessage = `Hello, I would like to enquire about multiple courses: ${prettyCourses.join(', ')}.`;
            }
        }

        if (queryAge) {
            const matchingAge = AGE_OPTIONS.find(a => a.toLowerCase().includes(queryAge.toLowerCase()) || queryAge.toLowerCase().includes(a.toLowerCase()));
            if (matchingAge) {
                initialAge = matchingAge;
            } else {
                const match = queryAge.match(/(\d+)/);
                if (match) {
                    const parsedAgeNum = match[1];
                    const opt = AGE_OPTIONS.find(a => a.startsWith(parsedAgeNum));
                    if (opt) initialAge = opt;
                }
            }
        }

        setFields(prev => ({
            ...prev,
            inquiryType: initialInquiry || prev.inquiryType,
            childAge: initialAge || prev.childAge,
            message: initialMessage || prev.message,
        }));
    }, [searchParams, prefillInquiry]);

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => {
        setFields(prev => ({ ...prev, [key]: e.target.value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate(fields);
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);

        try {
            // FormData Object ke zariye data post karenge
            const formData = new FormData();
            formData.append('formType', 'demo');
            formData.append('parentName', fields.parentName);
            formData.append('childName', fields.childName);
            formData.append('email', fields.email);
            formData.append('phone', fields.phone);
            formData.append('childAge', fields.childAge);
            formData.append('country', fields.country);
            formData.append('inquiryType', fields.inquiryType);
            formData.append('message', fields.message);

            // POST Mode: no-cors se hit marenge, 100% block proof hai
            await fetch(RESPONSE_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            setLoading(false);
            setSubmitted(true);
        } catch (err) {
            console.error("Submission failed:", err);
            setLoading(false);
            alert("Network error, please check your connection.");
        }
    };

    if (submitted) {
        return (
            <div className="form-success animate-scaleIn">
                <div className="form-success-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Sparkles size={48} style={{ color: 'var(--gold)' }} />
                </div>
                <h4>We've received your message!</h4>
                <p>
                    Thank you for reaching out. Our team will contact you within 24 hours to
                    schedule your free demo or answer your questions.
                </p>
                <Button variant="primary" onClick={() => { setSubmitted(false); setFields({ parentName: '', childName: '', email: '', phone: '', country: '', childAge: '', inquiryType: prefillInquiry || '', message: '' }); }}>
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="contact-form-body">
                <div className="form-row">
                    <FormField label="Parent / Guardian Name" required error={errors.parentName}>
                        <input className={`form-input${errors.parentName ? ' error' : ''}`} type="text" placeholder="e.g. Priya Sharma" value={fields.parentName} onChange={set('parentName')} autoComplete="name" />
                    </FormField>
                    <FormField label="Child's Name" error={errors.childName}>
                        <input className="form-input" type="text" placeholder="e.g. Aanya" value={fields.childName} onChange={set('childName')} />
                    </FormField>
                </div>

                <div className="form-row">
                    <FormField label="Email Address" required error={errors.email}>
                        <input className={`form-input${errors.email ? ' error' : ''}`} type="email" placeholder="you@example.com" value={fields.email} onChange={set('email')} autoComplete="email" />
                    </FormField>
                    <FormField label="Phone / WhatsApp" required error={errors.phone}>
                        <input className={`form-input${errors.phone ? ' error' : ''}`} type="tel" placeholder="+91 98765 43210" value={fields.phone} onChange={set('phone')} autoComplete="tel" />
                    </FormField>
                </div>

                <div className="form-row">
                    <FormField label="Child's Age" required error={errors.childAge}>
                        <div className="form-select-wrap">
                            <select className={`form-select${errors.childAge ? ' error' : ''}`} value={fields.childAge} onChange={set('childAge')}>
                                <option value="">Select age…</option>
                                {AGE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </FormField>
                    <FormField label="Country" error={errors.country}>
                        <input className="form-input" type="text" placeholder="e.g. India, USA, UK…" value={fields.country} onChange={set('country')} />
                    </FormField>
                </div>

                <FormField label="What are you looking for?" required error={errors.inquiryType}>
                    <div className="form-select-wrap">
                        <select className={`form-select${errors.inquiryType ? ' error' : ''}`} value={fields.inquiryType} onChange={set('inquiryType')}>
                            <option value="">Select inquiry type…</option>
                            {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </FormField>

                <FormField label="Your Message" required error={errors.message}>
                    <textarea className={`form-textarea${errors.message ? ' error' : ''}`} placeholder="Tell us a bit about your child and what you're hoping to achieve through art…" value={fields.message} onChange={set('message')} rows={compact ? 4 : 5} />
                </FormField>

                <Button type="submit" variant="gold" size="lg" arrow style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                    {loading ? '✦ Sending…' : 'Send Message'}
                </Button>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--maroon)' }} /> Your information is safe with us. We never share your data.
                </p>
            </div>
        </form>
    );
};

// VITE REQUIREMENT: EXPORT DEFAULT STRICTLY AT THE END
export default ContactForm;