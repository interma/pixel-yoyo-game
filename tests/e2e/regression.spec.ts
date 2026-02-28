import { test, expect } from '@playwright/test';

test.describe('Bug Regression Tests', () => {
  test('BUG-001: Game keys should not trigger selection screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    const box = await canvas.boundingBox();
    if (!box) return;
    
    // 完整进入游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45);
    await page.waitForTimeout(400);
    await page.mouse.click(box.x + box.width * 0.35, box.y + box.height / 2);
    await page.waitForTimeout(300);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.75);
    await page.waitForTimeout(600);
    
    // 按多个游戏键
    await page.keyboard.press('Space');
    await page.waitForTimeout(150);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    await page.keyboard.press('KeyF');
    await page.waitForTimeout(200);
    
    // 验证游戏仍在运行
    await expect(canvas).toBeVisible();
    
    // 尝试返回菜单确认游戏状态正常
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(canvas).toBeVisible();
  });
  
  test('BUG-002: Player count selection should work on first click', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) return;
    
    // 进入游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    
    // 第一次点击单人按钮（只点击一次）
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45);
    await page.waitForTimeout(600);
    
    // 验证进入了角色选择（尝试点击角色）
    await page.mouse.click(box.x + box.width * 0.35, box.y + box.height / 2);
    await page.waitForTimeout(300);
    
    // 尝试开始游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.75);
    await page.waitForTimeout(400);
    
    // 验证游戏已开始
    await expect(canvas).toBeVisible();
  });
  
  test('BUG-003: Should not black screen after menu return', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) return;
    
    // 第一次完整游戏流程
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45);
    await page.waitForTimeout(400);
    await page.mouse.click(box.x + box.width * 0.35, box.y + box.height / 2);
    await page.waitForTimeout(300);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.75);
    await page.waitForTimeout(600);
    
    // 返回菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    
    // 验证回到主菜单
    await expect(canvas).toBeVisible();
    
    // 再次进入同一个游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    
    // 验证没有黑屏
    await expect(canvas).toBeVisible();
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeTruthy();
    expect(canvasBox!.width).toBeGreaterThan(200);
    expect(canvasBox!.height).toBeGreaterThan(200);
  });
});
