export class OrderMutationEntryProcessor {
  factoryId: number;
  classId: number;
  d: number;

  constructor(d: number) {
    this.factoryId = 2;
    this.classId = 1;
    this.d = d;
  }

  readData(input: any) {
    this.d = input.readDouble();
  }

  writeData(output: any) {
    output.writeDouble(this.d);
  }
}
