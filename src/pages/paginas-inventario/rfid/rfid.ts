import { Session } from '../../../providers/session/session';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as $ from "jquery";
import { ConfiguracaoEquipamento } from '../../../modelos/ConfiguracaoEquipamento';

declare let atid_rfid;
declare let UgiUiUtil;
declare let ugi;
declare let UgiRfMicron;
declare let UgiRfidConfiguration;
declare let UgiInventory;
declare let UgiInventoryDelegate;

var SPECIAL_FUNCTION_NONE = 0;
var SPECIAL_FUNCTION_READ_USER_MEMORY = 1;
var SPECIAL_FUNCTION_READ_TID_MEMORY = 2;
var SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_SENSOR_CODE = 3;
var SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_TEMPERATURE = 4;

var SPECIAL_FUNCTION_RF_MICRON_MAGNUS_TYPE;
var SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_TYPE;
var SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_THRESHOLD = 25;

@IonicPage()
@Component({
  selector: 'page-rfid',
  templateUrl: 'rfid.html',
})
export class RfidPage{

  public text:any;
  public objConfig: ConfiguracaoEquipamento;
  public statusRfid:any;
  public tipoLeitura = "múltipla";
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events:Events,
    public session: Session) {
      console.log('rfid construida');
      

  }

  get retornaStatus(){
    return ugi.isConnected;
  }


  async ionViewWillEnter() {
    var config: ConfiguracaoEquipamento = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(config);
    // app.initialize();
    // app.inventoryType = UgiRfidConfiguration.InventoryTypes.LOCATE_DISTANCE;
    atid_rfid.initialize(function(data) {
      console.log('initialise '+data)
    })
    this.selecionaEtiqueta(this.navCtrl);
    
  }

  ionViewDidLeave(){
    //var teste = app.displayedTags;
    app.stopScanning();
  }

  startsingleRfid(){
    $('#start').css('display','none');
    $('#info').css('display','none');
    $('#configure').css('display','none');
    $('#pause').css('display','inline-block');
    $('#stop').css('display','inline-block');
    app.startScanningSingle();
  }

  startRfid(){
    $('#start').css('display','none');
    $('#info').css('display','none');
    $('#configure').css('display','none');
    $('#pause').css('display','inline-block');
    $('#stop').css('display','inline-block');
    // app.startScanning();
    atid_rfid.start_readTagContinuous((data) => {
      console.log('tag '+data.tag)
    })
  }

  stopRfid(){
    $('#pause').css('display','none');
    $('#resume').css('display','none');
    $('#stop').css('display','none');
    $('#info').css('display','inline-block');
    $('#start').css('display','inline-block');
    $('#configure').css('display','inline-block');
    app.stopScanning();
  }

  infoRfid(){
    UgiUiUtil.showVersionAlert();
  }

  tipoDeLeitura(tipo){
    if(tipo){
      this.tipoLeitura = "múltipla";
      app.inventoryType = UgiRfidConfiguration.InventoryTypes.LOCATE_DISTANCE;
    } else {
      this.tipoLeitura = "individual";
      app.inventoryType = UgiRfidConfiguration.InventoryTypes.SINGLE_FIND;
    }
  }
  somDeLeitura(somAtivado){
    if(somAtivado){
      app.volume = 1;
    }else{
      app.volume = 0;
    }
  }

  configureRfid(){
    app.doConfigure();
  }

  pauseRfid(){
    $('#pause').css('display','none');
    $('#resume').css('display','inline-block');
    var inventory = ugi.activeInventory;
    inventory.pauseInventory();
  }

  resumeRfid(){
    $('#pause').css('display','inline-block');
    $('#resume').css('display','none');
    var inventory = ugi.activeInventory;
    inventory.resumeInventory();
  }

  selecionaEtiqueta(navCtrl: NavController){
    var mascara = this.objConfig.mascara.length;
    $('#epcList').delegate('p', 'click', function() {
      this.text = $(this).text();
      var etiquetaComMascara = this.text.substring(this.text.length-mascara);
      navCtrl.getPrevious().data.etiquetaSelecionada = etiquetaComMascara;
      navCtrl.pop();
    });
  }
}

