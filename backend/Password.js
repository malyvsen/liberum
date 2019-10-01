export default class Password {
  constructor(text, seed, length = 12) {
    if (text) {
      assert(seed == undefined);
      this.text = text;
    } else {
      this.text = "A" * length; // TODO: random generation
    }
  }
}
