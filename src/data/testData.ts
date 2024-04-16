interface CarModel {
  [make: string]: string[];
}

export const carMake: string[] = [
  'Tesla',
  'Ford',
  'BMW',
  'Mercedes',
  'Audi',
  'Hyundai',
  'Kia',
  'Toyota',
  'Porsche',
  'Dodge',
];

export const carModel: CarModel = {
  Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y'],
  Ford: ['Mustang GT Fastback', 'Bronco Black Diamond', 'F-150 Raptor', 'Ranger XL'],
  BMW: ['X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'M3', 'M8', 'i5', 'i7'],
  Mercedes: ['GLS 600', 'G 550', 'C 300', 'E 350', 'S 580', 'S 680', 'AMG GT 43', 'AMG GT 53'],
  Audi: ['A7', 'A8', 'Q3', 'Q5', 'TT', 'R8'],
  Hyundai: ['Sonata', 'Elantra', 'Santa FE', 'Creta', 'Tucson'],
  Kia: ['K5', 'K7', 'K8', 'Carnival', 'Seltos', 'Sorento'],
  Toyota: ['Land Cruiser 300', 'Camry', 'Supra', 'Corolla', 'Highlander'],
  Porsche: ['911', 'Cayenne', 'Cayman', 'Panamera'],
  Dodge: ['Charger', 'Challenger', 'Viper'],
};
