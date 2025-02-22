import { Component,  Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Area, Empresa, Estado, HelpDesk, Operador, Responsable, Seguimiento } from '../../interfaces/ticket.interface';
import { TicketsService } from '../../services/tickets-service.service';
import { forkJoin, Subscription } from 'rxjs';
import { SweetAlertService } from 'src/app/sweet-alert/sweet-alert-service.service';

@Component({
  selector: 'form-page',
  templateUrl: './form-page.component.html',
  styles: `
      :host {
    display: block;
    width: 100%;
    max-width: 600px;
    min-width: 221px;
    margin: auto;
    padding: 1rem;
  }`,
  standalone: false
})
export class FormPageComponent implements OnInit, OnDestroy {

  @Input()
  public ticketRecibido!: HelpDesk | null;

  @Input()
  public botonVisible: boolean= false;

  public ticket?: HelpDesk | null

  public empresas!: Empresa[];
  public areas!: Area[];
  public estados!: Estado[];
  public seguimiento!: Seguimiento | null

  // Responsables y Operadores
  public responsables!: Responsable[];
  public operadores!: Operador[];
  public buscarOper!: Operador[];
  public buscarResp!: Responsable[];
  public buscaOperador: any;
  public buscaResponsable: any;

  public isOperador: boolean= false;
  public results: string = '';
  public showResults: boolean = false;
  public timeoutId: any;
  public isLoading: boolean= false

