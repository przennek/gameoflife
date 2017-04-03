import {Component, OnInit} from '@angular/core';
import {Board} from "./classess/Board";
import {State, Field} from "./classess/Field";

declare var Plotly: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private REFRESH_RATE = 100;
  private board: Board;

  private probability: number;

  public gState: GameState;

  private x: Array<number>;
  private y: Array<number>;
  private simSec: number;

  constructor() {
    this.probability = 0;
    this.gState = GameState.deactivated;
    this.board = new Board(100, 100);
    this.initialise(GameState.paused);
  }

  ngOnInit() {
    this.x = [];
    this.y = [];
    this.simSec = 0;

    this.initLifeChart();
    this.gameLoop(() => this.step());
  }

  private onClickSetState(field: Field) {
    field.nextState();
  }

  private initialise(nextState: GameState) {
    if (nextState === GameState.deactivated) {
      throw new Error("You can't initialise to deactivated state. Possible states: {running, paused}.");
    }
    this.x = [];
    this.y = [];
    this.simSec = 0;

    this.fillBasedOnProbability();
    this.gState = nextState;
  }

  private run() {
    this.gState = GameState.running;
  }

  private pause() {
    this.gState = GameState.paused;
  }

  private oneStep() {
    this.gState = GameState.step;
  }

  private fillBasedOnProbability() {
    this.board.blankFields();
    this.forEachField((field) => {
      if(this.random0_100() < this.probability) {
        field.state = State.alive;
      }
    })
  }

  private random0_100() {
    return (Math.floor(Math.random() * 100));
  }

  // The cell is revived when it has exactly 3 neighbours
  // The cell keeps living when it has 2 or 3 alive neighbours
  // In other cases - it dies
  private step(): void {
    this.forEachField((field) => {
      let fieldCount = this.howManyNeigboursAlive(field);
      if (field.state === State.dead && fieldCount === 3) {
        field.state = State.alive;
      }
      if (field.state === State.alive && (fieldCount < 2 || fieldCount > 3)) {
        field.state = State.dead;
      }
    });
    this.updateHowManyAlive(this.board);
  }

  private forEachField(handler: any) {
    for (let column of this.board.boardFields) {
      for (let field of column) {
        handler(field);
      }
    }
  }

  private updateHowManyAlive(board: Board){
    let count = 0;
    this.forEachField((field) => {
      count += field.state === State.alive ? 1 : 0;
    });
    this.x.push(this.simSec++ / 10);
    this.y.push(count / 100);
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

  private gameLoop(step: any): void {
    setInterval(() => {
      if (this.gState === GameState.running) {
        step();
      } else if (this.gState === GameState.deactivated) {
        this.initialise(GameState.paused);
      } else if(this.gState === GameState.step) {
        step();
        this.gState = GameState.paused;
      }
    }, this.REFRESH_RATE);
  }

  private initLifeChart() {
    setInterval(() => {
      let layout = {
        title: 'Wykres życia od czasu.',
        xaxis: {
          title: 'Czas [s]',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: 'Ilość żyć [%]',
          autorange: false,
          range: [0, 100],
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      };

      let data = [
        {
          x: this.x,
          y: this.y,
          type: 'scatter'
        }
      ];

      Plotly.newPlot('myDiv', data, layout);
    }, this.REFRESH_RATE * 10);
  }
}

enum GameState {
  deactivated = 0, running, paused, step
}
