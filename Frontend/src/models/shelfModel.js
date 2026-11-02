export default class shelfModel {
  constructor(id, letter, colour, levels = []) {
    this.id = id;
    this.letter = letter;
    this.colour = colour;
    this.levels = levels;
  }
}