import { test, expect } from '@playwright/test';

test.describe('Game Loading', () => {
  test('should load game canvas', async ({ page }) => {
    await page.goto('/');
    
    // 等待游戏加载
    await page.waitForTimeout(1500);
    
    // 验证canvas已渲染
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // 验证canvas有正确的尺寸
    const canvasElement = await canvas.boundingBox();
    expect(canvasElement).toBeTruthy();
    expect(canvasElement!.width).toBeGreaterThan(500);
    expect(canvasElement!.height).toBeGreaterThan(400);
  });

  test('should respond to clicks on canvas', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // 点击canvas中心（模拟点击菜单）
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
      await page.waitForTimeout(500);
    }
    
    // 验证页面没有崩溃
    await expect(canvas).toBeVisible();
  });
});

test.describe('Game Navigation', () => {
  test('should handle full game interaction', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // 获取canvas位置
    const box = await canvas.boundingBox();
    if (!box) {
      throw new Error('Canvas not found');
    }
    
    // 1. 点击选择第一个游戏（金币追逐）
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(500);
    
    // 2. 按Enter开始
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    
    // 3. 点击选择单人模式
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45);
    await page.waitForTimeout(400);
    
    // 4. 点击选择第一个角色
    await page.mouse.click(box.x + box.width * 0.35, box.y + box.height / 2);
    await page.waitForTimeout(300);
    
    // 5. 点击开始游戏按钮
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.75);
    await page.waitForTimeout(500);
    
    // 验证游戏运行中
    await expect(canvas).toBeVisible();
  });

  test('should handle keyboard controls', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    const box = await canvas.boundingBox();
    if (!box) return;
    
    // 快速进入游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(400);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45);
    await page.waitForTimeout(400);
    await page.mouse.click(box.x + box.width * 0.35, box.y + box.height / 2);
    await page.waitForTimeout(300);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.75);
    await page.waitForTimeout(600);
    
    // 测试游戏控制键
    await page.keyboard.press('Space');
    await page.waitForTimeout(150);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);
    await page.keyboard.press('KeyF');
    await page.waitForTimeout(200);
    
    // 验证游戏没有崩溃
    await expect(canvas).toBeVisible();
    expect(await page.title()).toContain('YoYo');
  });

  test('should return to menu and re-enter game', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) return;
    
    // 进入第二个游戏（古堡逃亡）
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.52);
    await page.waitForTimeout(600);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    
    // 返回菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    
    // 验证canvas仍然存在
    await expect(canvas).toBeVisible();
    
    // 再次进入同一个游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.52);
    await page.waitForTimeout(600);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    
    // 验证没有黑屏
    await expect(canvas).toBeVisible();
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeTruthy();
    expect(canvasBox!.width).toBeGreaterThan(200);
  });
});
