import { Component,  Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Empresa, HelpDesk, Operador, Responsable } from '../../interfaces/ticket.interface';
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
  public botonVisible: boolean= false;

  public responsables!: Responsable[];
  public operadores!: Operador[];
  public empresas!: Empresa[];

  public buscarResp!: Responsable[];
  public buscarOper!: Operador[];

  public results: string = '';
  public showResults: boolean = false;
  public timeoutId: any;

  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {

    // Agrupo todas las subscripciones en una sola instancia
    this.subscriptions.add(
      this.ticketService.getResponsables().subscribe(responsables => {
        this.responsables = responsables;
        //console.log('Responsables: ', this.responsables);
      })
    );

    this.subscriptions.add(
      this.ticketService.getOperadores().subscribe(op => {
        this.operadores = op;
      })
    );

    this.subscriptions.add(
      this.ticketService.getEmpresa().subscribe(emp => {
        this.empresas = emp;
        //console.log('Empresas: ', this.empresas);
      })
    );

  };

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('Desubscripcion exitosa!')
  }

  constructor( private fb: FormBuilder, private ticketService: TicketsService, private location: NavController ){}

  public myForm: FormGroup = this.fb.group({
    fecha: ['', Validators.required],
    titulo: ['', [Validators.required, Validators.maxLength(50)]],
    textoreclamo: ['', [Validators.required, Validators.maxLength(200)]],
    nombreoperador: [''],
    area: ['', Validators.required],
    responsable: [''],
    userid_atiende: [''],
    empresa: ['', Validators.required],
    codigoestado: [1],
    urgente: [false],
    // requerimiento: ['', Validators.maxLength(100)]
  });


  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticketRecibido'] && this.ticketRecibido) {
      //console.log('Actualizando formulario con ticket recibido:', this.ticketRecibido);
      this.myForm.patchValue({
        fecha: this.ticketRecibido.fecha || '',
        titulo: this.ticketRecibido.titulo || '',
        textoreclamo: this.ticketRecibido.textoreclamo || '',
        nombreoperador: this.ticketRecibido.nombreoperador || '',
        area: this.ticketRecibido.area || '',
        responsable: this.ticketRecibido.responsable || '',
        userid_atiende: this.ticketRecibido.userid_atiende || '',
        empresa: this.ticketRecibido.empresa || '',
        urgente: this.ticketRecibido.urgente || false,
      });

      this.botonVisible = true;

    }
  }

  // Captura el valor del ion-searchbar y lo asigna al form
  onSearchbarChange(event: any, controlName: string): void {
    this.myForm.patchValue({ [controlName]: event.detail.value });
  }

  onSave():void {
    if (this.myForm.invalid) return
    //console.log(this.myForm.value)
     this.myForm.reset()
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
    }, 4000);

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
    }, 4000);

  }

  onSearchFocus(){
    this.showResults= true;
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.buscarResp = [];
      this.buscarOper= [];
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

  selectItem(result: any, searchbar: any) {
    searchbar.value = result.descripcion;
    this.buscarResp = [];
  }

  goBack(){
    this.location.back()
  }

}
