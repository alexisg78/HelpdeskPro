import { Component,  Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Area, CrearHelpDesk, Empresa, HelpDesk, Operador, Responsable } from '../../interfaces/ticket.interface';
import { TicketsService } from '../../services/tickets-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'form-page',
  templateUrl: './form-page.component.html',
  styles: `
      :host {
    display: block;
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding: 1rem;
  }`,
  standalone: false
})
export class FormPageComponent implements OnInit, OnDestroy {

  @Input()
  public ticketRecibido!: HelpDesk | null;

  @Input()
  public botonVolverVisible: boolean= false;

  public responsables!: Responsable[];
  public operadores!: Operador[];
  public buscaOperador: any;
  public empresas!: Empresa[];
  public areas!: Area[];

  public buscarResp!: Responsable[];
  public buscarOper!: Operador[];

  public results: string = '';
  public showResults: boolean = false;
  public timeoutId: any;

  public enviarHelpdesk!: CrearHelpDesk;

  public myForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();


  constructor( private fb: FormBuilder, private ticketService: TicketsService, private location: NavController ){}

  ngOnInit(): void {

    this.myForm=  this.fb.group({
      fecha: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      codigosistema: [0],
      codigooperador_solicita: [0],
      codigotiporeclamo: [0],
      codigomenu: [0],
      codigoestado: [1],
      codigoresponsable: [0],
      tipoticket: [1],
      helpdesk: true,
      textoreclamo: ['', [Validators.required, Validators.maxLength(200)]],
      nombreoperador: [''],
      area: ['', Validators.required],
      responsable: [''],
      userid_atiende: [''],
      empresa: ['', Validators.required],
      codigoempresa: [1],
      urgente: [false],
      // requerimiento: ['', Validators.maxLength(100)]
    });

    // Agrupo todas las subscripciones en una sola instancia
    this.subscriptions.add(
      this.ticketService.getResponsables()
      .subscribe( responsables => this.responsables = responsables )
    );

    this.subscriptions.add(
      this.ticketService.getEmpresa()
      .subscribe( emp => this.empresas = emp )
    );

    this.subscriptions.add(
      this.ticketService.getArea()
      .subscribe( area => this.areas= area )
    );

    // suscripción por defecto: codigoempresa = 1 para traer los operadores
    this.subscriptions.add(
      this.ticketService.getOperadores(this.myForm.get('codigoempresa')?.value)
      .subscribe( op => {
          this.operadores = op;
        })
    );

  };

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('Desuscripcion exitosa!')
    this.inicializaForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticketRecibido'] && this.ticketRecibido) {
      console.log('Actualizando formulario con ticket recibido:', this.ticketRecibido);
      this.myForm.patchValue({
        fecha: this.ticketRecibido.fecha || '',
        empresa: this.ticketRecibido.empresa.descripcion || '',
        titulo: this.ticketRecibido.titulo || '',
        codigosistema: 0,
        codigooperador_solicita: 0,
        codigotiporeclamo: 0,
        codigomenu: 0,
        codigoestado: 1,
        codigoresponsable: 0,
        tipoticket: 0,
        helpdesk: true,
        textoreclamo: this.ticketRecibido.textoreclamo || '',
        nombreoperador: this.ticketRecibido.nombreoperador || '',
        area: this.ticketRecibido.area.codigo || '',
        responsable: this.ticketRecibido.responsable || '',
        userid_atiende: this.ticketRecibido.userid_atiende || '',
        codigoempresa: this.ticketRecibido.empresa.codigo,
        urgente: this.ticketRecibido.urgente || false,
      });

