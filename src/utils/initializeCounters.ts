import { Counter } from "../models/Counter";

export const initializeCounters = async (): Promise<void> => {
  const existingCounter = await Counter.findOne({ name: "recordNumber" });
  if (!existingCounter) {
    await Counter.create({ name: "recordNumber", value: 0 });
    console.log("Initialized recordNumber counter.");
  }
};
