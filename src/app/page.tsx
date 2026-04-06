"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  Download,
  Eye,
  Sparkles,
  Clock,
  CreditCard,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

async function fetchStats() {
  try {
    const [downloadsRes, visitsRes] = await Promise.all([
      fetch("https://api.countapi.xyz/get/invoice-generator-app/downloads"),
      fetch("https://api.countapi.xyz/hit/invoice-generator-app/visits"),
    ]);
    const downloads = await downloadsRes.json();
    const visits = await visitsRes.json();
    return {
      downloads: downloads.value || 0,
      visits: visits.value || 0,
    };
  } catch {
    return { downloads: 0, visits: 0 };
  }
}

export default function HomePage() {
  const [stats, setStats] = useState({ downloads: 0, visits: 0 });

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  const templates = [
    "Classic", "Modern", "Minimalist", "Corporate", "Creative",
    "Simple Clean", "Signature", "Total Highlight", "Blue Banner",
    "Watercolor", "Sidebar", "Blue Accent", "Two Column",
    "Lowercase Minimal", "Beach Wave", "Blue Header Bar", "Circular Modern"
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">InvoiceGen</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/create?type=quotation" className="hidden sm:block">
              <Button variant="ghost" className="text-muted-foreground">
                Create Quotation
              </Button>
            </Link>
            <Link href="/create?type=invoice">
              <Button className="bg-teal-600 hover:bg-teal-700">
                Create Invoice
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              {(stats.downloads > 0 || stats.visits > 0) && (
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-border bg-muted px-4 py-2 text-sm">
                  {stats.downloads > 0 && (
                    <span className="flex items-center gap-2 text-foreground">
                      <Download className="h-4 w-4 text-teal-600" />
                      <strong>{stats.downloads.toLocaleString()}</strong> downloads
                    </span>
                  )}
                  {stats.downloads > 0 && stats.visits > 0 && (
                    <span className="h-4 w-px bg-border" />
                  )}
                  {stats.visits > 0 && (
                    <span className="flex items-center gap-2 text-foreground">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <strong>{stats.visits.toLocaleString()}</strong> visits
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Professional invoices
                <span className="block text-teal-600">in seconds</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground lg:text-xl">
                Stop wasting time on manual invoicing. Create beautiful, professional
                invoices and quotations instantly — no signup, no fees, completely free.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  100% Free
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  No signup required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  Privacy-first
                </span>
              </div>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Link href="/create?type=invoice">
                  <Button size="lg" className="h-12 px-8 text-base bg-teal-600 hover:bg-teal-700">
                    Create Free Invoice
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/create?type=quotation">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Create Quotation
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-12 flex-1 lg:mt-0">
              <div className="relative mx-auto max-w-md">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="h-8 w-8 rounded bg-teal-600 mb-2" />
                      <div className="h-2 w-24 rounded bg-muted" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-teal-600 mb-1">INVOICE</div>
                      <div className="h-2 w-16 rounded bg-muted ml-auto" />
                    </div>
                  </div>

                  <div className="h-1 w-full bg-teal-600 rounded mb-4" />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-1">Bill To</div>
                      <div className="h-2 w-20 rounded bg-muted mb-1" />
                      <div className="h-2 w-16 rounded bg-muted/50" />
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-1">Date</div>
                      <div className="h-2 w-16 rounded bg-muted mb-1" />
                      <div className="h-2 w-12 rounded bg-muted/50" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <div className="h-2 w-32 rounded bg-muted" />
                      <div className="h-2 w-16 rounded bg-muted" />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <div className="h-2 w-28 rounded bg-muted" />
                      <div className="h-2 w-14 rounded bg-muted" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t-2 border-teal-600">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-teal-600">$1,250.00</span>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 rounded-full bg-teal-100 dark:bg-teal-900 p-3">
                  <Sparkles className="h-6 w-6 text-teal-600" />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-2 text-white dark:text-slate-900 text-sm font-medium shadow-lg">
                  PDF Ready ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for freelancers, small businesses, and anyone who values their time.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Instant Generation",
                description: "Create professional invoices in under 60 seconds. No learning curve, no complexity.",
                color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
              },
              {
                icon: Shield,
                title: "100% Private",
                description: "Your data never leaves your browser. We don't store anything — zero tracking, zero risk.",
                color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
              },
              {
                icon: Globe,
                title: "Multi-Currency",
                description: "Support for USD, EUR, GBP, and 10+ other currencies with proper formatting.",
                color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
              {
                icon: CreditCard,
                title: "Completely Free",
                description: "No hidden fees, no premium tiers, no surprise charges. Free forever.",
                color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
              },
              {
                icon: Clock,
                title: "Save Hours Weekly",
                description: "Stop wrestling with spreadsheets. Create, preview, and download in one flow.",
                color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
              },
              {
                icon: Users,
                title: "No Account Needed",
                description: "Jump straight in. No signup forms, no email verification, no passwords.",
                color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-900/30 px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-400 mb-4">
              <Sparkles className="h-4 w-4" />
              17 Professional Templates
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Find your perfect style
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From minimal to bold, we&apos;ve got a template that matches your brand.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {templates.map((template) => (
              <span
                key={template}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors cursor-default"
              >
                {template}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="text-sm text-muted-foreground">10 accent colors:</span>
            <div className="flex gap-2">
              {["#14b8a6", "#3b82f6", "#dc2626", "#64748b", "#a855f7", "#10b981", "#f97316", "#ec4899", "#6366f1", "#f59e0b"].map((color) => (
                <div
                  key={color}
                  className="h-6 w-6 rounded-full border-2 border-card shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/create">
              <Button size="lg" className="h-12 px-8 bg-teal-600 hover:bg-teal-700">
                Browse All Templates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Three steps to professional invoices
            </h2>
            <p className="mt-4 text-lg text-slate-400">It really is that simple.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Fill in the details",
                description: "Enter your business info, client details, and line items. Auto-calculations handle the math.",
              },
              {
                step: "02",
                title: "Pick your style",
                description: "Choose from 17 templates and 10 accent colors. Preview changes in real-time.",
              },
              {
                step: "03",
                title: "Download and send",
                description: "Export as high-quality PDF. Ready to send to your client immediately.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-slate-700 -translate-x-1/2" />
                )}
                <div className="text-5xl font-bold text-teal-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Ready to create your first invoice?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of freelancers and businesses who save time with InvoiceGen.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/create?type=invoice">
              <Button size="lg" className="h-14 px-10 text-lg bg-teal-600 hover:bg-teal-700">
                Create Free Invoice
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No signup • No credit card • Always free
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">InvoiceGen</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Free and Open Source • MIT License • Your data stays private
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
