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
  public empresaSeleccionada!: Empresa[] | null;
  public areaSeleccionada!: Area[] | null;
  public selectedTicket: any = null;
  public empresas!: Empresa[];
  public areas!: Area[];
  public filtros?: Filtros= {};
  public tickets_filtrados?: HelpDesk[] = [];
  public filtra: boolean = false
  public selectedArea= {}
  public selectedEmpresa= {}
  constructor(private ticketsService: TicketsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Carga las empresas y áreas
    forkJoin({
      empresas: this.ticketsService.getEmpresa(),
      areas: this.ticketsService.getArea(),
    }).subscribe(({ empresas, areas }) => {
      this.empresas = empresas;
      this.areas = areas;

      // Variable para almacenar la selección
      this.selectedArea = this.areas[0]
      this.selectedEmpresa = this.empresas[0]

      this.getActualiza();

      // localStorage.setItem('Filtros', JSON.stringify(this.filtros));

    });

    // this.getActualiza();
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

        // if (this.filtros?.codArea === 0 && this.filtros.codEmpresa === 0) return;  FUNCIONA - VER

        const gFiltros = localStorage.getItem('Filtros');
        if ( gFiltros ){
          this.getFiltros(gFiltros);
          return;
        }else{
          this.limpiarFiltros(0)
          console.log('Limpia Filtros')
        }

      });
  }

  filterByEmpresa(event: CustomEvent) {
    const codEmpresa = event.detail.value.codigo;
    this.empresaSeleccionada = this.empresas.filter(e => e.codigo === codEmpresa);
    this.selectedEmpresa= this.empresaSeleccionada
    this.filterByEmpresaYArea(codEmpresa, this.areaSeleccionada?.[0]?.codigo || 0);
  }

  filterByArea(event: CustomEvent) {
    const codArea = event.detail.value.codigo;
    this.areaSeleccionada = this.areas.filter(a => a.codigo === codArea);
    this.tickets = this.tickets_backup.filter(t => t.area.codigo === event.detail.value.codigo);
    this.selectedArea= this.areaSeleccionada
    this.filterByEmpresaYArea(this.empresaSeleccionada?.[0]?.codigo || 0, codArea);
  }

  filterByEmpresaYArea(codEmpresa: number, codArea: number) {

    this.tickets = this.tickets_backup.filter(t =>
        (codEmpresa === 0 || t.empresa.codigo === codEmpresa) &&
        (codArea === 0 || t.area.codigo === codArea)
    );

    this.tickets_filtrados = [...this.tickets];
    console.log('Tickets Filtrados: ', this.tickets_filtrados)

    localStorage.removeItem('Filtros');
  }

  getFiltros(gFiltros:any) {
    if (gFiltros) {
      const filtrosParsed: Filtros = JSON.parse(gFiltros);
      this.filtros = filtrosParsed;
      const {codEmpresa, codArea} = this.filtros

      if ( codEmpresa && codArea ){
        this.selectedArea= this.areas.filter( a => a.codigo === codArea )
        this.selectedEmpresa= this.empresas.filter( e => e.codigo === codEmpresa )
        this.filterByEmpresaYArea(codEmpresa, codArea)
      }
    }

  }

  limpiarFiltros(codigo: number){
    const gFiltros = localStorage.getItem('Filtros');
    if (gFiltros && (codigo === 0) ) {
      this.selectedArea = this.areas[0]
      this.selectedEmpresa = this.empresas[0]
      this.filterByEmpresaYArea(0,0)
    }
  }

}
