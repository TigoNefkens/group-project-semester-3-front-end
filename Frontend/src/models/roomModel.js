export default class roomModel {
  constructor(id, name, shelves = []) {
    this.id = id;
    this.name = name;
    this.shelves = shelves;
  }
}