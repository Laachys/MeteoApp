export interface WeatherValue {
    time: string;
    value: number | string;
}

export interface TemperatureData {
  unit: string;
  values: WeatherValue[];
}

export interface PowerData {
  unit: string;
  values: WeatherValue[];
}

export interface WeatherDataYaml {
  temperature: TemperatureData;
  power?: PowerData;
}