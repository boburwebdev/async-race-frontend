import { carMake, carModel } from '../data/testData';

export function generateRandomCarMake(): string {
  return carMake[Math.floor(Math.random() * carMake.length)];
}

export function generateRandomCarName(): string {
  const make: string = generateRandomCarMake();
  let model: string = '';
  if (carModel[make].length) {
    model = carModel[make][Math.floor(Math.random() * carModel[make].length)];
  }
  return `${make} ${model}`;
}

export function generateRandomHexColor(): string {
  // Generate a random integer between 0 and 0xffffff (inclusive)
  const randomColor = Math.floor(Math.random() * 16777215);
  return `#${randomColor.toString(16).padStart(6, '0')}`;
}
