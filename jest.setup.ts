// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            refresh: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            prefetch: jest.fn(),
        };
    },
    usePathname() {
        return "/";
    },
    useSearchParams() {
        return new URLSearchParams();
    },
}));

// Suppress console warnings in tests if needed
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        if (
            typeof args[0] === "string" &&
            (args[0].includes("Warning: ReactDOM.render") ||
                args[0].includes("Warning: An invalid form control"))
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});

