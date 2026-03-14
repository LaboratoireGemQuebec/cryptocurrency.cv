import React, { useState } from 'react';
import { PRESS_RELEASE_CATEGORIES } from '../../lib/press-release';

export default function SubmitPressReleasePage() {
  const [form, setForm] = useState({
    projectName: '',
    projectUrl: '',
    contactEmail: '',
    contactName: '',
    title: '',
    category: PRESS_RELEASE_CATEGORIES[0],
    body: '',
    imageUrl: '',
    tier: 'free',
    agree: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    // Basic validation
    const wordCount = form.body.split(/\s+/).length;
    const errs = [];
    if (!form.projectName) errs.push('Project name required.');
    if (!/^https?:\/\/.+/.test(form.projectUrl)) errs.push('Valid project website required.');
    if (!/^\S+@\S+\.\S+$/.test(form.contactEmail)) errs.push('Valid contact email required.');
    if (!form.contactName) errs.push('Contact name required.');
    if (!form.title) errs.push('Press release title required.');
    if (!form.body || wordCount < 200 || wordCount > 3000)
      errs.push('Press release body must be 200-3000 words.');
    if (!form.agree) errs.push('You must agree to the terms.');
    if (!form.confirm) errs.push('You must confirm this is not spam.');
    if (errs.length) {
      setErrors(errs);
      return;
    }
    // Submit to API
    const res = await fetch('/api/press-release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form }),
    });
    if (res.ok) setSubmitted(true);
    else setErrors(['Submission failed. Please try again.']);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-4 text-2xl font-bold">Press Release Submitted</h1>
        <p>
          Your press release has been submitted for review. You will receive a confirmation email
          soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-bold">📰 Submit a Press Release</h1>
      <p className="mb-4">
        Get your announcement in front of thousands of crypto enthusiasts, developers, and
        investors.
      </p>
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">How It Works</h2>
        <ol className="ml-6 list-decimal">
          <li>Submit your press release using the form below</li>
          <li>Our team reviews for quality and relevance</li>
          <li>Approved releases are published within 24h</li>
          <li>Your release appears in our feed, API, and RSS</li>
        </ol>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Guidelines</h2>
        <ul className="ml-6 list-disc">
          <li>✓ Must be related to cryptocurrency or blockchain</li>
          <li>✓ Written in English (other languages accepted)</li>
          <li>✓ No misleading claims or guaranteed returns</li>
          <li>✓ Include project name, website, and contact info</li>
          <li>✗ No duplicate submissions</li>
          <li>✗ No malicious or scam projects</li>
        </ul>
      </section>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="projectName"
          value={form.projectName}
          onChange={handleChange}
          placeholder="Project Name"
          className="w-full border p-2"
        />
        <input
          name="projectUrl"
          value={form.projectUrl}
          onChange={handleChange}
          placeholder="Project Website"
          className="w-full border p-2"
        />
        <input
          name="contactEmail"
          value={form.contactEmail}
          onChange={handleChange}
          placeholder="Contact Email"
          className="w-full border p-2"
        />
        <input
          name="contactName"
          value={form.contactName}
          onChange={handleChange}
          placeholder="Contact Name"
          className="w-full border p-2"
        />
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Press Release Title"
          className="w-full border p-2"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2"
        >
          {PRESS_RELEASE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Press Release Body (200-3000 words)"
          rows={8}
          className="w-full border p-2"
        />
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Featured Image URL (optional)"
          className="w-full border p-2"
        />
        <div>
          <label className="mr-4">
            <input
              type="radio"
              name="tier"
              value="free"
              checked={form.tier === 'free'}
              onChange={handleChange}
            />{' '}
            Free
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="tier"
              value="priority"
              checked={form.tier === 'priority'}
              onChange={handleChange}
            />{' '}
            $99 Priority
          </label>
          <label>
            <input
              type="radio"
              name="tier"
              value="featured"
              checked={form.tier === 'featured'}
              onChange={handleChange}
            />{' '}
            $299 Featured
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} /> I
            agree to the terms and guidelines above
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="confirm" checked={form.confirm} onChange={handleChange} />{' '}
            I confirm this is not spam or misleading content
          </label>
        </div>
        {errors.length > 0 && (
          <div className="rounded bg-red-100 p-2 text-red-700">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
          Submit Press Release
        </button>
      </form>
      <section className="mt-8">
        <h2 className="mb-2 font-semibold">Pricing</h2>
        <ul className="ml-6 list-disc">
          <li>Free: Standard listing (published within 48h)</li>
          <li>$99: Priority review (published within 4h)</li>
          <li>$299: Featured placement (pinned for 24h + social)</li>
        </ul>
        <p className="mt-2">Contact us for enterprise packages.</p>
      </section>
    </div>
  );
}