var app = {

  specialFunction: SPECIAL_FUNCTION_NONE,

  displayedTags: [],
  timerId: null,

  inventoryType: 0,
  volume: 0,
  soundType: 1,
    
  footerLeftHandler: null,
  footerCenterHandler: null,
  footerRightHandler: null,
  useLocalSoundIfPossible: null,

  /////////////////////////////////////////
  // initialization
  /////////////////////////////////////////

  //
  // Application Constructor
  //
  initialize: function() {
    document.addEventListener("deviceready", this.onDeviceReady, false);
  },
    
    ////////////////////
    
  onDeviceReady: function() {
    ugi.log("------------------------- onDeviceReady: Javascript OK ---------------------------------");
    //
    // to control Internet use
    //
    //ugi.setSendGrokkerSerialNumber(false);
    //ugi.setCheckServerForUnknownDevices(false);
    //ugi.setSendFirstConnectionAndAutomaticConfigurationReports(false);
    //ugi.setDoAutomaticFirmwareUpdate(false);
    //
    // to set additional logging
    //
    ugi.setLogging(ugi.LoggingTypes.STATE | ugi.LoggingTypes.INVENTORY);

    SPECIAL_FUNCTION_RF_MICRON_MAGNUS_TYPE = UgiRfMicron.MagnusModels.MODEL_402;
    SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_TYPE = UgiRfMicron.RssiLimitTypes.LESS_THAN_OR_EQUAL;
    
    ugi.openConnection();
    UgiUiUtil.setUseUGrokItStyleAlerts(true);
    
    
    
    $("#footerLeftButton").bind("click", function() { if (app.footerLeftHandler) app.footerLeftHandler(); });
    $("#footerCenterButton").bind("click", function() { if (app.footerCenterHandler) app.footerCenterHandler(); });
    $("#footerRightButton").bind("click", function() { if (app.footerRightHandler) app.footerRightHandler(); });

    //$("#actionsButton").bind("click", app.doActions);

    /*$("#epcList").on('click', 'a', function() {
      var id = $(this)[0].id;
      var row = parseInt(id.substring(5));
      var tag = app.displayedTags[row];
      app.tagTouched(tag);
    });*/

    app.inventoryType = UgiRfidConfiguration.InventoryTypes.LOCATE_DISTANCE;
    app.updateUI();
      $("#statusImg").change(function(){
        $("#rfidon").html("conectado");
    });

    UgiUiUtil.startStatusImage($("#statusImg")[0], true);
  },
    
  /////////////////////////////////////////
  // UI
  /////////////////////////////////////////

  updateUI: function() {
    var inventory = ugi.activeInventory;
    if (inventory) {
      //
      // Scanning
      //
      if (inventory.isPaused) {
        app.setFooterLeft("resume", function() {
          inventory.resumeInventory();
          app.updateUI();
        });
      } else {
        app.setFooterLeft("pause", function() {
          inventory.pauseInventory();
          app.updateUI();
        });
      }
      //app.setFooterCenter("stop", app.stopScanning);
      app.setFooterCenter(null, null);
      app.setFooterRight(null, null);
    } else {
      //
      // Not scanning
      //
      app.setFooterLeft("info", function() {
        UgiUiUtil.showVersionAlert();
      });
      app.setFooterCenter("start", app.startScanning);
      //app.setFooterRight("configure", app.doConfigure);
    }
  },

  setFooterLeft: function(text, handler) {
    app.setFooterCommon("Left", text, handler);
  },
  setFooterCenter: function(text, handler) {
    app.setFooterCommon("Center", text, handler);
  },
  setFooterRight: function(text, handler) {
    app.setFooterCommon("Right", text, handler);
  },
  setFooterCommon: function(button, text, handler) {
    if (text) {
      $("#footer"+button+"Button").show();
      $("#footer"+button+"Button").text(text);
    } else {
      $("#footer"+button+"Button").hide();
    }
    app["footer"+button+"Handler"] = handler;
  },

  updateCountAndTime: function() {
    $("#foundSpan").text("" + app.displayedTags.length);
    if (ugi.activeInventory) {
      var d: any = new Date();
      var interval = Math.round(( d - ugi.activeInventory.startTime) / 1000);
      var minutes = Math.floor(interval / 60);
      var seconds = interval - minutes*60;
      $("#timeSpan").text((minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    }
  },

  /////////////////////////////////////////
  // scanning
  /////////////////////////////////////////
  startScanningSingle: function() {
    $("#epcList").empty();
    app.inventoryType = UgiRfidConfiguration.InventoryTypes.SINGLE_FIND;
    app.displayedTags = [];
    var config;
    if (app.specialFunction == SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_SENSOR_CODE) {
      config = UgiRfMicron.configToReadMagnusSensorValue(UgiRfidConfiguration.InventoryTypes.SINGLE_FIND,
                  SPECIAL_FUNCTION_RF_MICRON_MAGNUS_TYPE,
                  SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_TYPE,
                  SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_THRESHOLD);
    } else if (app.specialFunction == SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_TEMPERATURE) {
      config = UgiRfMicron.configToReadMagnusTemperature(app.inventoryType);
    } else {
      config = UgiRfidConfiguration.configWithInventoryType(app.inventoryType);
      if (app.specialFunction == SPECIAL_FUNCTION_READ_USER_MEMORY) {
        config.minUserBytes = 4;
        config.maxUserBytes = 128;
      } else if (app.specialFunction == SPECIAL_FUNCTION_READ_TID_MEMORY) {
        config.minTidBytes = 4;
        config.maxTidBytes = 128;
      }
    }
    config.volume = app.volume;
    config.soundType = app.soundType;
    ugi.startInventory(app, config);

    app.updateUI();
    app.updateCountAndTime();
    if (!config.reportSubsequentFinds) {
      app.timerId = setInterval(app.updateCountAndTime, 1000);
    } else {
      app.timerId = null;
    }
    //UgiUiUtil.startDisconnectedAlert(app.stopScanning);
  },

  startScanning: function() {
    $("#epcList").empty();    
    app.displayedTags = [];
    var config;
    if (app.specialFunction == SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_SENSOR_CODE) {
      config = UgiRfMicron.configToReadMagnusSensorValue(UgiRfidConfiguration.InventoryTypes.LOCATE_DISTANCE,
                  SPECIAL_FUNCTION_RF_MICRON_MAGNUS_TYPE,
                  SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_TYPE,
                  SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_THRESHOLD);
    } else if (app.specialFunction == SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_TEMPERATURE) {
      config = UgiRfMicron.configToReadMagnusTemperature(app.inventoryType);
    } else {
      config = UgiRfidConfiguration.configWithInventoryType(app.inventoryType);
      if (app.specialFunction == SPECIAL_FUNCTION_READ_USER_MEMORY) {
        config.minUserBytes = 4;
        config.maxUserBytes = 128;
      } else if (app.specialFunction == SPECIAL_FUNCTION_READ_TID_MEMORY) {
        config.minTidBytes = 4;
        config.maxTidBytes = 128;
      }
    }
    config.volume = app.volume;
    config.soundType = app.soundType;
    ugi.startInventory(app, config);

    app.updateUI();
    app.updateCountAndTime();
    if (!config.reportSubsequentFinds) {
      app.timerId = setInterval(app.updateCountAndTime, 1000);
    } else {
      app.timerId = null;
    }
    //UgiUiUtil.startDisconnectedAlert(app.stopScanning);
  },

  stopScanning: function() {
    console.log("Parando o Scan");
    UgiUiUtil.stopDisconnectedAlert();
    if (app.timerId) clearInterval(app.timerId);
    UgiUiUtil.stopInventoryWithCompletionShowWaiting(function() {
      app.updateUI();
    });
  },

  /////////////////////////////////////////
  // inventory
  /////////////////////////////////////////

  ugiInventoryDidStop: function(result) {
    if ((result != UgiInventoryDelegate.InventoryCompletedReturnValues.LOST_CONNECTION) &&
        (result != UgiInventoryDelegate.InventoryCompletedReturnValues.OK)) {
      UgiUiUtil.showInventoryError(result);
    }
    if (result != UgiInventoryDelegate.InventoryCompletedReturnValues.LOST_CONNECTION) {
      UgiUiUtil.stopDisconnectedAlert();
    }
    if (app.timerId) clearInterval(app.timerId);
    app.updateUI();
  },

  ugiInventoryTagFound: function(tag, detailedPerReadData) {
    app.handlePerReads(tag, detailedPerReadData);
    //var sub = app.getSubtitle(tag);
    //var s = sub ? '<br><span id="sub_' + tag.epc + '" class="cell_subtitle">' + sub + '</span>' : '';
    $("#epcList").append('<p>' + tag.epc + '</p>');
    app.displayedTags.push(tag);
    $("#foundSpan").text("" + app.displayedTags.length);
    //($("#epcList")as any).listview('refresh');
  },

  ugiInventoryTagSubsequentFinds: function(tag, count, detailedPerReadData) {
    app.handlePerReads(tag, detailedPerReadData);
    app.updateSubtitle(tag);
  },

  ugiInventoryHistoryInterval: function() {
    for (var i = 0; i < app.displayedTags.length; i++) {
      var tag = app.displayedTags[i];
      app.updateSubtitle(tag);
    }
    app.updateCountAndTime();
  },

  handlePerReads: function(tag, detailedPerReadData) {
    if (app.specialFunction == SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_SENSOR_CODE) {
      for (var i = 0; i < detailedPerReadData.length; i++) {
        var p = detailedPerReadData[i];
        //
        // get sensor code and add it to the string we display
        //
        var sensorCode = UgiRfMicron.getMagnusSensorCode(p);
        if (!tag.detailedData) tag.detailedData = "";
        if (tag.detailedData.length) tag.detailedData += " ";
        tag.detailedData = tag.detailedData + sensorCode;
        if (SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_TYPE != UgiRfMicron.RssiLimitTypes.NONE) {
          //
          // get on-chip RSSI and add it to the string we display
          //
          var onChipRssi = UgiRfMicron.getMagnusOnChipRssi(p);
          tag.detailedData += "/" + onChipRssi;
        }
      }
    } else if (app.specialFunction == SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_TEMPERATURE) {
      for (var j = 0; j < detailedPerReadData.length; j++) {
        var q = detailedPerReadData[j];
        //
        // Get the temperature and add it to string we display
        //
        var temperatureC = UgiRfMicron.getMagnusTemperature(tag, q);
        if (!tag.detailedData) tag.detailedData = "";
        if (tag.detailedData.length) tag.detailedData += " ";
        tag.detailedData = tag.detailedData + temperatureC;
      }
    }
  },

  /////////////////////////////////////////
  // tag list
  /////////////////////////////////////////

  updateSubtitle: function(tag) {
    var sub = app.getSubtitle(tag);
    if (sub) {
      var node = $("#sub_" + tag.epc)[0];
      if (node) node.innerHTML = sub;
    }
  },

  getSubtitle: function(tag) {
    if (app.specialFunction == SPECIAL_FUNCTION_READ_USER_MEMORY) {
      return "user: " + tag.userMemory;
    } else if (app.specialFunction == SPECIAL_FUNCTION_READ_TID_MEMORY) {
      return "tid: " + tag.tidMemory;
    } else if (tag.detailedData) {
      return tag.detailedData;
    } else if (app.inventoryType >= UgiRfidConfiguration.InventoryTypes.HF_INVENTORY) {
      return tag.hfShortDescription;
    } else if (ugi.activeInventory.configuration.reportSubsequentFinds) {
      return tag.readState.getReadHistoryString();
    } else {
      return null;
    }
  },

  /////////////////////////////////////////
  // tag actions
  /////////////////////////////////////////

  tagTouched: function(tag) {
    if (ugi.activeInventory) {
      if (!ugi.activeInventory.isPaused) ugi.activeInventory.pauseInventory();
      UgiUiUtil.showMenu(null,
        function() {
          ugi.activeInventory.resumeInventory();
          app.updateUI();
        },
        "commission (write EPC)", function() { app.doCommission(tag) },
        "read user memory", function() { app.doReadUserMemory(tag) },
        "write user memory", function() { app.doWriteUserMemory(tag) },
        "read then write user memory", function() { app.doReadThenWriteUserMemory(tag) },
        "custom command (read tag)", function() { app.doCustomCommand(tag) },
        "scan for this tag only", function() { app.doLocate(tag) }
      );
    } else {
      var message = "Touch a tag while scanning (or paused) to act on the tag";
      if (app.inventoryType >= UgiRfidConfiguration.InventoryTypes.HF_INVENTORY) {
        message = tag.hfLongDescription + "\n\n" + message;
      } else {
        message = "firstRead: " + tag.firstRead + "\n\n" + message;
      }
      UgiUiUtil.showOk("not scanning", message);
    }
  },

  // Commission, called with inventory paused
  doCommission: function(tag) {
    UgiUiUtil.showTextInput("commission tag", "EPC:", "commission", tag.epc, false,
      function(t) {
        if (t.length != tag.epc.length) {
          UgiUiUtil.showOk("commission tag", "The EPC must remain the same length (" + tag.epc.length + ")",
            function() { app.doCommission(tag); });
        } else {
          ugi.activeInventory.resumeInventory();
          app.updateUI();
          UgiUiUtil.showWaiting("commissioning");
          ugi.activeInventory.programTag(tag.epc, t, UgiInventory.NO_PASSWORD,
            function(tag, result) {
              UgiUiUtil.hideWaiting();
              if (result == UgiInventory.TagAccessReturnValues.OK) {
                UgiUiUtil.showOk("commission tag",
                                "Success\nNew EPC: " + t);
              } else {
                UgiUiUtil.showTagAccessError("commission tag", result);
              }
            });
        }
      },
      function() {
        ugi.activeInventory.resumeInventory();
        app.updateUI();
      });
  },

  doReadUserMemory: function(tag) {
    ugi.activeInventory.resumeInventory();
    app.updateUI();
    UgiUiUtil.showWaiting("reading user memory");
    ugi.activeInventory.readTag(tag.epc, ugi.MemoryBanks.USER, 0, 16, 64,
      function(tag, data, result) {
        UgiUiUtil.hideWaiting();
        if (result == UgiInventory.TagAccessReturnValues.OK) {
          UgiUiUtil.showOk("read tag",
                          "USER memory (" + data.length/2 + " bytes):\n" + data);
        } else {
          UgiUiUtil.showTagAccessError("read tag", result);
        }
      },
      UgiInventory.NO_PASSWORD);
  },

  doWriteUserMemory: function(tag) {
    ugi.activeInventory.resumeInventory();
    app.updateUI();
    var newMem = UgiUiUtil.stringToHexString("Hello World!");
    UgiUiUtil.showWaiting("writing user memory");
    ugi.activeInventory.writeTag(tag.epc, ugi.MemoryBanks.USER, 0, newMem,
                                null, UgiInventory.NO_PASSWORD,
      function(tag, result) {
        UgiUiUtil.hideWaiting();
        if (result == UgiInventory.TagAccessReturnValues.OK) {
          UgiUiUtil.showOk("write tag",
                          "New USER memory (" + newMem.length/2 + " bytes):\n" + newMem);
        } else {
          UgiUiUtil.showTagAccessError("write tag", result);
        }
    });
  },

  doReadThenWriteUserMemory: function(tag) {
    ugi.activeInventory.resumeInventory();
    app.updateUI();
    UgiUiUtil.showWaiting("reading user memory");
    ugi.activeInventory.readTag(tag.epc, ugi.MemoryBanks.USER, 0, 16, 64,
      function(tag, data, result) {
        UgiUiUtil.hideWaiting();
        if (result == UgiInventory.TagAccessReturnValues.OK) {
          var newMem = data.substring(2) + data.substring(0, 2);
          UgiUiUtil.showWaiting("writing user memory");
          ugi.activeInventory.writeTag(tag.epc, ugi.MemoryBanks.USER, 0, newMem,
                                      data, UgiInventory.NO_PASSWORD,
            function(tag, result) {
              UgiUiUtil.hideWaiting();
              if (result == UgiInventory.TagAccessReturnValues.OK) {
                UgiUiUtil.showOk("write tag",
                                "New USER memory (" + newMem.length/2 + " bytes):\n" + newMem);
              } else {
                UgiUiUtil.showTagAccessError("write tag", result);
              }
            });
        } else {
          UgiUiUtil.showTagAccessError("read tag", result);
        }
      });
  },

  doCustomCommand: function(tag) {
    ugi.activeInventory.resumeInventory();
    app.updateUI();

    var CUSTOM_COMMAND_READ_BANK = 3;
    var CUSTOM_COMMAND_READ_OFFSET = 0;
    var CUSTOM_COMMAND_READ_WORD_COUNT = 4;
    var commandData = [
      0xc2,
      (CUSTOM_COMMAND_READ_BANK << 6) | (CUSTOM_COMMAND_READ_OFFSET >> 2),
      (CUSTOM_COMMAND_READ_OFFSET << 6) | (CUSTOM_COMMAND_READ_WORD_COUNT >> 2),
      (CUSTOM_COMMAND_READ_WORD_COUNT << 6)];

    UgiUiUtil.showWaiting("custom command (read tag)");
    ugi.activeInventory.customCommandToTag(
    //epc, command, commandBits, responseBitLengthNoHeaderBit,
    //responseBitLengthWithHeaderBit, receiveTimeoutUsec, completion
      tag.epc,  // epc
      commandData, // command
      8 + 2 + 8 + 8, // commandBits
      16 * CUSTOM_COMMAND_READ_WORD_COUNT, // responseBitLengthNoHeaderBit
      8 * 2, // responseBitLengthWithHeaderBit
      5000, // receiveTimeoutUsec
      function(tag, headerBit, response, result) {
        UgiUiUtil.hideWaiting();
        if (result == UgiInventory.TagAccessReturnValues.OK) {
          UgiUiUtil.showOk("custom command (read tag)",
                          "success: (" + response.length/2 + " bytes):\n" + response);
        } else {
          UgiUiUtil.showTagAccessError("custom command (read tag)", result);
        }
    });
  },

  doLocate: function(tag) {
    if (app.timerId) clearInterval(app.timerId);
    UgiUiUtil.stopInventoryWithCompletionShowWaiting(function() {
      $("#epcList").empty();
      app.displayedTags = [];
      var config = UgiRfidConfiguration.configWithInventoryType(UgiRfidConfiguration.InventoryTypes.LOCATE_DISTANCE);
      config.selectMask = tag.epc;
      config.selectOffset = 32;
      config.selectBank = ugi.MemoryBanks.EPC;
      ugi.startInventory(app, config, [tag.epc]);
      app.updateUI();
      app.updateCountAndTime();
      UgiUiUtil.showToast("Restarted inventory", "Searching for only " + tag.epc);
    });
  },

  /////////////////////////////////////////
  // configuration
  /////////////////////////////////////////

  doConfigure: function() {
    UgiUiUtil.showMenu("configure", null,
      "inventory type", function() {
        var choices = [];
        for (var i = 0; i < UgiRfidConfiguration.numInventoryTypes(); i++) {
          choices.push(UgiRfidConfiguration.nameForInventoryType(i+1));
        }
        UgiUiUtil.showChoices(choices, app.inventoryType-1, "set inventory type", "set", true,
                                          function(index, name) {
                                            app.inventoryType = index+1;
                                          });
      },
      "special functions", function() {
        UgiUiUtil.showChoices(["none",
                              "read User Memory",
                              "read TID memory",
                              "read RF Micron sensor code",
                              "read RF Micron temperature"],
                              app.specialFunction, "set special function", "set", true,
                                          function(index, name) {
                                            app.specialFunction = index;
                                          });
      },
      "volume rfid scan", function() {
        UgiUiUtil.showChoices(["desligado","ligado"],
                              app.volume, "Volume", "set", true,
                              function(index, name) {
                                app.volume = index;
                              });
      });
  },

  /////////////////////////////////////////
  // actions
  /////////////////////////////////////////

  /*doActions: function() {
    if (!ugi.activeInventory) {
      var android = (ugi.platform == "android");
      UgiUiUtil.showMenu("actions", null,
        "show ok", function() {
          UgiUiUtil.showOk("example alert", "message here");
        },
        "barcode scan", function() {
          UgiUiUtil.showWaiting("scanning for barcode", function() {
            ugi.cancelBarcodeScan();
          });
          var config = UgiBarcodeConfiguration.getDefaultConfiguration();
          config.useLocalSoundIfPossible = app.useLocalSoundIfPossible;
          if (!ugi.barcodeScan(config, function(barcode) {
            UgiUiUtil.hideWaiting();
            if (barcode) {
              UgiUiUtil.showOk("barcode scan", "found: " + barcode);
            } else {
              UgiUiUtil.showOk("barcode scan", "no barcode found");
            }
          })) {
            UgiUiUtil.hideWaiting();
            UgiUiUtil.showBarcodeError();
          }
        },
        android ? "audio reconfiguration" : null, function() { ugi.invokeAudioReconfiguration(); },
        android ? "set audio jack location" : null, function() { ugi.invokeAudioJackLocation(); }
      );
    }
  }*/
};
