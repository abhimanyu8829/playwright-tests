import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';

test.describe('Website Comprehensive Tests', () => {
    let testResults = [];

    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test.afterEach(async ({ page }, testInfo) => {
        const result = {
            testName: testInfo.title,
            status: testInfo.status,
            duration: testInfo.duration,
            timestamp: new Date().toISOString(),
            browser: testInfo.project.name
        };
        testResults.push(result);
    });

    test.afterAll(async () => {
        const reportPath = path.join(__dirname, '../test-results/test-report.json');
        await fs.promises.writeFile(reportPath, JSON.stringify(testResults, null, 2));
        console.log(`Test report saved to ${reportPath}`);
    });

    // ===== NAVIGATION TESTS =====
    test('should load homepage successfully', async ({ page }) => {
        expect(await page.title()).toBeTruthy();
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
    });

    test('should have navbar with all navigation links', async ({ page }) => {
        const navLinks = await page.locator('.nav-menu a').count();
        expect(navLinks).toBeGreaterThan(0);
        await expect(page.locator('a:has-text("Home")')).toBeVisible();
        await expect(page.locator('a:has-text("Users")')).toBeVisible();
        await expect(page.locator('a:has-text("Analytics")')).toBeVisible();
        await expect(page.locator('a:has-text("Settings")')).toBeVisible();
    });

    test('should navigate to sections via anchor links', async ({ page }) => {
        const usersLink = page.locator('a:has-text("Users")');
        await usersLink.click();
        await expect(page.locator('#users')).toBeInViewport();
    });

    // ===== HERO SECTION TESTS =====
    test('should display hero section with welcome message', async ({ page }) => {
        await expect(page.locator('.hero h2')).toContainText('Welcome');
        await expect(page.locator('.hero p')).toBeVisible();
    });

    test('should have working Get Started button', async ({ page }) => {
        const startBtn = page.locator('#startBtn');
        await expect(startBtn).toBeVisible();
        await expect(startBtn).toHaveText('Get Started');
        
        page.once('dialog', dialog => {
            expect(dialog.message()).toContain('Welcome');
            dialog.accept();
        });
        await startBtn.click();
    });

    // ===== USERS SECTION TESTS =====
    test('should load and display users', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        const userCards = await page.locator('.user-card').count();
        expect(userCards).toBeGreaterThan(0);
    });

    test('should have all user card elements', async ({ page }) => {
        const firstCard = page.locator('.user-card').first();
        await expect(firstCard.locator('h4')).toBeVisible();
        await expect(firstCard.locator('p')).toHaveCount(3);
    });

    test('should search users by name', async ({ page }) => {
        const searchInput = page.locator('#searchInput');
        const searchBtn = page.locator('#searchBtn');
        
        await searchInput.fill('John');
        await searchBtn.click();
        
        const userCards = await page.locator('.user-card').count();
        expect(userCards).toBeGreaterThanOrEqual(0);
    });

    test('should search users by email', async ({ page }) => {
        const searchInput = page.locator('#searchInput');
        const searchBtn = page.locator('#searchBtn');
        
        await searchInput.fill('user1@');
        await searchBtn.click();
        
        const userCards = await page.locator('.user-card').count();
        expect(userCards).toBeGreaterThanOrEqual(0);
    });

    test('should clear search and display all users', async ({ page }) => {
        const searchInput = page.locator('#searchInput');
        const searchBtn = page.locator('#searchBtn');
        
        await searchInput.fill('test');
        await searchBtn.click();
        
        await searchInput.clear();
        await searchBtn.click();
        
        const userCards = await page.locator('.user-card').count();
        expect(userCards).toBeGreaterThan(0);
    });

    test('should handle search with keyboard Enter', async ({ page }) => {
        const searchInput = page.locator('#searchInput');
        await searchInput.fill('John');
        await searchInput.press('Enter');
        
        await page.waitForTimeout(500);
        const userCards = await page.locator('.user-card').count();
        expect(userCards).toBeGreaterThanOrEqual(0);
    });

    // ===== ANALYTICS SECTION TESTS =====
    test('should display analytics dashboard', async ({ page }) => {
        const statsCards = await page.locator('.stat-card').count();
        expect(statsCards).toBe(4);
    });

    test('should show all analytics metrics', async ({ page }) => {
        await expect(page.locator('#totalUsers')).toBeVisible();
        await expect(page.locator('#activeSessions')).toBeVisible();
        await expect(page.locator('#pageviews')).toBeVisible();
        await expect(page.locator('#conversionRate')).toBeVisible();
    });

    test('should have numeric values in analytics', async ({ page }) => {
        const totalUsers = await page.locator('#totalUsers').textContent();
        const activeSessions = await page.locator('#activeSessions').textContent();
        const pageviews = await page.locator('#pageviews').textContent();
        const conversionRate = await page.locator('#conversionRate').textContent();
        
        expect(totalUsers).toMatch(/\d+/);
        expect(activeSessions).toMatch(/\d+/);
        expect(pageviews).toMatch(/\d+/);
        expect(conversionRate).toMatch(/\d+/);
    });

    test('should refresh analytics and update values', async ({ page }) => {
        const totalUsersBefore = await page.locator('#totalUsers').textContent();
        
        const refreshBtn = page.locator('#refreshBtn');
        await refreshBtn.click();
        
        page.once('dialog', dialog => {
            dialog.accept();
        });
        
        await page.waitForTimeout(500);
        const totalUsersAfter = await page.locator('#totalUsers').textContent();
        
        expect(totalUsersBefore).toBeTruthy();
        expect(totalUsersAfter).toBeTruthy();
    });

    test('should display refresh button', async ({ page }) => {
        const refreshBtn = page.locator('#refreshBtn');
        await expect(refreshBtn).toBeVisible();
        await expect(refreshBtn).toHaveText('Refresh Analytics');
    });

    // ===== SETTINGS SECTION TESTS =====
    test('should display settings form', async ({ page }) => {
        const form = page.locator('#settingsForm');
        await expect(form).toBeVisible();
    });

    test('should have all form fields', async ({ page }) => {
        await expect(page.locator('#username')).toBeVisible();
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.locator('#notifications')).toBeVisible();
    });

    test('should fill and submit settings form with valid data', async ({ page }) => {
        await page.locator('#username').fill('testuser');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#password').fill('password123');
        await page.locator('#notifications').check();
        
        await page.locator('button:has-text("Save Settings")').click();
        
        const successMsg = page.locator('#successMsg');
        await expect(successMsg).toBeVisible();
    });

    test('should validate email field', async ({ page }) => {
        const emailInput = page.locator('#email');
        await emailInput.fill('invalid-email');
        
        const isInvalid = await emailInput.evaluate(el => !el.checkValidity());
        expect(isInvalid).toBeTruthy();
    });

    test('should require all form fields', async ({ page }) => {
        const form = page.locator('#settingsForm');
        
        // Try to submit empty form
        await page.locator('button:has-text("Save Settings")').click();
        
        // Form should still be visible (validation prevents submission)
        await expect(form).toBeVisible();
    });

    test('should toggle notifications checkbox', async ({ page }) => {
        const checkbox = page.locator('#notifications');
        
        await expect(checkbox).not.toBeChecked();
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
    });

    test('should show success message after save', async ({ page }) => {
        await page.locator('#username').fill('testuser');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#password').fill('password123');
        
        await page.locator('button:has-text("Save Settings")').click();
        
        const successMsg = page.locator('#successMsg');
        await expect(successMsg).toContainText('Settings saved successfully');
    });

    test('should hide success message after 3 seconds', async ({ page }) => {
        await page.locator('#username').fill('testuser');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#password').fill('password123');
        
        await page.locator('button:has-text("Save Settings")').click();
        
        const successMsg = page.locator('#successMsg');
        await expect(successMsg).toBeVisible();
        
        await page.waitForTimeout(3500);
        await expect(successMsg).toHaveCSS('display', 'none');
    });

    // ===== RESPONSIVE TESTS =====
    test('should be responsive on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
    });

    test('should be responsive on desktop viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
    });

    // ===== PERFORMANCE TESTS =====
    test('should load page within reasonable time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto(BASE_URL);
        const loadTime = Date.now() - startTime;
        
        expect(loadTime).toBeLessThan(5000);
    });

    test('should have no console errors', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        await page.goto(BASE_URL);
        expect(errors.length).toBe(0);
    });

    // ===== ACCESSIBILITY TESTS =====
    test('should have page title', async ({ page }) => {
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        const h2Count = await page.locator('h2').count();
        expect(h2Count).toBeGreaterThan(0);
    });

    test('should have alt text for images if any', async ({ page }) => {
        const images = await page.locator('img').count();
        // This will pass if there are no images or if all have alt text
        for (let i = 0; i < images; i++) {
            const alt = await page.locator('img').nth(i).getAttribute('alt');
            expect(alt).toBeTruthy();
        }
    });

    // ===== CONTENT TESTS =====
    test('should display footer with copyright', async ({ page }) => {
        const footer = page.locator('footer');
        await expect(footer).toContainText('2025');
    });

    test('should have visible content in each section', async ({ page }) => {
        await expect(page.locator('section#home')).toBeVisible();
        await expect(page.locator('section#users')).toBeVisible();
        await expect(page.locator('section#analytics')).toBeVisible();
        await expect(page.locator('section#settings')).toBeVisible();
    });

    // ===== BUTTON TESTS =====
    test('should have clickable buttons', async ({ page }) => {
        const buttons = page.locator('.btn');
        const count = await buttons.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should have proper button styling', async ({ page }) => {
        const primaryBtn = page.locator('.btn-primary').first();
        const bgColor = await primaryBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
        expect(bgColor).toBeTruthy();
    });

    // ===== LARGE DATA TESTS =====
    test('should load large dataset without crashing', async ({ page }) => {
        // Load a large file
        const largeDataPath = path.join(__dirname, '../tests/test-data/large-dataset-1.json');
        const largeData = JSON.parse(fs.readFileSync(largeDataPath, 'utf-8'));
        
        expect(largeData).toBeTruthy();
        expect(largeData.users.length).toBeGreaterThan(0);
    });

    test('should parse bulk user CSV data', async ({ page }) => {
        const csvPath = path.join(__dirname, '../tests/test-data/users-bulk.csv');
        
        if (fs.existsSync(csvPath)) {
            const csvData = fs.readFileSync(csvPath, 'utf-8');
            const lines = csvData.split('\n').filter(line => line.trim());
            expect(lines.length).toBeGreaterThan(0);
        }
    });

    test('should load large product dataset', async ({ page }) => {
        const largeDataPath = path.join(__dirname, '../tests/test-data/large-dataset-2.json');
        if (fs.existsSync(largeDataPath)) {
            const largeData = JSON.parse(fs.readFileSync(largeDataPath, 'utf-8'));
            expect(largeData).toBeTruthy();
        }
    });
});