      this.botonVolverVisible = true;
      //this.buscar_Operador();
    }
  }

  onEmpresaChange(event: any) {
    const empresaSeleccionada = this.myForm.get('empresa')?.value;
    if (empresaSeleccionada) {
      const { codigo }= empresaSeleccionada
      this.myForm.patchValue({
      codigoempresa: codigo
      })
      console.log('Codigo de la empresa seleccionada:', codigo);

      if (!codigo) return
      this.subscriptions.add(
        this.ticketService.getOperadores(codigo)
          .subscribe( op => {
              this.operadores = op;
            })
      )
    }
  }

  buscar_Operador() {
    if (this.myForm.value.nombreoperador.length > 0 ) {
      this.buscaOperador = this.operadores.filter( op => op.descripcion.trim().toUpperCase() === this.myForm.value.nombreoperador.trim().toUpperCase() )
      let codOpe: number= 0
      if (!this.buscaOperador[0]) return;
      codOpe= this.buscaOperador[0].codigo
      console.log('Posible Operador: ', this.buscaOperador)
      this.myForm.patchValue({ codigooperador_solicita: codOpe })
    }
  }

  buscar_Responsable(){
    if (this.myForm.value.responsable.length > 0 ) {
      this.buscarResp = this.responsables.filter( op => op.descripcion.trim().toUpperCase() === this.myForm.value.responsable.trim().toUpperCase() )
      let codRespo: number= 0
      if (!this.buscarResp[0]) return;
      codRespo= this.buscarResp[0].codigo
      console.log('Posible Responsable: ', this.buscarResp)
      this.myForm.patchValue({ codigoresponsable: codRespo })
    }
  }

  //Captura el valor del ion-searchbar y lo asigna al form
  // onSearchbarChange(event: any, controlName: string): void {
  //   console.log('controlName: ', controlName);
  //   this.myForm.patchValue({ [controlName]: event.detail.value.toUpperCase });

  //   if (controlName === 'operador') {
  //     this.buscar_Operador()
  //   }else {
  //     this.buscar_Responsable()
  //   }
  // }

  onSearchbarChangeOperador(event: any, controlName: string): void {
    console.log('controlName: ', controlName);
    this.myForm.patchValue({ [controlName]: event.detail.value.toUpperCase });
    this.buscar_Operador()
  }

  onSearchbarChangeResponsable(event: any, controlName: string): void {
    console.log('controlName: ', controlName);
    this.myForm.patchValue({ [controlName]: event.detail.value.toUpperCase });
    this.buscar_Responsable()
  }

  onSave():void {
    if (this.myForm.invalid) return

      console.log(this.myForm.value)
      const { area,
              empresa,
              titulo,
              codigosistema,
              codigooperador_solicita,
              codigotiporeclamo,
              codigomenu,
              codigoestado,
              codigoresponsable,
              tipoticket,
              helpdesk,
              textoreclamo
            } = this.myForm.value

       this.enviarHelpdesk = {
              area,
              empresa,
              titulo,
              codigooperador_solicita,
              codigosistema,
              codigotiporeclamo,
              codigomenu,
              codigoestado,
              codigoresponsable,
              tipoticket,
              helpdesk,
              textoreclamo
            }

      console.log(`Ticket para el post en el Backend: ${ JSON.stringify(this.enviarHelpdesk) }`) // solo para mostrarlo en el console.log

      this.inicializaForm();
      if (!this.enviarHelpdesk) return

      // this.ticketService.postTickets(this.enviarHelpdesk)
      //   .subscribe( response => console.log('Rta del Backend: ', response))

  }

  inicializaForm(){
    this.myForm.reset({
        fecha: '',
        empresa: '',
        titulo: '',
        codigosistema: 0,
        codigooperador_solicita: 0,
        codigotiporeclamo: 0,
        codigomenu: 0,
        codigoestado: 1,
        codigoresponsable: 0,
        tipoticket: 1,
        helpdesk: true,
        textoreclamo: '',
        nombreoperador: '',
        area: '',
        responsable: '',
        userid_atiende: '',
        codigoempresa: 0,
        urgente: false,
    })
  }

  handleInputOperador(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    if (target.value?.length === 0) return;
    const query = target.value?.toUpperCase() || '';
    this.buscarOper= this.operadores.filter((o) => o.descripcion.toUpperCase().includes(query));

    //console.log(this.buscarOper)
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.buscarOper = [];
    }, 4000);

  }

  handleInputRespo(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    if (target.value?.length === 0) return;
    const query = target.value?.toUpperCase() || '';
    this.buscarResp= this.responsables.filter((d) => d.descripcion.toUpperCase().includes(query));

    //console.log(this.buscarResp)
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.buscarResp = [];
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

  selectItemOperador(result: any, searchbar: any) {
    //searchbar.value = result.descripcion;
    this.myForm.patchValue({ nombreoperador: result.descripcion }); // Actualiza el formulario
    searchbar.value = result.descripcion;
    this.buscarOper = [];
    this.showResults = false;
    this.buscar_Operador()
  }

  selectItemResponsable(result: any, searchbar: any) {
    this.myForm.patchValue({ responsable: result.descripcion }); // Actualiza el formulario
    searchbar.value = result.descripcion;
    this.buscarResp = [];
    this.showResults = false;
    this.buscar_Responsable();
  }

  // selectItem(result: any, searchbar: any) {
  //   this.myForm.patchValue({ FormControlName: result.descripcion }); // Actualiza el formulario
  //   searchbar.value = result.descripcion;
  //   this.buscarResp = [];
  //   this.buscarOper = [];
  //   this.showResults = false;
  // }

  goBack(){
    this.location.back()
  }

}
