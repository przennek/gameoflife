import { GameOfLifePage } from './app.po';

describe('game-of-life App', function() {
  let page: GameOfLifePage;

  beforeEach(() => {
    page = new GameOfLifePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
