import {Component, OnInit} from '@angular/core';
import {Board} from "./classess/Board";
import {State, Field} from "./classess/Field";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private REFRESH_RATE = 10;
  private board: Board;
  public gState: GameState;

  constructor() {
    this.gState = GameState.deactivated;
    this.board = new Board(100, 100);
    this.initialise(GameState.paused);
  }

  ngOnInit() {
    this.gameLoop(() => this.simulation());
  }

  private onClickSetState(field: Field) {
    field.nextState();
  }

  private initialise(nextState: GameState) {
    if (nextState === GameState.deactivated) {
      throw new Error("You can't initialise to deactivated state. Possible states: {running, paused}.");
    }
    this.board.blankFields();
    this.gState = nextState;
  }

  private run() {
    this.gState = GameState.running;
  }

  private pause() {
    this.gState = GameState.paused;
  }

  // The cell is revived when it has exactly 3 neighbours
  // The cell keeps living when it has 2 or 3 alive neighbours
  // In other cases - it dies
  private simulation(): void {
    this.forEachField((field) => {
      let fieldCount = this.howManyNeigboursAlive(field);
      if (field.state === State.dead && fieldCount === 3) {
        field.state = State.alive;
      }
      if (field.state === State.alive && (fieldCount < 2 || fieldCount > 3)) {
        field.state = State.dead;
      }
    });
    this.howManyAlive(this.board);
  }

  private forEachField(handler: any) {
    for (let column of this.board.boardFields) {
      for (let field of column) {
        handler(field);
      }
    }
  }

  private howManyAlive(board: Board): number {
    let count = 0;
    this.forEachField((field) => {
      count += field.state === State.alive ? 1 : 0;
    });
    console.log("Alive: " + count + ", dead: " + (10000 - count));
    return count;
  }

  private howManyNeigboursAlive(field: Field) {
    let count = 0;
    for (let neigbour of this.board.getNeighboursList(field)) {
      if (neigbour.state === State.alive) {
        count++;
      }
    }
    return count;
  }

  private gameLoop(simulation: any): void {
    setInterval(() => {
      if (this.gState === GameState.running) {
        simulation();
      } else if (this.gState === GameState.deactivated) {
        this.initialise(GameState.paused);
      }
    }, this.REFRESH_RATE);
  }
}

enum GameState {
  deactivated = 0, running, paused
}
