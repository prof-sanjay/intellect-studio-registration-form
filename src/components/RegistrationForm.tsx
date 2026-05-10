'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { internSchema, InternFormData, STEP_FIELDS } from '@/lib/validations';
import { cn, DEPARTMENTS, COURSES, COLLEGES, YEARS } from '@/lib/utils';

// ─── Combobox ───────────────────────────────────────────────────────────────

function Combobox({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 0
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleSelect = (opt: string) => {
    setQuery(opt);
    onChange(opt);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        className={cn('input-base', error && 'input-error')}
        value={query}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 right-0 bg-white border border-border shadow-lg max-h-48 overflow-y-auto"
          >
            {filtered.slice(0, 10).map((opt) => (
              <li
                key={opt}
                onMouseDown={() => handleSelect(opt)}
                className={cn(
                  'px-4 py-2.5 text-sm cursor-pointer hover:bg-bg transition-colors font-sans',
                  opt === value && 'bg-ink text-white hover:bg-ink'
                )}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

// ─── Select ─────────────────────────────────────────────────────────────────

function SelectField({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <select
        className={cn('input-base', error && 'input-error', 'cursor-pointer')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder || 'Select…'}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

// ─── File Upload ─────────────────────────────────────────────────────────────

function FileUpload({
  accept,
  type,
  label,
  hint,
  value,
  onUploaded,
  error,
}: {
  accept: string;
  type: 'photo' | 'resume';
  label: string;
  hint: string;
  value: string;
  onUploaded: (url: string) => void;
  error?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    // Start preview generation for photos (non-blocking)
    if (type === 'photo' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    setUploading(true);
    setUploadDone(false);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', type);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Upload failed');
        setUploading(false);
        return;
      }
      const { url } = await res.json();
      onUploaded(url);
      setUploadDone(true);
      toast.success(`${label} uploaded`);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [type, label, onUploaded]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed border-border p-8 text-center cursor-pointer transition-all duration-200',
          'hover:border-ink hover:bg-white group',
          error && 'border-error'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <LoadingDots />
            <p className="text-xs text-ink-3 font-sans">Uploading…</p>
          </div>
        ) : type === 'photo' && (preview || value) ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-ink">
              <img src={preview || value} alt="preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-ink-2 font-sans">Photo ready ✓ — click to change</p>
          </div>
        ) : type === 'resume' && (uploadDone || value) ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">📄</span>
            <p className="text-xs text-ink-2 font-sans">Resume uploaded ✓ — click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl opacity-30">{type === 'photo' ? '🧑' : '📄'}</span>
            <p className="text-sm font-sans text-ink-2">
              Drop {label.toLowerCase()} here or <span className="underline">browse</span>
            </p>
            <p className="text-[11px] text-ink-3 font-mono">{hint}</p>
          </div>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

// ─── Loading dots ─────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-ink rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ['Personal', 'Academic', 'Social', 'Documents', 'Review'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((name, i) => (
        <div key={name} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-7 h-7 flex items-center justify-center text-[11px] font-syne font-bold border transition-all duration-300',
                i < current
                  ? 'bg-ink text-white border-ink'
                  : i === current
                  ? 'bg-white text-ink border-ink shadow-[0_0_0_3px_rgba(12,12,10,0.08)]'
                  : 'bg-transparent text-ink-3 border-border'
              )}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span className={cn(
              'hidden md:block mt-1.5 text-[9px] font-syne font-semibold tracking-widest uppercase',
              i === current ? 'text-ink' : 'text-ink-3'
            )}>
              {name}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              'w-8 md:w-14 h-px mb-5 transition-all duration-300',
              i < current ? 'bg-ink' : 'bg-border'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Review Row ───────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-border last:border-0">
      <span className="label-upper sm:w-40 shrink-0">{label}</span>
      <span className="text-sm text-ink font-sans">{value}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir: number) => ({ x: dir < 0 ? 48 : -48, opacity: 0, transition: { duration: 0.25 } }),
};

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InternFormData>({
    resolver: zodResolver(internSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '', dob: '', email: '', phone: '', address: '',
      college: '', year: undefined, course: '', department: '',
      instagram: '', portfolioLink: '', photoUrl: '', resumeUrl: '',
    },
  });

  const watched = watch();

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    if (fields && fields.length > 0) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const onSubmit = async (data: InternFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || 'Registration failed.');
        return;
      }
      router.push(`/id-card/${result.id}`);
    } catch {
      toast.error('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldErr = (name: keyof InternFormData) => errors[name]?.message as string | undefined;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-10 flex justify-center">
        <StepIndicator current={step} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* ── STEP 0: Personal ──────────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-3 mb-6">
                    Step 1 of 5 — Personal Details
                  </p>
                  <h2 className="font-syne font-bold text-2xl text-ink">Who are you?</h2>
                  <p className="text-sm text-ink-2 mt-1 font-sans">Basic identity information.</p>
                </div>

                <div>
                  <label className="label-upper">Full Name *</label>
                  <input
                    {...register('fullName')}
                    className={cn('input-base', fieldErr('fullName') && 'input-error')}
                    placeholder="As on official documents"
                  />
                  {fieldErr('fullName') && <p className="error-text">{fieldErr('fullName')}</p>}
                </div>

                <div>
                  <label className="label-upper">Date of Birth *</label>
                  <input
                    {...register('dob')}
                    type="date"
                    className={cn('input-base', fieldErr('dob') && 'input-error')}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {fieldErr('dob') && <p className="error-text">{fieldErr('dob')}</p>}
                </div>

                <div>
                  <label className="label-upper">Email Address *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className={cn('input-base', fieldErr('email') && 'input-error')}
                    placeholder="your@email.com"
                  />
                  {fieldErr('email') && <p className="error-text">{fieldErr('email')}</p>}
                </div>

                <div>
                  <label className="label-upper">Phone Number *</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={cn('input-base', fieldErr('phone') && 'input-error')}
                    placeholder="+91 98765 43210"
                  />
                  {fieldErr('phone') && <p className="error-text">{fieldErr('phone')}</p>}
                </div>

                <div>
                  <label className="label-upper">Address *</label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className={cn('input-base resize-none', fieldErr('address') && 'input-error')}
                    placeholder="House/flat no., street, city, state, PIN"
                  />
                  {fieldErr('address') && <p className="error-text">{fieldErr('address')}</p>}
                </div>
              </div>
            )}

            {/* ── STEP 1: Academic ──────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-3 mb-6">
                    Step 2 of 5 — Academic Background
                  </p>
                  <h2 className="font-syne font-bold text-2xl text-ink">Your education</h2>
                  <p className="text-sm text-ink-2 mt-1 font-sans">Where are you studying?</p>
                </div>

                <div>
                  <label className="label-upper">College / University *</label>
                  <Combobox
                    options={COLLEGES}
                    value={watched.college}
                    onChange={(v) => setValue('college', v, { shouldValidate: true })}
                    placeholder="Search your college…"
                    error={fieldErr('college')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-upper">Year of Study *</label>
                    <SelectField
                      options={[...YEARS]}
                      value={watched.year || ''}
                      onChange={(v) => setValue('year', v as InternFormData['year'], { shouldValidate: true })}
                      placeholder="Select year"
                      error={fieldErr('year')}
                    />
                  </div>
                  <div>
                    <label className="label-upper">Course / Degree *</label>
                    <Combobox
                      options={COURSES}
                      value={watched.course}
                      onChange={(v) => setValue('course', v, { shouldValidate: true })}
                      placeholder="e.g. B.Tech CSE"
                      error={fieldErr('course')}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-upper">Preferred Department *</label>
                  <Combobox
                    options={DEPARTMENTS}
                    value={watched.department}
                    onChange={(v) => setValue('department', v, { shouldValidate: true })}
                    placeholder="Search department…"
                    error={fieldErr('department')}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 2: Social ──────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-3 mb-6">
                    Step 3 of 5 — Social &amp; Portfolio
                  </p>
                  <h2 className="font-syne font-bold text-2xl text-ink">Your online presence</h2>
                  <p className="text-sm text-ink-2 mt-1 font-sans">All fields here are optional.</p>
                </div>

                <div>
                  <label className="label-upper">Instagram Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 text-sm font-sans">@</span>
                    <input
                      {...register('instagram')}
                      className={cn('input-base pl-8', fieldErr('instagram') && 'input-error')}
                      placeholder="yourhandle"
                    />
                  </div>
                  {fieldErr('instagram') && <p className="error-text">{fieldErr('instagram')}</p>}
                </div>

                <div>
                  <label className="label-upper">Portfolio / LinkedIn / GitHub</label>
                  <input
                    {...register('portfolioLink')}
                    type="url"
                    className={cn('input-base', fieldErr('portfolioLink') && 'input-error')}
                    placeholder="https://yourportfolio.com or linkedin.com/in/you"
                  />
                  {fieldErr('portfolioLink') && <p className="error-text">{fieldErr('portfolioLink')}</p>}
                  <p className="text-[11px] text-ink-3 mt-1.5 font-sans">
                    Share your best work — a portfolio site, LinkedIn, or GitHub profile.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 3: Documents ──────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-3 mb-6">
                    Step 4 of 5 — Documents
                  </p>
                  <h2 className="font-syne font-bold text-2xl text-ink">Upload your files</h2>
                  <p className="text-sm text-ink-2 mt-1 font-sans">Photo required. Resume optional.</p>
                </div>

                <div>
                  <label className="label-upper">Profile Photo *</label>
                  <FileUpload
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    type="photo"
                    label="Photo"
                    hint="JPG / PNG / WEBP · Max 5 MB"
                    value={watched.photoUrl}
                    onUploaded={(url) => setValue('photoUrl', url, { shouldValidate: true })}
                    error={fieldErr('photoUrl')}
                  />
                  <p className="text-[11px] text-ink-3 mt-2 font-sans">
                    A clear, recent face photo. This will appear on your ID card.
                  </p>
                </div>

                <div>
                  <label className="label-upper">Resume / CV <span className="text-ink-3 font-sans normal-case tracking-normal text-xs">(optional)</span></label>
                  <FileUpload
                    accept="application/pdf"
                    type="resume"
                    label="Resume"
                    hint="PDF only · Max 10 MB"
                    value={watched.resumeUrl || ''}
                    onUploaded={(url) => setValue('resumeUrl', url, { shouldValidate: true })}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 4: Review ──────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-3 mb-6">
                    Step 5 of 5 — Review &amp; Submit
                  </p>
                  <h2 className="font-syne font-bold text-2xl text-ink">Almost there.</h2>
                  <p className="text-sm text-ink-2 mt-1 font-sans">
                    Review your details before submitting.
                  </p>
                </div>

                <div className="card p-6 space-y-1">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4">Personal</p>
                  <ReviewRow label="Full Name" value={watched.fullName} />
                  <ReviewRow label="Date of Birth" value={watched.dob} />
                  <ReviewRow label="Email" value={watched.email} />
                  <ReviewRow label="Phone" value={watched.phone} />
                  <ReviewRow label="Address" value={watched.address} />
                </div>

                <div className="card p-6 space-y-1">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4">Academic</p>
                  <ReviewRow label="College" value={watched.college} />
                  <ReviewRow label="Year" value={watched.year} />
                  <ReviewRow label="Course" value={watched.course} />
                  <ReviewRow label="Department" value={watched.department} />
                </div>

                <div className="card p-6 space-y-1">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-ink-3 mb-4">Social &amp; Documents</p>
                  <ReviewRow label="Instagram" value={watched.instagram ? `@${watched.instagram}` : undefined} />
                  <ReviewRow label="Portfolio" value={watched.portfolioLink} />
                  <ReviewRow label="Photo" value={watched.photoUrl ? 'Uploaded ✓' : undefined} />
                  <ReviewRow label="Resume" value={watched.resumeUrl ? 'Uploaded ✓' : 'Not provided'} />
                </div>

                <p className="text-[11px] text-ink-3 font-sans leading-relaxed">
                  By submitting, you confirm that all information provided is accurate.
                  Your temporary employee ID will be generated upon successful submission.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="btn-secondary text-xs disabled:opacity-0 disabled:pointer-events-none"
          >
            ← Back
          </button>

          {step < 4 ? (
            <button type="button" onClick={goNext} className="btn-primary group flex items-center gap-2">
              Continue
              <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="btn-primary min-w-[160px] flex items-center justify-center gap-3">
              {submitting ? <><LoadingDots /><span>Submitting…</span></> : 'Submit Application →'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
