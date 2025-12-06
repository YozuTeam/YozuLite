import { Container, Stack, Box, Typography, Divider } from "@mui/material";
import { Button } from "@/design-system/atoms/Button";
import { ThemeToggle } from "@/design-system/atoms/ThemeToggle";
import type { ReactNode } from "react";


function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight="600">
                {title}
            </Typography>
            {children}
            <Divider />
        </Stack>
    );
}

export default function AtomsPreviewPage() {
    return (
        <Container maxWidth="md">
            <Stack spacing={6} sx={{ py: 6 }}>
                {/* Header de la page */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="h4" fontWeight="700">
                        Design system – Atoms
                    </Typography>
                    <ThemeToggle />
                </Box>

                {/* Buttons – intents */}
                <Section title="Buttons – intents">
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Button intent="primary">Primary</Button>
                        <Button intent="secondary">Secondary</Button>
                        <Button intent="ghost">Ghost</Button>
                    </Stack>
                </Section>

                {/* Buttons – sizes */}
                <Section title="Buttons – sizes">
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </Stack>
                </Section>

                {/* Buttons – states */}
                <Section title="Buttons – states">
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Button>Default</Button>
                        <Button disabled>Disabled</Button>
                        <Button isLoading>Loading</Button>
                    </Stack>
                </Section>
            </Stack>
        </Container>
    );
}
