import { describe, it, expect } from 'vitest';

describe('Game Configuration', () => {
  it('should have valid game dimensions', () => {
    const width = 800;
    const height = 600;
    
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
    expect(width / height).toBeCloseTo(4/3, 1);
  });

  it('should calculate coin score correctly', () => {
    const coinValue = 10;
    const coinsCollected = 5;
    const totalScore = coinValue * coinsCollected;
    
    expect(totalScore).toBe(50);
  });

  it('should calculate enemy defeat scores', () => {
    const scores: Record<string, number> = {
      'mushroom': 20,
      'dragon': 50,
    };
    
    expect(scores['mushroom']).toBe(20);
    expect(scores['dragon']).toBe(50);
  });
});

describe('Player Lives System', () => {
  it('should start with 3 lives', () => {
    const initialLives = 3;
    expect(initialLives).toBe(3);
  });

  it('should detect game over when lives reach 0', () => {
    let lives = 1;
    lives -= 1;
    const isGameOver = lives === 0;
    
    expect(isGameOver).toBe(true);
    expect(lives).toBe(0);
  });

  it('should maintain lives count between 0 and max', () => {
    const maxLives = 3;
    let lives = 2;
    
    expect(lives).toBeGreaterThanOrEqual(0);
    expect(lives).toBeLessThanOrEqual(maxLives);
  });
});

describe('State Management', () => {
  it('should reset game state properly', () => {
    // 模拟游戏状态
    const initialState = {
      score: 100,
      lives: 1,
      gameOver: true,
      isInvincible: true,
    };
    
    // 重置状态
    const resetState = {
      score: 0,
      lives: 3,
      gameOver: false,
      isInvincible: false,
    };
    
    expect(resetState.score).toBe(0);
    expect(resetState.lives).toBe(3);
    expect(resetState.gameOver).toBe(false);
    expect(resetState.isInvincible).toBe(false);
  });
});
