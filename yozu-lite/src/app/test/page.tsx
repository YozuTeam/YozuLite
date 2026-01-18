"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/design-system/atoms/Button";
import { useColorTheme } from "@/theme/useColorTheme";
import { NAV_THEME } from "@/theme/constant";



const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

type ApiResponse = {
    accessToken?: string;
    [key: string]: unknown;
};

export default function TestPage() {
    const { colorScheme } = useColorTheme();
    const colors = NAV_THEME[colorScheme];
    const [result, setResult] = useState<ApiResponse | Error | null>(null);
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;
        const login = async () => {
            try {
                console.log("Attempting login...");
                const response = await axios.post("http://localhost:8080/users/login", {
                    emailOrPhone: "alan@doe.com",
                    password: "Secret123!",
                });
                console.log("Login success:", response.data);
                if (response.data.accessToken) {
                    localStorage.setItem("accessToken", response.data.accessToken);
                }
                setResult(response.data);
            } catch (error) {
                console.error("Login Error:", error);
                setResult(error as Error);
            }
        };

        const token = localStorage.getItem("accessToken");
        if (!token) {
            login();
        } else {
            const decoded = parseJwt(token);
            const isExpired = decoded?.exp ? decoded.exp * 1000 < Date.now() : true;
            
            if (isExpired) {
                console.log("Token expired, logging in again...");
                login();
            } else {
                console.log("Token already exists and is valid");
            }
        }
    }, []);

    const callAPI = async () => {
        try {
            const response = await axios.post("http://localhost:8080/users/register", {
                email: "test@test.com",
                password: "test",
                phoneNumber: "+33600000801",
                role: "STUDENT"
            });
            console.log("Register success:", response.data);
            if (response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
            }
            setResult(response.data);
        } catch (error) {
            console.error("Register Error:", error);
            setResult(error as Error);
        }
    };

    return (
        <div>
            <h1>Test Page</h1>
            <Button colors={{ textColor: "white", borderColor: colors.primary, backgroundColor: colors.primary }} onClick={callAPI}>Call API (Register)</Button>
            {result && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h3>Result:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}