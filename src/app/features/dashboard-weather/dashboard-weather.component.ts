import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { DataWeatherService } from '../../core/services/data-weather.service';

@Component({
  selector: 'app-dashboard-weather',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard-weather.component.html',
  styleUrls: ['./dashboard-weather.component.scss']
})
export class DashboardWeatherComponent implements OnInit {

  //configuraciones de los datos
  currentValue: {
    time: string;
    value: number;
    power?: number
  } | null = null;

  averageTemperature: number | null = null;
  totalEnergyKWh: number | null = null;

  //configuraciones del grafico
  chartDataLength = 0;
  temperatureChartData: any[] = [{
    name: 'Temperatura (ºC)',
    series: []
  }];

  powerChartData: any[] = [{
    name: 'Potencia (kW)',
    series: []
  }];

  temperatureColorScheme: Color = {
    name: 'temperatura',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00cc76']
  };

  powerColorScheme: Color = {
    name: 'potencia',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ba68c8']
  };

  //configuraciones para el componente sticky
  isSticky = false;
  topOffset = 0;
  private observer?: IntersectionObserver;


  constructor(private weatherService: DataWeatherService) { }

  /**
  * Funcion que se ejecuta al inciar y que se suscribre 
  * al flujo de datos para actualizar en tiempo real
  * los valores de temperatura, potencia, promedios y gráficas.
  */
  ngOnInit(): void {
    this.weatherService.currentValue$.subscribe(value => {
      if (!value) return;
      this.currentValue = value;

      // actualiza temperatura media y energia total
      this.averageTemperature = value.avgTemperature;
      this.totalEnergyKWh = value.totalEnergyKWh;

      //agrega un nuevo puntito a los graficos
      if (value.value !== null) {
        this.temperatureChartData = [
          { name: 'Temperatura (ºC)', series: [...this.temperatureChartData[0].series, { name: value.time, value: value.value }] }
        ];
      }


      if (value.power !== null) {
        this.powerChartData = [
          { name: 'Potencia (kW)', series: [...this.powerChartData[0].series, { name: value.time, value: value.power }] }
        ];
      }

      this.chartDataLength = this.temperatureChartData[0].series.length;
    });
  }

  /**
   * Funcion que se ejecuta una vez toda la pagina cargada para asi calcular
   * el header y el inicio de la card para hacer su componente sticky
  */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateHeaderHeight();
      this.setupStickyObserver();
    }, 300);
  }

  ngOnDestroy(): void {
    // limpiar observer al destruir componente
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Funcion que calcula la altura header para el componente sticky
  */
  private calculateHeaderHeight() {
    const header = document.querySelector('header');
    this.topOffset = header ? header.clientHeight : 0;
  }

  /**
 * Funcion que maneja el apartado sticky
  */
  private setupStickyObserver() {
    const card = document.getElementById('weatherCard');

    // creamos un div sensor
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = `${this.topOffset}px`;
    sentinel.style.left = '0';
    sentinel.style.width = '1px';
    sentinel.style.height = '1px';
    card?.parentElement?.insertBefore(sentinel, card);

    // vigilamos si el div sensor entre en el viewport
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isSticky = entry.intersectionRatio < 1 && !entry.isIntersecting ? true : false;
      },
      {
        rootMargin: `-${this.topOffset}px 0px 0px 0px`,
        threshold: [0, 1]
      }
    );

    this.observer.observe(sentinel);
  }

  /*
  * Funcion que formatea los valores del eje X en ambas gráficas
 * para mostrar horas/minutos/segundos de forma optima
 * según la cantidad de datos para que sea facil de ver visualmente
 */
  xAxisTickFormatting = (value: string): string => {
    const date = new Date(value.includes('T') ? value : `2000-01-01T${value}`);
    if (isNaN(date.getTime())) return value;

    //aqui mostramos todas las etiquetas porque tenemos pocos datos. Ejemplo: 13:00:00 - 13:00:05 - 13:00:10
    if (this.chartDataLength < 15) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    //aqui hacemos intervalos dinamicos cuando vamos teniendo gran cantidad de datos. Ejemplo: 13:00:30 - 13:01:00 - 13:01:30
    const intervalSec = this.getDynamicIntervalSeconds();
    const totalSeconds = date.getMinutes() * 60 + date.getSeconds();
    return intervalSec > 0 && totalSeconds % intervalSec === 0
      ? date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : ' ';
  };

  /*
    * Funcion que va calculando los intervalos de forma dinámica. 
    * Ejemplo: en el primer intervalo ( < 15 datos) -> muestra todos
    * Entre 15 datos y 30 datos -> Va saltando de 30s en 30s
    * Entre los 30 y los 45 datos -> Va saltando de 1min en 1 min
   */
  private getDynamicIntervalSeconds(): number {
    if (this.chartDataLength < 15) return 0;
    const block = Math.floor(this.chartDataLength / 15);
    return block * 30;
  }
}
