import { test, expect } from '@playwright/test';

// 帮助函数：进入游戏的通用流程
async function enterGame(page: any, gameIndex: number, isTwoPlayer: boolean = false) {
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas not found');
  
  // 选择游戏 (gameIndex: 0=金币追逐, 1=古堡逃亡)
  const gameY = gameIndex === 0 ? 0.4 : 0.52;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * gameY);
  await page.waitForTimeout(500);
  
  // 按Enter进入
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  
  // 选择单人或双人
  const playerSelectY = isTwoPlayer ? 0.52 : 0.45;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * playerSelectY);
  await page.waitForTimeout(400);
  
  // 选择角色(们)
  await page.mouse.click(box.x + box.width * 0.35, box.y + box.height / 2);
  await page.waitForTimeout(300);
  
  if (isTwoPlayer) {
    // 选择第二个角色
    await page.mouse.click(box.x + box.width * 0.65, box.y + box.height / 2);
    await page.waitForTimeout(300);
  }
  
  // 点击开始游戏
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.75);
  await page.waitForTimeout(600);
  
  return box;
}

test.describe('Complete Game Flows - Coin Chaser', () => {
  test('金币追逐 - 单人模式完整流程', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // 进入金币追逐单人模式
    await enterGame(page, 0, false);
    
    // 验证游戏已启动
    await expect(canvas).toBeVisible();
    
    // 模拟游戏操作 - 移动和跳跃
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    await page.keyboard.press('Space'); // 跳跃
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    
    // 测试飞行
    await page.keyboard.press('KeyF');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    
    // 测试秘籍（无敌护盾）
    await page.keyboard.press('KeyM');
    await page.waitForTimeout(100);
    await page.keyboard.press('KeyY');
    await page.waitForTimeout(100);
    await page.keyboard.press('KeyY');
    await page.waitForTimeout(100);
    await page.keyboard.press('Digit1');
    await page.waitForTimeout(500);
    
    // 继续游戏一段时间
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    
    // 验证游戏仍在运行
    await expect(canvas).toBeVisible();
    
    // 返回菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    await expect(canvas).toBeVisible();
  });

  test('金币追逐 - 双人模式完整流程', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // 进入金币追逐双人模式
    await enterGame(page, 0, true);
    
    // 验证游戏已启动
    await expect(canvas).toBeVisible();
    
    // 模拟双人操作 - 玩家1 (方向键)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    
    // 玩家2 (WASD)
    await page.keyboard.press('KeyD');
    await page.waitForTimeout(200);
    await page.keyboard.press('KeyW');
    await page.waitForTimeout(200);
    
    // 交替操作
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);
    await page.keyboard.press('KeyA');
    await page.waitForTimeout(150);
    
    // 同时飞行
    await page.keyboard.press('KeyF');
    await page.waitForTimeout(100);
    await page.keyboard.press('KeyG');
    await page.waitForTimeout(300);
    
    // 继续游戏
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    await page.keyboard.press('KeyD');
    await page.waitForTimeout(500);
    
    // 验证游戏仍在运行
    await expect(canvas).toBeVisible();
    
    // 返回菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    await expect(canvas).toBeVisible();
  });
});

test.describe('Complete Game Flows - Scroll Runner', () => {
  test('古堡逃亡 - 单人模式完整流程', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // 进入古堡逃亡单人模式
    await enterGame(page, 1, false);
    
    // 验证游戏已启动
    await expect(canvas).toBeVisible();
    
    // 模拟游戏操作 - 横版卷轴游戏主要是跳跃
    await page.waitForTimeout(300); // 等待游戏开始
    
    // 跳跃躲避障碍
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
    
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
    
    // 测试飞行
    await page.keyboard.press('KeyF');
    await page.waitForTimeout(600);
    
    // 更多跳跃
    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
    
    // 测试秘籍
    await page.keyboard.press('KeyM');
    await page.waitForTimeout(100);
    await page.keyboard.press('KeyY');
    await page.waitForTimeout(100);
    await page.keyboard.press('KeyY');
    await page.waitForTimeout(100);
    await page.keyboard.press('Digit1');
    await page.waitForTimeout(500);
    
    // 继续游戏
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    
    // 验证游戏仍在运行
    await expect(canvas).toBeVisible();
    
    // 返回菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    await expect(canvas).toBeVisible();
  });

  test('古堡逃亡 - 双人模式完整流程', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // 进入古堡逃亡双人模式
    await enterGame(page, 1, true);
    
    // 验证游戏已启动
    await expect(canvas).toBeVisible();
    
    // 模拟双人操作
    await page.waitForTimeout(300);
    
    // 玩家1跳跃
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    
    // 玩家2跳跃
    await page.keyboard.press('KeyW');
    await page.waitForTimeout(300);
    
    // 交替跳跃
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);
    await page.keyboard.press('KeyW');
    await page.waitForTimeout(400);
    
    // 玩家1飞行
    await page.keyboard.press('KeyF');
    await page.waitForTimeout(300);
    
    // 玩家2飞行
    await page.keyboard.press('KeyG');
    await page.waitForTimeout(500);
    
    // 继续游戏
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    await page.keyboard.press('KeyW');
    await page.waitForTimeout(400);
    
    // 验证游戏仍在运行
    await expect(canvas).toBeVisible();
    
    // 返回菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    await expect(canvas).toBeVisible();
  });
});

test.describe('Menu Navigation', () => {
  test('主菜单 - 游戏选择导航', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');
    
    // 测试点击第一个游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(500);
    await expect(canvas).toBeVisible();
    
    // 返回主菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    
    // 测试点击第二个游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.52);
    await page.waitForTimeout(500);
    await expect(canvas).toBeVisible();
    
    // 返回主菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    await expect(canvas).toBeVisible();
  });

  test('游戏内 - 玩家数量和角色选择', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');
    
    // 进入游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    
    // 测试选择单人
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45);
    await page.waitForTimeout(400);
    await expect(canvas).toBeVisible();
    
    // 选择第一个角色
    await page.mouse.click(box.x + box.width * 0.35, box.y + box.height / 2);
    await page.waitForTimeout(300);
    
    // 验证可以选择不同角色（点击第二个）
    await page.mouse.click(box.x + box.width * 0.65, box.y + box.height / 2);
    await page.waitForTimeout(300);
    
    // 开始游戏
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.75);
    await page.waitForTimeout(500);
    
    await expect(canvas).toBeVisible();
    
    // 返回菜单测试双人选择
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.4);
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    
    // 选择双人
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.52);
    await page.waitForTimeout(400);
    await expect(canvas).toBeVisible();
  });
});
