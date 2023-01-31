import { LightningElement,wire,track  } from 'lwc';
import getOrgLocations from '@salesforce/apex/cpGetAllLocations.getOrgLocations';
import getLocationAccounts from '@salesforce/apex/cpGetDefaultInfo.getLocationAccounts';
import createLocations from '@salesforce/apex/cpGetLocationList.createLocations';
import timeZone_FIELD from '@salesforce/schema/Location__c.TimeZone__c';
import LocationType_FIELD from '@salesforce/schema/Location__c.LocationType__c';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import Location_OBJECT from '@salesforce/schema/Location__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


const columns = [
  
    {
        label: 'Location', fieldName: 'locationUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }
        }
    }, {
        label: 'Type',
        fieldName: 'LocationType__c',
        type: 'text',
       // editable: true,
    }, {
        label: 'Timezone',
        fieldName: 'TimeZone__c',
        type: 'text',
       // editable: true,
    }
    
];


export default class CpGetLocationList extends LightningElement {
    columns = columns;
     @track isModalOpen = false;
    @track bShowModal = false;
    @track deleteShowModal = false;
    @track locObj;
    locationValidationCreation = {};// field used for validation
    @track locationTypeValue='';
    @track LocationNameValue;
    @track TimeZoneValue = '';
    @track items = []; //this will hold key, value pair
    @track chosenValue = '';
    @track errorMsg;
    @track error;
    @track value = ''; //initialize combo box value
    TimezoneOptions = [];
    LocationTypeOptions= [];
    createdlocationId ;
    createdLocationName ;
    AccountName;
    accountId;
    refreshTable;
    @track loaded;
 
    @wire( getObjectInfo, { objectApiName: Location_OBJECT } )
    objectInfo;

    @wire( getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: LocationType_FIELD  } )
    wiredAccountSourceData( { error, data } ) {

        console.log( 'Inside location type Get Picklist Values' );

        if ( data ) {
                            
            console.log( 'Data received location type Picklist Field ' + JSON.stringify( data.values ) );
            this.LocationTypeOptions = data.values;
            console.log( 'optionslocation types are ' + JSON.stringify( this.LocationTypeOptions) );

        } else if ( error ) {

            console.error( JSON.stringify( error ) );

        }

    }

    @wire( getPicklistValues, {recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: timeZone_FIELD })
    wiredData( { error, data } ) {

        console.log( 'Inside Get Picklist Values' );

        if ( data ) {
                            
            console.log( 'Data received from Picklist Field ' + JSON.stringify( data.values ) );
            this.TimezoneOptions = data.values.map( objPL => {
                return {
                    label: `${objPL.label}`,
                    value: `${objPL.value}`
                };
            });
            console.log( 'Options are ' + JSON.stringify( this.TimezoneOptions ) );

        } else if ( error ) {

            console.error( JSON.stringify( error ) );

        }

    }


//onchange for request allocation method picklist
locationHandleChanges(event){
    this.locationTypeValue= event.detail.value;

}




//onchange for request allocation method picklist
TimezoneHandleChanges(event){
    this.TimeZoneValue = event.detail.value;

}

   

    closeModal(event) {
  
        // to close modal set isModalOpen tarck value as false
        this.handleResetForm();
        this.bShowModal = false;
        this.isModalOpen = false;
        this.deleteShowModal = false;   
     
    }




    @wire(getOrgLocations)
    cons(result) {
        this.refreshTable = result;
        if(result.data){
            this.locObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            console.log('this is the audit data'+JSON.stringify(result));
         
            resp.forEach(item => item['locationUrl'] = '/location/' +item['Id']);
            this.locObj = resp;
           }
        console.log('this is the location===>'+ JSON.stringify(result));
        if (result.error) {
            this.locObj = undefined;
        }
    };

   // refreshing the datatable after record edit form success
   handleSuccess() {
    return refreshApex(this.refreshTable);
}
    @wire(getLocationAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            console.log('this wired account data===> '+JSON.stringify(data));
            var accName = data[0].Name;
            this.AccountName = accName;
            var accId = data[0].Id;
          this.accountId= accId;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    
    };

