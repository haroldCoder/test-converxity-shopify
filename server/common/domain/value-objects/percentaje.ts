export class Percentage {
  constructor(private readonly value: number) {
    if (value < 0 || value > 100) {
      throw new Error("Invalid percentage");
    }
  }

  getValue() {
    return this.value;
  }
}