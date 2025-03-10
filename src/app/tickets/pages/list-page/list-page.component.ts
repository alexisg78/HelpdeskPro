import { Component, OnInit } from '@angular/core';
import { forkJoin, take } from 'rxjs';

import { Area, Empresa, Filtros, HelpDesk } from '../../interfaces/ticket.interface';
import { TicketsService } from '../../services/tickets-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css',
  standalone: false
})
export class ListPageComponent implements OnInit {

  public tickets: HelpDesk[] = [];
  public tickets_backup: HelpDesk[] = [];
  public ticketSeleccionado!: HelpDesk | null;
  public empresaSeleccionada!: Empresa | null;
  public areaSeleccionada!: Area | null;
  public selectedTicket: any = null;
  public empresas!: Empresa[];
  public areas!: Area[];
  public filtros?: Filtros;
  public tickets_filtrados?: HelpDesk[] = [];

  constructor(private ticketsService: TicketsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.empresaSeleccionada= {codigo: 0, descripcion: 'SIN INFORMACIÓN'}
    this.areaSeleccionada= {codigo: 0, descripcion: 'SIN DATOS'}
    this.getActualiza();

    // Carga las empresas y áreas
    forkJoin({
      empresas: this.ticketsService.getEmpresa(),
      areas: this.ticketsService.getArea(),
    }).subscribe(({ empresas, areas }) => {
      this.empresas = empresas;
      this.areas = areas;
    });
  }

  selectRow(item: any) {
    this.selectedTicket = item;
    this.ticketSeleccionado = item;
  }

  getTicket(item: HelpDesk, id: number) {

    this.filtros = {
      codEmpresa: item.empresa.codigo,
      codArea: item.area.codigo
    };

    this.router.navigate([`helpdesk/details`, id], { queryParams: { data: JSON.stringify(this.filtros) } });
    this.selectRow(item);

    // Guarda los filtros en localStorage
    localStorage.setItem('Filtros', JSON.stringify(this.filtros));
  }

  getActualiza() {
    // Carga los tickets desde el servicio
    this.ticketsService.getTickets().pipe(take(1))
      .subscribe(tickets => {
        this.tickets = tickets;
        this.tickets_backup = tickets;
        this.selectedTicket = this.tickets[0];
        this.getFiltros();
      });
  }

  filterByEmpresa(event: CustomEvent) {
    if (event.detail.value.codigo === 0) {
      localStorage.removeItem('Filtros');
      this.getActualiza();
      return;
    }

    this.tickets = this.tickets_backup.filter(t => t.empresa.codigo === event.detail.value.codigo);
    this.tickets_filtrados = this.tickets;
  }

  filterByArea(event: CustomEvent) {
    if (event.detail.value.codigo === 0) {
      localStorage.removeItem('Filtros');
      this.getActualiza();
      return;
    }

    this.tickets = this.tickets_backup.filter(t => t.area.codigo === event.detail.value.codigo);
    this.tickets_filtrados = this.tickets;
  }

  aplicarFiltros(objFiltro: Filtros) {
    this.tickets = this.tickets_backup;

    if (!objFiltro) return;

    //console.log('Filtros para aplicar: ', objFiltro);

    if (objFiltro.codEmpresa && objFiltro.codArea) {
      this.tickets = this.tickets.filter(t => t.empresa.codigo === objFiltro.codEmpresa && t.area.codigo === objFiltro.codArea);
    } else if (objFiltro.codEmpresa) {
      this.tickets = this.tickets.filter(t => t.empresa.codigo === objFiltro.codEmpresa);
    } else if (objFiltro.codArea) {
      this.tickets = this.tickets.filter(t => t.area.codigo === objFiltro.codArea);
    }

    this.tickets_filtrados = this.tickets;
  }

  getFiltros() {
    const gFiltros = localStorage.getItem('Filtros');

    if (gFiltros) {
      const filtrosParsed: Filtros = JSON.parse(gFiltros);
      this.filtros = filtrosParsed;
      this.aplicarFiltros(filtrosParsed);
    }
  }

  limpiarFiltros(event: CustomEvent){
    const gFiltros = localStorage.getItem('Filtros');
    if (gFiltros && (event.detail.codEmpresa === 0 || event.detail.codArea === 0) ) {
      localStorage.removeItem('Filtros')
    }
  }

}