handleResetForm(){
      
  
   this.template.querySelectorAll('.validate').forEach((input) => { input.value = ''; });
   
 
  }


  handleNewButton(event){
    this.value='';
    this.LocationNameValue = '';
    this.locationTypeValue = '';
    this.TimeZoneValue = '';
    this.isModalOpen = true;
    console.log('new button clicked');
}



locationhandleChange(event){

  if(event.target.name == 'Location Name'){
    this.LocationNameValue = event.target.value;  
  }

  if(event.target.name == 'Location Type'){
    this.locationTypeValue = event.target.value;  
  }
  if(event.target.name == 'Time Zone'){
    this.TimeZoneValue = event.target.value;  
  }

}

get selectedValue(){
    return this.chosenValue;
}
  ///validation 
  isInputValid() {
    let isValid = true;
    let inputFields = this.template.querySelectorAll('.validate');
    inputFields.forEach(inputField => {
        if(!inputField.checkValidity()) {
            inputField.reportValidity();
            isValid = false;
        }
        this.locationValidationCreation[inputField.name] = inputField.value;
    });
    return isValid;
}


//handling save button in popup modal 

handleSave(){
   
     //section to create location from apex method
     if(this.isInputValid()) {
        
        console.log('good to go buddy');
        this.loaded=true;
        
        createLocations({theAccountId: this.accountId, theLocationName :this.LocationNameValue , thetimezone:this.TimeZoneValue ,theLocationType :  this.locationTypeValue})
     .then(result=>{
         this.createdlocationId = result.Id;
         this.createdLocationName = result.Name;
         this.loaded =false;
         console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.name );
         this.isModalOpen = false;
         const toastEvent = new ShowToastEvent({
             title:'Location "'  +  this.createdLocationName + '" was created.',
             message: '',
             variant:'success'
           });
           this.dispatchEvent(toastEvent);
    
          return refreshApex(this.refreshTable);
    
     })
     .catch(error =>{
        this.errorMsg=error.message;
        window.console.log(this.error);
     });

     
     }else{
        const toast = new ShowToastEvent({
            message: "Review all error messages below to correct your data.",
            variant: "error",
        });
        this.dispatchEvent(toast);
     }
    }


    handleSaveForSaveAndNew(){
         //section to create location from apex method
         if(this.isInputValid()) {
        
            console.log('good to go buddy');
            this.loaded=true;
            
            createLocations({theAccountId: this.accountId, theLocationName :this.LocationNameValue , thetimezone:this.TimeZoneValue ,theLocationType :  this.locationTypeValue})
         .then(result=>{
             this.createdlocationId = result.Id;
             this.createdLocationName = result.Name;
             this.loaded =false;
             console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.name );
             const toastEvent = new ShowToastEvent({
                 title:'Location "'  +  this.createdLocationName + '" was created.',
                 message: '',
                 variant:'success'
               });
               this.dispatchEvent(toastEvent);
        
              return refreshApex(this.refreshTable);
        
         })
         .catch(error =>{
            this.errorMsg=error.message;
            window.console.log(this.error);
         });
    
         
         }else{
            const toast = new ShowToastEvent({
                message: "Review all error messages below to correct your data.",
                variant: "error",
            });
            this.dispatchEvent(toast);
         }
    }
    
    


     handleSaveAndNew(){
           //section to create location  from apex method
           if(this.isInputValid()) {
        
            console.log('good to go buddy');
            this.loaded=true;
            
            createLocations({theAccountId: this.accountId, theLocationName :this.LocationNameValue , thetimezone:this.TimeZoneValue ,theLocationType :  this.locationTypeValue})
         .then(result=>{
             this.createdlocationId = result.Id;
             this.createdLocationName = result.Name;
             this.loaded =false;
             console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.name );
             const toastEvent = new ShowToastEvent({
                 title:'Location "'  +  this.createdLocationName + '" was created.',
                 message: '',
                 variant:'success'
               });
               this.dispatchEvent(toastEvent);
               this.handleResetForm();   
              return refreshApex(this.refreshTable);
        
         })
         .catch(error =>{
            this.errorMsg=error.message;
            window.console.log(this.error);
         });
    
         
         }else{
            const toast = new ShowToastEvent({
                message: "Review all error messages below to correct your data.",
                variant: "error",
            });
            this.dispatchEvent(toast);
         }
     }
}