  public myForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketsService,
    private location: NavController,
    private sweetAlertservice: SweetAlertService,
  ){}

  ngOnInit(): void {

    this.myForm=  this.fb.group({
      codigoppal: 0,
      area: [this.ticketRecibido?.area, Validators.required],
      empresa: [this.ticketRecibido?.empresa, Validators.required],
      estado: [this.ticketRecibido?.estado, Validators.required],
      responsable: [this.ticketRecibido?.responsable],
      solicita: [this.ticketRecibido?.solicita],
      sistema: [{ codigo: 1, descripcion: '' }],
      fecha: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      textoreclamo: ['', [Validators.required, Validators.maxLength(200)]],
      userid_atiende: [''],
      codigotiporeclamo: [0],
      codigomenu: [0],
      urgente: [false],
      helpdesk: true,
      tipoticket: [1],
    });

    forkJoin({
      responsables: this.ticketService.getResponsables(),
      empresas: this.ticketService.getEmpresa(),
      areas: this.ticketService.getArea(),
      estados: this.ticketService.getEstado(),
    }).subscribe(({ responsables, empresas, areas, estados }) => {
      this.responsables = responsables;
      this.empresas = empresas;
      this.areas = areas;
      this.estados = estados

      const estadoDefecto =  this.estados ? this.estados.find(e => e.codigo === 1) : this.ticketRecibido?.estado
      this.myForm.patchValue({
          estado: estadoDefecto,
        });

    });

    this.subscriptions.add(
      this.ticketService.getOperadores(this.myForm.value.empresa)
      .subscribe( op => {
          this.operadores = op;
        })
    );

  };

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.inicializaForm();
  }

  get cargarTicket(): HelpDesk {
    let post_ticket: HelpDesk
    post_ticket = this.myForm.value as HelpDesk;
    return post_ticket
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticketRecibido'] && this.ticketRecibido) {
      this.myForm.patchValue({
        codigoppal: this.ticketRecibido.codigoppal,
        area: this.ticketRecibido.area,
        empresa: this.ticketRecibido.empresa,
        //sistema: this.ticketRecibido.sistema,
        sistema: { codigo: 1, descripcion: '' },
        estado: this.ticketRecibido.estado,
        responsable: this.ticketRecibido.responsable.descripcion,
        solicita: this.ticketRecibido.solicita.descripcion,
        codigosistema: 0,
        fecha: this.ticketRecibido.fecha,
        titulo: this.ticketRecibido.titulo,
        textoreclamo: this.ticketRecibido.textoreclamo,
        userid_atiende: this.ticketRecibido.userid_atiende,
        codigotiporeclamo: 0,
        codigomenu: 0,
        urgente: this.ticketRecibido.urgente || false,
        helpdesk: true,
        tipoticket: 1,
        codigooperador_solicita: 0,
        codigoresponsable: 0,
      });

      //Si las listas no están cargadas, cargar ambas
      if (!this.empresas || !this.areas || !this.estados || this.empresas.length === 0 || this.areas.length === 0 || this.estados.length === 0) {
        forkJoin({
          empresa: this.ticketService.getEmpresa(),
          area: this.ticketService.getArea(),
          estados: this.ticketService.getEstado()
        }).subscribe(({ empresa, area, estados }) => {
          this.empresas = empresa;
          this.areas = area;
          this.estados = estados
          this.patchSelect();
        });
      } else {
        this.patchSelect();
      }

      this.botonVisible = true;

    }
  }

  patchSelect() {
    const empresaSeleccionada = this.empresas ? this.empresas.find(e => e.codigo === this.ticketRecibido?.empresa.codigo) : this.ticketRecibido?.empresa
    const areaSeleccionada =  this.areas ? this.areas.find(a => a.codigo === this.ticketRecibido?.area.codigo) : this.ticketRecibido?.area
    const estadoSeleccionado =  this.estados ? this.estados.find(e => e.codigo === this.ticketRecibido?.estado?.codigo) : this.ticketRecibido?.estado

    if (!empresaSeleccionada || !areaSeleccionada || !estadoSeleccionado) return;

    this.myForm.patchValue({
      empresa: empresaSeleccionada,
      area: areaSeleccionada,
      estado: estadoSeleccionado,
    });
  }

  // Dependiendo de la empresa seleccionada, traigo los operadores desde el servicio
  onEmpresaChange(event: any) {
    const empresaSeleccionada = this.myForm.get('empresa')?.value;
    if (empresaSeleccionada) {
      this.myForm.patchValue({
    })

    if (!empresaSeleccionada) return
    this.subscriptions.add(
      this.ticketService.getOperadores(empresaSeleccionada)
        .subscribe( op => {
            this.operadores = op;
          })
      )
    }
  }

  buscar_codPersona(isOp: boolean, pers: string){
    if ( isOp && this.myForm.value.solicita ){
      // es operador
      this.buscaOperador = this.operadores.find( op => op.descripcion.trim().toUpperCase() === pers.trim().toUpperCase() );

      if ( !this.buscaOperador ) return;
      this.myForm.patchValue({ solicita: this.buscaOperador.descripcion })
    }

    if ( !isOp && this.myForm.value.responsable ) {
      // es responsable
      this.buscaResponsable = this.responsables.find( op => op.descripcion.trim().toUpperCase() === pers.trim().toUpperCase() );

      if ( !this.buscaResponsable ) return;
      this.myForm.patchValue({ responsable: this.buscaResponsable.descripcion })
    }

  }

  onSearchbarChange(event: any, controlName: string, isOp: boolean): void {
    this.isOperador= isOp

    const pers= event.detail.value.toUpperCase()
    this.buscar_codPersona(this.isOperador, pers)
  }

  handleInputOperador(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;

    if (target.value?.length === 0) return;
    const query = target.value?.toUpperCase() || '';

    this.buscarOper= this.operadores.filter((o) => o.descripcion.toUpperCase().includes(query));

    if (!query) {
      this.buscarOper = [];
      this.showResults = false;
      return
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.buscarOper = [];
      this.showResults = false;
    }, 4000);

  }

  handleInputRespo(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;

    if (target.value?.length === 0) return;
    const query = target.value?.toUpperCase() || '';

    this.buscarResp= this.responsables.filter((d) => d.descripcion.toUpperCase().includes(query));

    if (!query) {
      this.buscarResp = [];
      this.showResults = false;
      return;
    }
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.buscarResp = [];
      this.showResults = false;
    }, 4000);

  }

  onSearchFocus(){
    this.showResults= true;
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.buscarResp = [];
      this.buscarOper= [];
      this.showResults = false;
    }
  }

  handleKeydownF9Operador(event: KeyboardEvent) {
    if (event.key === "F9" || event.key === "ArrowDown") {   // Detecta si la tecla presionada es F9 o flecha abajo
      this.buscarOper = this.operadores.filter((o) => o.descripcion.length > 0 )

      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.buscarOper = [];
      }, 4000);

    }
  }

  handleKeydownF9Responsable(event: KeyboardEvent) {
    if (event.key === "F9" || event.key === "ArrowDown") {   // Detecta si la tecla presionada es F9 o flecha abajo
      this.buscarResp = this.responsables.filter((r) => r.descripcion.length > 0 )

      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.buscarResp = [];
      }, 4000);

    }
  }

  selectItem(result: any, searchbar: any, isOp: boolean) {
    const per= result.descripcion

    if (isOp) {
      this.isOperador= true
      searchbar.value = per;
      this.buscarOper = [];
      this.showResults = false;
    }

    if (!isOp) {
      this.isOperador= false
      searchbar.value = per;
      this.buscarResp = [];
      this.showResults = false;
    }

    this.buscar_codPersona(this.isOperador, per)
  }

  onSave() {
    const msjExito= 'El Ticket fue enviado con éxito!'

    if (this.myForm.invalid) {
      this.sweetAlertservice.toast_alerta('Ingrese datos requeridos!', 1000, 'warning')
      return
    };

    this.isLoading= true;

    //seteo los objetos solicita y responsable
    this.myForm.patchValue({ solicita: this.buscaOperador })
    this.myForm.patchValue({ responsable: this.buscaResponsable })

    let post_ticket: HelpDesk = this.myForm.value

    if (!post_ticket) return

    this.ticketService.postTickets(post_ticket)
      .subscribe( {
        next: (response) => {
          this.inicializaForm();
          this.isLoading= false;
          this.sweetAlertservice.toast_alerta( msjExito, 1000, 'success' );
        },
        error: (err) => {
          console.error('Error al enviar el ticket:', err);
          this.isLoading= false;
          this.sweetAlertservice.toast_alerta( 'Error al enviar el ticket!', 1000, 'error' );
        }
      })

      this.inicializaForm();
  }

  inicializaForm(){
    this.myForm.reset()
    this.isLoading= false
  }

  goBack(){
    this.location.back()
  }

  onUpdate(){

    let post_ticket: HelpDesk = this.myForm.value

    //seteo los objetos solicita y responsable dado que del form sino me toma los valores en string de los searchBox
    post_ticket.solicita= this.ticketRecibido?.solicita || { codigo: 0 , descripcion: '' }
    post_ticket.responsable= this.ticketRecibido?.responsable || { codigo: 0 , descripcion: '' }

    post_ticket.tipoticket= this.ticketRecibido?.tipoticket || 1

    this.ticketService.putTicket(post_ticket)
    .subscribe({
        next: (response) => {
          this.sweetAlertservice.toast_alerta('Datos actualizados correctamente!', 1000, 'info');
        },
        error: (err) => {
          console.error('Error al actualizar ticket:', err);
          this.sweetAlertservice.toast_alerta('Error al actualizar datos.', 2000, 'error');
        },
    });

  }

}
