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
export class ListPageComponent implements OnInit{

  public tickets: HelpDesk[] = []
  public tickets_backup: HelpDesk[] = []
  public ticketSeleccionado!: HelpDesk | null
  public selectedTicket: any = null;
  public empresas!: Empresa[];
  public areas!: Area[];
  public filtros?: Filtros
  //public filtroActivo: boolean = false

  constructor  (private ticketsService : TicketsService, private router: Router, private route: ActivatedRoute ) {}

  ngOnInit(): void {

    this.getActualiza();

    forkJoin({
      empresas: this.ticketsService.getEmpresa(),
      areas: this.ticketsService.getArea(),
    }).subscribe(({ empresas, areas }) => {
      this.empresas = empresas;
      this.areas = areas;
    });

    // Verificar si hay filtros pasados a través de queryParams
    // this.route.queryParams.subscribe(params => {
    //   if (params['data']) {
    //     this.filtros = JSON.parse(params['data']);
    //     console.log('filtros: ', this.filtros)
    //     this.aplicarFiltros(this.filtros);
    //   }else{
    //     console.log('filtros: ', params)
    //     this.getActualiza();
    //   }
    // });
  }

  selectRow(item: any) {
    this.selectedTicket = item;
    this.ticketSeleccionado= item;
  }

  getTicket(item:HelpDesk, id: number){

    this.filtros = {
      codEmpresa: item.empresa.codigo,
      codArea: item.area.codigo
    };

    this.router.navigate([`helpdesk/details`, id], { queryParams: { data: JSON.stringify(this.filtros)} });
    this.selectRow(item)
  }

  getActualiza(){
    this.ticketsService.getTickets().pipe(take(1))
    .subscribe( tickets => {
      this.tickets =  tickets;
      this.tickets_backup= tickets;
      this.selectedTicket= this.tickets[0]
    });
  }

  filterByEmpresa(event: CustomEvent) {
    if ( event.detail.value.codigo === 0 ) {
      this.getActualiza();
      return;
    }

    this.tickets= this.tickets_backup;
    this.tickets= this.tickets.filter( t => t.empresa.codigo === event.detail.value.codigo )

  }

  filterByArea(event: CustomEvent) {
    if ( event.detail.value.codigo === 0 ) {
      this.getActualiza();
      return;
    }

    this.tickets= this.tickets_backup;
    this.tickets= this.tickets.filter( t => t.area.codigo === event.detail.value.codigo )

  }

  aplicarFiltros(objFiltro: Filtros){
    this.tickets= this.tickets_backup;
    if (!objFiltro) return;

    if (objFiltro.codEmpresa && objFiltro.codArea) { this.tickets= this.tickets.filter( t => t.empresa.codigo === objFiltro.codEmpresa && t.area.codigo === objFiltro.codArea ); return}
    if (objFiltro.codEmpresa && !objFiltro.codArea){ this.tickets= this.tickets.filter( t => t.area.codigo === objFiltro.codArea ); return}
    if (!objFiltro.codEmpresa && objFiltro.codArea){ this.tickets= this.tickets.filter( t => t.area.codigo === objFiltro.codArea ); return}

  }

}
