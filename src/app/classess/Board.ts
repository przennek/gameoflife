import {Field, State} from "./Field";

export class Board {
  public width: number;
  public heigth: number;

  public boardFields: Field[][];

  public constructor(w: number, h: number) {
    this.width = w;
    this.heigth = h;
    this.boardFields = [];
    for (var i: number = 0; i < w; i++) {
      this.boardFields[i] = [];
      for (var j: number = 0; j < h; j++) {
        this.boardFields[i][j] = new Field(i, j);
      }
    }
  }

  public blankFields() {
    for (var i: number = 0; i < this.width; i++) {
      for (var j: number = 0; j < this.heigth; j++) {
        this.boardFields[i][j].state = State.dead;
      }
    }
  }

  public getNeighboursList(field: Field): Array<Field> {
    let neighbours = [];
    let x = field.x;
    let y = field.y;
    for (var i = x - 1; i < x + 2; i++) {
      for (var j = y - 1; j < y + 2; j++) {
        // don't take the exact field itself as it's neighbour
        if(!(i === x && j === y)) {
          neighbours.push(
            this.boardFields[this.wrap(i, 0, this.width - 1)][this.wrap(j, 0, this.heigth - 1)]
          );
        }
      }
    }
    return neighbours;
  }

  private wrap(input: number, min: number, max: number) {
    let z = input;
    if(z === min - 1) {
      z = max;
    } else if(z === max + 1) {
      z = min;
    }
    return z;
  }
}
