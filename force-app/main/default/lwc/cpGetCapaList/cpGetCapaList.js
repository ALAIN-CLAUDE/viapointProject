import { LightningElement,wire,track } from 'lwc';


import getOrgCapas from '@salesforce/apex/cpGetCapaList.getOrgCapas';
import getAuditFindings from '@salesforce/apex/cpGetCapaList.getAuditFindings';
import createCAPAs from '@salesforce/apex/cpGetCapaList.createCAPAs';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [	
  
    {
        label: 'CAPA Number', fieldName: 'capaUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }
        }
    }, 
    {
        label: 'Title',
        fieldName: 'CapaTitle__c',
        type: 'text',
    }, {
        label: 'Type',
        fieldName: 'CapaType__c',
        type: 'text',
     //   editable: true,
    }, {
        label: 'Status',
        fieldName: 'CapaWorkflowStatus__c',
        type: 'text',
     //   editable: true,
    }
];
let i=0;
export default class CpGetCapaList extends LightningElement {
    columns = columns;
    @track CAPAObj;
    @track isModalOpen = false;
    @track bShowModal = false;
    @track deleteShowModal = false;
    @track items = []; //this will hold key, value pair
    @track value = ''; //initialize combo box value
    @track chosenValue = '';
    auditFindingId;
    CAPAValue ;
    CAPATitleValue ;
    CAPADescriptionValue;
    StartDateValue ;
    DueDateValue ;
    createdCAPAId ;
    @track createdCAPAName;
    refreshTable;
    @track loaded;
    CAPAValidationCreation = {};// field used for validation



    closeModal(event) {
  
        // to close modal set isModalOpen tarck value as false
        this.handleResetForm();
        this.bShowModal = false;
        this.isModalOpen = false;
        this.deleteShowModal = false;   
     
    }
 
    @wire(getOrgCapas)
    cons(result) {
        this.refreshTable = result;
        if(result.data){
            this.CAPAObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
           // console.log('this is the audit actiiiii  data'+JSON.stringify(result.data));
            resp.forEach(item => item['capaUrl'] = '/capa/' +item['Id']);
            this.CAPAObj  = resp;
           
        }
        if (result.error) {
            this.CAPAObj = undefined;
        }
    };


    handleResetForm(){
      
  
        this.template.querySelectorAll('.validate').forEach((input) => { input.value = ''; });
        
      
       }

    handleNewButton(event){
       
        this.CAPAValue = '';
        this.CAPATitleValue = '';
        this.CAPADescriptionValue = '';
        this.StartDateValue = '';
        this.DueDateValue  = '';
        this.isModalOpen = true;
        console.log('new button clicked');

        getAuditFindings()
        .then(result => {
            if(result){
             console.log('This is Capa audit findings '+ result);
                var audFindData = JSON.stringify(result); 
                console.log('this is na stringaayyy'  + audFindData );
                
                let Dataforloop = JSON.parse(audFindData);
                
                this.items = [];
                
                for(i=0; i<Dataforloop.length; i++)  {
                    
                 const option = {
                 label : Dataforloop[i].AuditFindingTitle__c,
                 value: Dataforloop[i].Id
             };
 
                 this.items = [...this.items ,option ]; 
 
             console.log('this items=======> '+this.items);                                  
         }     
         
            }else{
                console.log('no result.data found');
            }
               
 
        })
        .catch(error => {
            this.error = error;
        });
   
}

get Resoptions() {
    return this.items;
}

CAPAHandleChange(event){


    const selectedOption = event.detail.value;
    console.log('selected value=' + selectedOption);
    this.chosenValue = selectedOption;


    if(event.target.name == 'Audit Finding Title'){

    this.auditFindingId = selectedOption;


    }
  if(event.target.name == 'CAPA Title'){
    this.CAPATitleValue = event.target.value;  
  }

  if(event.target.name == 'CAPA'){
    this.CAPAValue = event.target.value;  
  }
  if(event.target.name == 'CAPA Description'){
    this.CAPADescriptionValue = event.target.value;  
  }
  if(event.target.name == 'Start Date'){
    this.StartDateValue= event.target.value;  

  }
  if(event.target.name == 'Due Date'){
    this.DueDateValue = event.target.value;   

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
        this.CAPAValidationCreation[inputField.name] = inputField.value;
    });
    return isValid;
}


    //handling save button in popup modal 

   handleSave(){
   
    //section to create location from apex method
    if(this.isInputValid()) {
       
       console.log('good to go buddy');
       this.loaded=true;
       
       createCAPAs({theAuditFindingId : this.auditFindingId, theCapaTitle :this.CAPATitleValue ,theCapa:this.CAPAValue ,theCapaDescription :  this.CAPADescriptionValue , theStartDate : this.StartDateValue, theDueDate : this.DueDateValue})
    .then(result=>{
        this.createdCAPAId = result.Id;
        this.createdCAPAName = result.CapaTitle__c  ;
        this.loaded =false;
        console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.CapaTitle__c );
        this.isModalOpen = false;
        const toastEvent = new ShowToastEvent({
            title:'CAPA  "'  +  this.createdCAPAName + '" was created.',
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
     
     createCAPAs({theAuditFindingId : this.auditFindingId, theCapaTitle :this.CAPATitleValue ,theCapa:this.CAPAValue ,theCapaDescription :  this.CAPADescriptionValue , theStartDate : this.StartDateValue, theDueDate : this.DueDateValue})
  .then(result=>{
    this.createdCAPAId = result.Id;
    this.createdCAPAName = result.CapaTitle__c  ;
      this.loaded =false;
      console.log('the created result id and CapaTitle__c  ==>'+result.Id + ' this name ==>'+ result.CapaTitle__c  );
      const toastEvent = new ShowToastEvent({
          title:'CAPA  "'  +  this.createdCAPAName + '" was created.',
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