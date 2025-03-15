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
  public selectedArea?: Area;
  public selectedEmpresa?: Empresa;

  constructor(private ticketsService: TicketsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    forkJoin({
      empresas: this.ticketsService.getEmpresa(),
      areas: this.ticketsService.getArea(),
    }).subscribe(({ empresas, areas }) => {
      this.empresas = empresas;
      this.areas = areas;

      // Seteo Areas y Empresas
      this.selectedArea = this.areas[0]
      this.selectedEmpresa = this.empresas[0]

      this.getActualiza();
    });
  }

  getActualiza() {
    // Cargo los tickets desde el servicio
    this.ticketsService.getTickets().pipe(take(1))
      .subscribe(tickets => {
        const gFiltros = localStorage.getItem('Filtros');
        const gTicket_seleccionado =  localStorage.getItem('Ticket_Seleccionado')

        this.tickets = tickets;
        this.tickets_backup = tickets;

        if ( gTicket_seleccionado ){
          const tSelect= JSON.parse(gTicket_seleccionado)
          this.selectRow(tSelect);
          localStorage.removeItem('Ticket_Seleccionado');
        }else {
          this.selectRow(this.tickets[0])
          this.selectedTicket =  this.tickets[0];
        }

        if ( gFiltros ){
          this.getFiltros(gFiltros);
          localStorage.removeItem('Filtros');
          return;
        }

        let cod_emp_filtro= this.selectedEmpresa?.codigo || 0
        let cod_area_filtro= this.selectedArea?.codigo || 0

        this.filterByEmpresaYArea(cod_emp_filtro, cod_area_filtro)
      });
  }

  getTicket(item: HelpDesk, id: number) {
    this.filtros = {
      codEmpresa: item.empresa.codigo,
      codArea: item.area.codigo
    };

    this.router.navigate([`helpdesk/details`, id], { queryParams: { data: JSON.stringify(this.filtros) } });
    localStorage.setItem('Ticket_Seleccionado', JSON.stringify(item));

    if (this.selectedEmpresa?.codigo === 0 && this.selectedArea?.codigo === 0) return;

    if ( this.selectedEmpresa?.codigo === 0 || this.selectedArea?.codigo === 0 ) {

      if ( this.selectedEmpresa?.codigo && this.selectedArea?.codigo ){
        this.filterByEmpresaYArea(this.selectedEmpresa?.codigo, this.selectedArea?.codigo)
      }

      this.filtros = {
        codEmpresa: this.selectedEmpresa?.codigo,
        codArea: this.selectedArea?.codigo
      };

      localStorage.setItem('Filtros', JSON.stringify(this.filtros));
      this.selectRow(item);
      return;
    }

    localStorage.setItem('Filtros', JSON.stringify(this.filtros));
  }

  getFiltros(gFiltros:any) {
    if (gFiltros) {
      const filtrosParsed: Filtros = JSON.parse(gFiltros);
      this.filtros = filtrosParsed;
      const {codEmpresa, codArea} = this.filtros

      let area_select= this.areas.filter( a => a.codigo === codArea )
      let emp_select= this.empresas.filter( e => e.codigo === codEmpresa )

      this.selectedArea= area_select[0];
      this.selectedEmpresa= emp_select[0];

      this.filterByEmpresaYArea(this.selectedEmpresa.codigo , this.selectedArea.codigo )
    }
  }

  // Filtro Empresa
  filterByEmpresa(event: CustomEvent) {
    const codEmpresa = event.detail.value.codigo;
    this.empresaSeleccionada = this.empresas.filter(e => e.codigo === codEmpresa);
    this.selectedEmpresa= this.empresaSeleccionada[0]

    this.filterByEmpresaYArea(codEmpresa, this.selectedArea?.codigo || 0);
  }

  // Filtro Area
  filterByArea(event: CustomEvent) {
    const codArea = event.detail.value.codigo;
    this.areaSeleccionada = this.areas.filter(a => a.codigo === codArea);
    this.selectedArea= this.areaSeleccionada[0]

    this.filterByEmpresaYArea(this.selectedEmpresa?.codigo || 0, codArea);
  }

  // Filtro Empresa y Area
  filterByEmpresaYArea(codEmpresa: number, codArea: number) {
    this.tickets = this.tickets_backup.filter(t =>
        (codEmpresa === 0 || t.empresa.codigo === codEmpresa) &&
        (codArea === 0 || t.area.codigo === codArea)
    );
  }

  selectRow(item: any) {
    this.selectedTicket = item;
    this.ticketSeleccionado = item;
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
