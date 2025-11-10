import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import yaml from 'js-yaml';
import { BehaviorSubject, timer } from 'rxjs';
import { WeatherDataYaml, WeatherValue } from '../models/data-weather.model';

@Injectable({
  providedIn: 'root'
})
export class DataWeatherService {

  private http = inject(HttpClient);

  private temperatureValues: WeatherValue[] = [];
  private powerValues: WeatherValue[] = [];
  private allTimes: string[] = [];
  private index = 0;
  private currentValueSubject = new BehaviorSubject<any>(null);
  currentValue$ = this.currentValueSubject.asObservable();

  constructor() { this.load(); }

  /*
  *
  * Funcion que carga los datos del YAML
  * y que da el formato a los datos para usarlos en el componente
  * 
  */
  private load() {
    this.http.get('assets/data/data.yml', { responseType: 'text' })
      .subscribe(content => {
        const data = yaml.load(content) as WeatherDataYaml;

        //parseamos los valores de temp y potencia en numeros
        this.temperatureValues = (data.temperature?.values || []).map(v => ({
          time: v.time,
          value: Number(v.value)
        }));

        this.powerValues = (data.power?.values || []).map(v => ({
          time: v.time,
          value: Number(v.value)
        }));

        const timesSet = new Set<string>();
        this.temperatureValues.forEach(t => timesSet.add(t.time));
        this.powerValues.forEach(p => timesSet.add(p.time));
        this.allTimes = Array.from(timesSet)
          .map(ts => ({ ts, date: new Date(`2000-01-01T${ts}`) }))
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(x => x.ts);

        // el indice comenzará en la hora actual 
        this.index = this.getCurrentIndex();

        this.startStreaming();
      });
  }

  /*
  *
  * Funcion que inicia el streaming simulando el tiempo real.
  * Cada 5s se actualizan los campos.
  * 
  */
  private startStreaming() {

    // conversión de MW a kWh considerando intervalos de 5 segundos
    const mwToKwh = (mw: number) => mw * 1000 * (5 / 3600);


    let accumulatedEnergyKWh = 0;
    let sumTemp = 0;
    let countTemp = 0;

    timer(0, 5000).subscribe(() => {
      if (this.index >= this.allTimes.length) return;

      const time = this.allTimes[this.index];

      //buscamos en el YAML los datos para el tiempo actual
      const tempRaw = this.temperatureValues.find(t => t.time === time);
      const powerRaw = this.powerValues.find(p => p.time === time);

      //hacemos la conversion de los datos, la temperatura a ºC y la energia a kWh
      const tempC = tempRaw ? +((+tempRaw.value / 10 - 273.15).toFixed(2)) : null;
      const energyKwh = powerRaw ? +(mwToKwh(+powerRaw.value).toFixed(6)) : null;
      
      // Acumular energía total y las temperaturas medias
      if (energyKwh) accumulatedEnergyKWh += energyKwh;

      if (tempC !== null && !isNaN(tempC)) {
        sumTemp += tempC;
        countTemp++;
      }
      const avgTemp = countTemp > 0 ? +(sumTemp / countTemp).toFixed(2) : null;

      //objeto a enviar
      const normalized = {
        time,
        value: tempC,
        power: energyKwh,
        avgTemperature: avgTemp,
        totalEnergyKWh: +accumulatedEnergyKWh.toFixed(3)
      };

      this.index++;
      this.currentValueSubject.next(normalized);
    });
  }

  /**
   * Funcion que devuelve el indice segun la hora actual.
   * Si la hora actual supera todos los tiempos disponibles,
   * se devuelve el último índice.
   */
  private getCurrentIndex(): number {
    const now = new Date();
    const currentTimeStr = now.toTimeString().slice(0, 8);

    const idx = this.allTimes.findIndex(t => t >= currentTimeStr);

    if (idx >= 0) return idx;

    return this.allTimes.length > 0 ? this.allTimes.length - 1 : 0;
  }
}
