import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MenuPrincipalPage } from '../pages/menu-principal/menu-principal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { FotosPage } from '../pages/paginas-inventario/fotos/fotos';
import { Camera } from '@ionic-native/camera';
import { FotosServiceProvider } from '../providers/fotos-service/fotos-service';
import { SqlHelper } from '../helper/sql-helper';
import { DatabaseProvider } from '../providers/database/database';
import { SyncClientToServerProvider } from '../providers/sync-client-to-server/sync-client-to-server';
import { SyncServerToClientProvider } from '../providers/sync-server-to-client/sync-server-to-client';
import { SQLite } from '@ionic-native/sqlite';
import { ClienteDaoProvider } from '../providers/cliente-dao/cliente-dao';
import { UsuarioDaoProvider } from '../providers/usuario-dao/usuario-dao';
import { Session } from '../providers/session/session';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { ConfiguracoesEquipamentoDaoProvider } from '../providers/configuracoes-equipamento-dao/configuracoes-equipamento-dao';
import { PatrimonioDaoProvider } from '../providers/patrimonio-dao/patrimonio-dao';
import { FilialDaoProvider } from '../providers/cadastro-dao/filial-dao/filial-dao';
import { LocaisDaoProvider } from '../providers/cadastro-dao/locais-dao/locais-dao';
import { GrupoDaoProvider } from '../providers/cadastro-dao/grupo-dao/grupo-dao';
import { EspecieDaoProvider } from '../providers/cadastro-dao/especie-dao/especie-dao';
import { CentroCustosDaoProvider } from '../providers/cadastro-dao/ccustos-dao/ccustos-dao';
import { ResponsaveisDaoProvider } from '../providers/cadastro-dao/responsaveis-dao/responsaveis-dao';
import { InventarioDaoProvider } from '../providers/inventario-dao/inventario-dao';
import { AtributosDoBemDaoProvider } from '../providers/atributos-do-bem-dao/atributos-do-bem-dao';
import { InventarioMovimentacoesDaoProvider } from '../providers/inventario-movimentacoes-dao/inventario-movimentacoes-dao';
import { TipoDadosPatrimonioDaoProvider } from '../providers/tipo-dados-patrimonio-dao/tipo-dados-patrimonio-dao';
import { LookUpDaoProvider } from '../providers/look-up-dao/look-up-dao';
import { PopoverComponent } from '../components/popover/popover';
import { CodigoFicticioDaoProvider } from '../providers/codigo-ficticio-dao/codigo-ficticio-dao';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer'; 
import { FotosDaoProvider } from '../providers/fotos-dao/fotos-dao';
import { DatePicker } from '@ionic-native/date-picker';
import { InventarioConsultaDaoProvider } from '../providers/inventario-consulta-dao/inventario-consulta-dao';
import { SyncClientToServerDaoProvider } from '../providers/sync-client-to-server-dao/sync-client-to-server-dao';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SqlUpdateHelper } from '../helper/sqlUpdate-helper';
import { LoginPage } from '../pages/login/login';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CondicaoUsoDaoProvider } from '../providers/cadastro-dao/condicaoUso-dao/condicaoUso-dao';
import { PatrimoniosDaoProvider } from '../providers/cadastro-dao/patrimonio-dao/patrimonio-dao';
import { ExpandableComponent } from '../components/expandable/expandable';
import { TestaImplementacoesPage } from '../pages/testa-implementacoes/testa-implementacoes';
import { PageTagsNaoEncontradasPage } from '../pages/page-tags-nao-encontradas/page-tags-nao-encontradas';



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    PopoverComponent,
    ExpandableComponent,
    TestaImplementacoesPage
    

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    PopoverComponent,
    ExpandableComponent,
    TestaImplementacoesPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    Device,
    Diagnostic,
    AndroidPermissions,
    DatePicker,
    FotosPage,
    FotosServiceProvider,
    DatabaseProvider,
    SQLite,
    SqlUpdateHelper,
    Geolocation,
    LocationAccuracy,
    SqlHelper,
    SyncClientToServerProvider,
    SyncServerToClientProvider,
    ClienteDaoProvider,
    UsuarioDaoProvider,
    Session,
    FilialDaoProvider,
    LocaisDaoProvider,
    ResponsaveisDaoProvider,
    GrupoDaoProvider,
    EspecieDaoProvider,
    CondicaoUsoDaoProvider,
    CentroCustosDaoProvider,
    ConfiguracoesEquipamentoDaoProvider,
    PatrimonioDaoProvider,
    InventarioDaoProvider,
    AtributosDoBemDaoProvider,
    InventarioMovimentacoesDaoProvider,
    TipoDadosPatrimonioDaoProvider,
    LookUpDaoProvider,
    PatrimoniosDaoProvider,
    CodigoFicticioDaoProvider,
    File,
    FileTransfer,  
    FileTransferObject,
    FotosDaoProvider,
    InventarioConsultaDaoProvider,
    SyncClientToServerDaoProvider,
    BarcodeScanner
  ]
})
export class AppModule { }