export class Field {
  public x: number;
  public y: number;
  public state: State;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.state = State.dead;
  }

  public nextState() {
    this.state = Field.getNextState(this.state);
  }

  private static getNextState(s: number): State {
    return s === 0 ? 1 : 0;
  }
}

export enum State {
  dead = 0,
  alive = 1
}
