class APP {
  constructor() {
    this.game = null;
  }

  init() {
    const rows = parseInt(prompt("Enter number of rows"), 10);
    const columns = parseInt(prompt("Enter number of columns"), 10);

    if (isNaN(rows) || isNaN(columns) || rows <= 0 || columns <= 0) {
      alert("Please enter valid number of rows and columns");
      return;
    }

    const game = new Game(rows, columns);
    game.init();
  }
}

/* Mario game class */
class Game {
  constructor(rows, columns, model) {
    this.currentPositionX = 0;
    this.currentPositionY = 0;
    this.direction = null;
    // this.counter = 5; // only for testing - to terminate nextTick
    this.intervalID = null;
    this.score = 0;
    this.rows = rows;
    this.columns = columns;
    this.model = HelperUtils.createGridArray(rows, columns);
    this.registerEvents();
  }

  init() {
    this.model = HelperUtils.generateFood(this.model, this.rows, this.columns);

    if (this.model[0][0] === "FOOD") {
      this.score++;
    }

    // Init mario at 0,0;
    this.model[0][0] = "MARIO";
    this.render();
  }

  registerEvents() {
    DomUtils.attachEvents(this);
  }

  setDirection(direction) {
    if (!this.direction) {
      this.intervalID = setInterval(this.nextTick.bind(this), 250);
    }
    this.direction = direction;
  }

  nextTick() {
    if (this.getScore() === this.rows) {
      clearInterval(this.intervalID);
      alert("GAME OVER!!!");
    }

    // this.counter--;

    this.updateModel(this.direction);
    DomUtils.updateScore(this.getScore());
  }

  setModel(x, y, data) {
    if (x < this.rows && y < this.columns && x >= 0 && y >= 0) {
      const currentValue = this.model[x][y];

      if (currentValue === "FOOD") {
        this.score++;
      }
      this.model[x][y] = data || "";
    }
  }

  updateModel(currentDirection) {
    const prevX = this.currentPositionX;
    const prevY = this.currentPositionY;

    this.updateIfCollision();

    this.setModel(this.currentPositionX, this.currentPositionY, "MARIO");
    this.setModel(prevX, prevY);
    this.render();
  }

  // Identify collision and reverse direction
  updateIfCollision() {
    switch (this.direction) {
      case "DOWN":
        if (this.currentPositionX >= this.rows - 1) {
          this.currentPositionX--;
          this.direction = "UP";
        } else {
          this.currentPositionX++;
        }
        break;
      case "UP":
        if (this.currentPositionX <= 0) {
          this.currentPositionX++;
          this.direction = "DOWN";
        } else {
          this.currentPositionX--;
        }
        break;
      case "LEFT":
        if (this.currentPositionY <= 0) {
          this.currentPositionY++;
          this.direction = "RIGHT";
        } else {
          this.currentPositionY--;
        }
        break;
      case "RIGHT":
        if (this.currentPositionY >= this.columns - 1) {
          this.currentPositionY--;
          this.direction = "LEFT";
        } else {
          this.currentPositionY++;
        }
        break;
    }
  }

  getScore() {
    return this.score;
  }

  getModel() {
    return this.model;
  }

  render() {
    DomUtils.updateGrid(this.rows, this.columns, this.model);
  }
}

/* Dom Utils */
class DomUtils {
  static attachEvents(context) {
    document.addEventListener("keyup", this.updateDirection.bind(context));
  }

  // Arrow key bindings
  static updateDirection(e) {
    if (e.keyCode == "38") {
      // up arrow
      this.setDirection("UP");
    } else if (e.keyCode == "40") {
      // down arrow
      this.setDirection("DOWN");
    } else if (e.keyCode == "37") {
      // left arrow
      this.setDirection("LEFT");
    } else if (e.keyCode == "39") {
      // right arrow
      this.setDirection("RIGHT");
    }
  }

  static updateScore(score) {
    const scoreEl = document.querySelector("#score");
    scoreEl.innerHTML = score || 0;
  }

  // Paint Grid - create Table -> TR -> TD.
  static updateGrid(rows, columns, model) {
    const gameEl = document.querySelector("#game");

    gameEl.innerText = "";

    const gridTable = document.createElement("TABLE");
    gridTable.setAttribute("id", "grid");

    for (let i = 0; i < rows; i++) {
      const gridRow = document.createElement("TR");

      for (let j = 0; j < columns; j++) {
        const gridCell = document.createElement("TD");
        const gridValue = model[i][j];

        gridCell.classList.add("cell");
        if (gridValue === "FOOD") {
          gridCell.innerText = " 🍄";
          gridCell.classList.add("food");
        } else if (gridValue === "MARIO") {
          gridCell.innerText = " 👻";
          gridCell.classList.add("mario");
        } else {
          const gridCellText = document.createTextNode(gridValue);
          gridCell.setAttribute("id", gridValue);
          gridCell.appendChild(gridCellText);
        }
        gridRow.appendChild(gridCell);
      }
      gridTable.appendChild(gridRow);
    }
    gameEl.appendChild(gridTable);
  }
}
class HelperUtils {
  // Create empty grid
  static createGridArray(rows, columns) {
    const gridArray = [];
    for (let i = 0; i < rows; i++) {
      let gridRow = [];
      for (var j = 0; j < columns; j++) {
        gridRow.push("");
      }
      gridArray.push(gridRow);
    }
    return gridArray;
  }
  // Generate randomly food in grid model
  static generateFood(model, rows, columns) {
    const FOOD_LIMIT = rows;
    let size = FOOD_LIMIT;
    for (let i = 0; i < size; i++) {
      const x = Math.floor(Math.random() * FOOD_LIMIT);
      const y = Math.floor(Math.random() * columns);
      const currentValue = model[x][y];
      if (currentValue === "FOOD" && x !== 0 && y !== 0) {
        console.log("already allocated in this x,y");
        size++;
      } else {
        model[x][y] = "FOOD";
      }
    }
    return model;
  }
}
window.onload = function() {
  const App = new APP();
  App.init();
};
