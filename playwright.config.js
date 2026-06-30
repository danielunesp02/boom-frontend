var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
import { defineConfig, devices } from "@playwright/test";
var frontendBaseUrl = (_a = process.env.PLAYWRIGHT_BASE_URL) !== null && _a !== void 0 ? _a : "http://localhost:5173";
export default defineConfig({
    testDir: "./e2e",
    timeout: 45000,
    expect: {
        timeout: 10000,
    },
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: [["html"], ["list"]],
    use: {
        baseURL: frontendBaseUrl,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    webServer: {
        command: "npm run dev -- --host 127.0.0.1",
        url: frontendBaseUrl,
        reuseExistingServer: true,
        timeout: 120000,
    },
    projects: [
        {
            name: "chromium",
            use: __assign({}, devices["Desktop Chrome"]),
        },
    ],
});
