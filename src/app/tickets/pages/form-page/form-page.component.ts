import { Component,  Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Area, Empresa, HelpDesk, Operador, Responsable } from '../../interfaces/ticket.interface';
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
  public empresas!: Empresa[];
  public areas!: Area[];

  public buscarResp!: Responsable[];
  public buscarOper!: Operador[];

  public results: string = '';
  public showResults: boolean = false;
  public timeoutId: any;

  public myForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor( private fb: FormBuilder, private ticketService: TicketsService, private location: NavController ){}

  ngOnInit(): void {

    this.myForm=  this.fb.group({
      fecha: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      codigosistema: [0],
      codigooperador: [0],
      codigotiporeclamo: [0],
      codigomenu: [0],
      codigoestado: [1],
      codigoresponsable: [0],
      tipoticket: [0],
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
      this.ticketService.getOperadores(this.myForm.value.codigoempresa)
      .subscribe( op => this.operadores = op )
    );

    // Suscripción dinámica para obtener los operadores cuando 'codigoempresa' cambie
    this.subscriptions.add(
      this.myForm.get('codigoempresa')?.valueChanges.subscribe((empresa: Empresa) => {

        if (!empresa) return

        const codigo = typeof empresa === 'object' ? empresa.codigo : empresa;
        if (!codigo) return; // Evita llamar al servicio si código es inválido

        this.myForm.patchValue({ codigoempresa: empresa.codigo })
        // gestiona el cambio de 'codigoempresa' y hace la petición correspondiente
        this.ticketService.getOperadores(empresa.codigo).subscribe(operadores => {
          this.operadores = operadores;
          this.myForm.patchValue({ codigooperador: operadores[0].codigo })
        });
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
        codigooperador: 0,
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
    }
  }

  // Captura el valor del ion-searchbar y lo asigna al form
  onSearchbarChange(event: any, controlName: string): void {
    this.myForm.patchValue({ [controlName]: event.detail.value });
  }

  onSave():void {
    if (this.myForm.invalid) return

      console.log(this.myForm.value)
      const { area,
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
            } = this.myForm.value

      const enviarHelpdesk = {
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

      console.log(`Ticket para el post en el Backend: ${ JSON.stringify(enviarHelpdesk) }`) // solo para mostrarlo en el console.log

      // this.ticketService.postTickets(enviarHelpdesk)
      //   .subscribe( response => console.log('Rta del Backend: ', response))

      this.inicializaForm();
  }

  inicializaForm(){
    this.myForm.reset({
      fecha: '',
      titulo: '',
      textoreclamo: '',
      nombreoperador: '',
      area: '',
      responsable: '',
      userid_atiende: '',
      //empresa: '',
      //codigoempresa: 1,
      urgente: false
    })
  }

  handleInputOperador(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    if (target.value?.length === 0) return;
    const query = target.value?.toLowerCase() || '';
    this.buscarOper= this.operadores.filter((o) => o.descripcion.toLowerCase().includes(query));

    //console.log(this.buscarOper)
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.buscarOper = [];
    }, 5000);

  }

  handleInputRespo(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    if (target.value?.length === 0) return;
    const query = target.value?.toLowerCase() || '';
    this.buscarResp= this.responsables.filter((d) => d.descripcion.toLowerCase().includes(query));

    //console.log(this.buscarResp)
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.buscarResp = [];
    }, 5000);

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
      }, 5000);

    }
  }

  handleKeydownF9Responsable(event: KeyboardEvent) {
    if (event.key === "F9" || event.key === "ArrowDown") {   // Detecta si la tecla presionada es F9 o flecha abajo
      this.buscarResp = this.responsables.filter((r) => r.descripcion.length > 0 )

      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.buscarResp = [];
      }, 5000);

    }
  }

  selectItemOperador(result: any, searchbar: any) {
    //searchbar.value = result.descripcion;
    this.myForm.patchValue({ nombreoperador: result.descripcion }); // Actualiza el formulario
    searchbar.value = result.descripcion;
    this.buscarOper = [];
    this.showResults = false;
  }

  selectItemResponsable(result: any, searchbar: any) {
    this.myForm.patchValue({ responsable: result.descripcion }); // Actualiza el formulario
    searchbar.value = result.descripcion;
    this.buscarResp = [];
    this.showResults = false;
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
