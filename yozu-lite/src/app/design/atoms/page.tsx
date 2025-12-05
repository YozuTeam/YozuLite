import type { ReactNode } from "react";
import { Button } from "@/design/atoms/Button";
import { ThemeToggle } from "@/design/atoms/ThemeToggle";

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            {children}
        </section>
    );
}

export default function AtomsPreviewPage() {
    return (
        <main className="min-h-screen px-8 py-10 flex flex-col gap-8">
            {/* Header de la page de preview */}
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Design system – Atoms</h1>
                <ThemeToggle />
            </header>

            {/* Boutons */}
            <Section title="Buttons – intents">
                <div className="flex flex-wrap gap-4">
                    <Button intent="primary">Primary</Button>
                    <Button intent="secondary">Secondary</Button>
                    <Button intent="ghost">Ghost</Button>
                </div>
            </Section>

            <Section title="Buttons – sizes">
                <div className="flex flex-wrap gap-4 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                </div>
            </Section>

            <Section title="Buttons – states">
                <div className="flex flex-wrap gap-4 items-center">
                    <Button intent="primary">Default</Button>
                    <Button intent="primary" disabled>
                        Disabled
                    </Button>
                    <Button intent="primary" isLoading>
                        Loading
                    </Button>
                </div>
            </Section>
        </main>
    );
}
