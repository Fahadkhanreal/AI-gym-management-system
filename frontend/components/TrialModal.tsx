"use client";

import { useState, type FormEvent } from "react";
import { X, Dumbbell, CheckCircle, ArrowRight } from "lucide-react";
import { useGym } from "@/lib/gym-context";

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { title: "Personal Info", emoji: "📋" },
  { title: "Fitness Profile", emoji: "💪" },
  { title: "Schedule", emoji: "📅" },
];

const GOALS = ["Weight Loss", "Muscle Gain", "General Fitness", "Strength", "Flexibility", "Sports Training", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Athlete"];

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const { settings } = useGym();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    fitness_goal: "",
    experience_level: "",
    injuries: "",
    preferred_time: "",
    days_per_week: "",
    consented: false,
  });

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });

  const canProceed = () => {
    if (step === 0) return form.name && form.phone;
    if (step === 1) return form.fitness_goal && form.experience_level;
    if (step === 2) return form.preferred_time && form.days_per_week && form.consented;
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/trial-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age ? parseInt(form.age) : null,
          days_per_week: form.days_per_week ? parseInt(form.days_per_week) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setForm({ name: "", phone: "", email: "", age: "", gender: "", fitness_goal: "", experience_level: "", injuries: "", preferred_time: "", days_per_week: "", consented: false });
    setDone(false);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80 transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-lg max-h-[70dvh] overflow-y-auto rounded-2xl border border-white/10 bg-surface/95 shadow-2xl animate-fade-in-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-cyan/20 to-pink/20 flex items-center justify-center">
                <Dumbbell className="size-5 text-cyan" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {done ? "You're In! 🎉" : "Free Trial"}
                </h2>
                <p className="text-xs text-muted">
                  {done ? "Your 7-day trial starts soon" : "Start your 7-day free trial today"}
                </p>
              </div>
            </div>
            <button
              onClick={() => { onClose(); setTimeout(reset, 300); }}
              className="flex items-center justify-center size-8 rounded-xl bg-white/5 text-muted hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {done ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-500/10 mb-4">
                <CheckCircle className="size-8 text-green-400" />
              </div>
              <p className="text-sm text-muted max-w-sm mx-auto mb-2">
                Welcome to {settings.gym_name}! 🏋️
              </p>
              <p className="text-xs text-muted/70 max-w-sm mx-auto">
                Our team will contact you on <strong className="text-foreground">{form.phone}</strong> to confirm your first session. See you at the gym!
              </p>
              <button
                onClick={() => { onClose(); setTimeout(reset, 300); }}
                className="mt-6 rounded-xl bg-cyan text-black font-semibold px-6 py-2.5 text-sm hover:shadow-[0_0_20px_#00f5ff66] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="flex items-center gap-2 mb-6">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 flex-1">
                    <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      i === step
                        ? "bg-cyan/10 text-cyan border border-cyan/20"
                        : i < step
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-white/5 text-muted border border-white/10"
                    }`}>
                      <span>{i < step ? "✓" : s.emoji}</span>
                      <span className="hidden sm:inline">{s.title}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className="flex-1 h-px bg-white/10" />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Personal Info */}
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => update("name", e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">Phone *</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => update("phone", e.target.value)}
                          placeholder="03XX-XXXXXXX"
                          required
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => update("email", e.target.value)}
                          placeholder="your@email.com"
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">Age</label>
                        <input
                          type="number"
                          value={form.age}
                          onChange={e => update("age", e.target.value)}
                          placeholder="Your age"
                          min={10}
                          max={120}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">Gender</label>
                        <select
                          value={form.gender}
                          onChange={e => update("gender", e.target.value)}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
                          style={{ colorScheme: "dark" }}
                        >
                          <option value="" className="bg-surface">Prefer not to say</option>
                          <option value="male" className="bg-surface">Male</option>
                          <option value="female" className="bg-surface">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Fitness Profile */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-2">Fitness Goal *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {GOALS.map(g => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => update("fitness_goal", g)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-colors text-left ${
                              form.fitness_goal === g
                                ? "bg-cyan/10 border-cyan/40 text-cyan"
                                : "bg-white/5 border-white/10 text-muted hover:text-foreground hover:border-white/20"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-2">Experience Level *</label>
                      <div className="flex flex-wrap gap-2">
                        {LEVELS.map(l => (
                          <button
                            type="button"
                            key={l}
                            onClick={() => update("experience_level", l)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                              form.experience_level === l
                                ? "bg-cyan/10 border-cyan/40 text-cyan"
                                : "bg-white/5 border-white/10 text-muted hover:text-foreground hover:border-white/20"
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">Any Injuries or Health Concerns?</label>
                      <textarea
                        value={form.injuries}
                        onChange={e => update("injuries", e.target.value)}
                        placeholder="Optional — helps us prepare for your first session"
                        rows={2}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Schedule */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">Preferred Time *</label>
                      <select
                        value={form.preferred_time}
                        onChange={e => update("preferred_time", e.target.value)}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-colors"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" className="bg-surface">Select time</option>
                        <option value="morning" className="bg-surface">Morning (6AM-12PM)</option>
                        <option value="afternoon" className="bg-surface">Afternoon (12PM-5PM)</option>
                        <option value="evening" className="bg-surface">Evening (5PM-10PM)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-2">Days per Week *</label>
                      <div className="flex gap-2">
                        {[2, 3, 4, 5, 6].map(d => (
                          <button
                            type="button"
                            key={d}
                            onClick={() => update("days_per_week", d.toString())}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                              form.days_per_week === d.toString()
                                ? "bg-cyan/10 border-cyan/40 text-cyan"
                                : "bg-white/5 border-white/10 text-muted hover:text-foreground hover:border-white/20"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.consented}
                        onChange={e => update("consented", e.target.checked)}
                        className="mt-0.5 size-4 rounded border-white/20 text-cyan focus:ring-cyan/30"
                      />
                      <span className="text-xs text-muted">
                        I agree to the <a href="#" className="text-cyan hover:underline">Terms & Conditions</a> and <a href="#" className="text-cyan hover:underline">Privacy Policy</a>. I consent to being contacted regarding my trial.
                      </span>
                    </label>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">{error}</div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className={`text-sm text-muted hover:text-foreground transition-colors ${step === 0 ? "invisible" : ""}`}
                  >
                    ← Back
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      disabled={!canProceed()}
                      className="flex items-center gap-1.5 rounded-xl bg-cyan text-black font-semibold px-5 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_20px_#00f5ff66] transition-colors"
                    >
                      Next
                      <ArrowRight className="size-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting || !canProceed()}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-pink text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-50 hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transition-colors"
                    >
                      {submitting ? (
                        <span className="size-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      ) : (
                        <Dumbbell className="size-4" />
                      )}
                      {submitting ? "Submitting..." : "Start Free Trial"}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
