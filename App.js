import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Constants } from './Constants';
import Cell from './components/Cell';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.boardWidth = Constants.BOARD_SIZE * Constants.CELL_SIZE;
    this.grid = new Array(Constants.BOARD_SIZE).fill(null).map(() => new Array(Constants.BOARD_SIZE).fill(null));
  }

  renderBoard = () => {
    let arrRow = new Array(Constants.BOARD_SIZE);
    for (let rowIdx = 0; rowIdx < Constants.BOARD_SIZE; rowIdx++) {
      arrRow.push(<View key={rowIdx} style={{ width: this.BOARD_SIZE, height: Constants.CELL_SIZE, flexDirection: 'row' }}>
        {this.pushCol(Constants.BOARD_SIZE, rowIdx)}
      </View>)
    }
    return arrRow;
  }

  pushCol = (size, rowIdx) => {
    let arrCol = new Array(size);
    for (let colIdx = 0; colIdx < size; colIdx++) {
      arrCol.push(<Cell key={uuidv4()}
        onReveal={this.onReveal}
        onDie={this.onDie}
        width={Constants.CELL_SIZE}
        height={Constants.CELL_SIZE}
        x={colIdx} y={rowIdx}
        ref={(ref) => { this.grid[colIdx][rowIdx] = ref }}
      />)
    }
    return arrCol;
  }

  revealNeighbors = (x, y) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (x + i >= 0 && x + 1 <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          this.grid[x + i][y + j].onReveal(false);
        }
      }
    }
  }

  onReveal = (x, y) => {
    let neighbor = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {

        if (x + i >= 0 && x + 1 <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          if (this.grid[x + i][y + j].state.isMine) {
            neighbor++;
          }
        }
      }
    }
    if (neighbor > 0) {
      this.grid[x][y].setState({ neighbors: neighbor })
    } else {
      this.revealNeighbors(x, y);
    }
  }

  onDie = () => {
    Alert.alert('Oops!! Game End!');
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].onReveal();
        this.grid[i][j].revealWithoutCallback();
      }
    }
  }

  onGettingBomb = (x, y) => {

  }

  resetGame = () => {
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].reset();
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ width: this.boardWidth, height: this.boardWidth, backgroundColor: '#888888', flexDirection: 'column' }}>
          {this.renderBoard()}
        </View>
        <Button title="New Game" onPress={this.resetGame}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
