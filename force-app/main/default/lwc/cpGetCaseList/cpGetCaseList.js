import { LightningElement,wire,track } from 'lwc';

import getAllMyCases from '@salesforce/apex/cpGetCaseList.getAllMyCases';
import createCase from '@salesforce/apex/cpGetCaseList.createCase';
import getLocationAccounts from '@salesforce/apex/cpGetDefaultInfo.getLocationAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';



const columns = [
    {
        label: 'Ticket Number', fieldName: 'caseUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'CaseNumber'
            }
        }
    },  
     { 
        label: 'Subject', 
        fieldName: 'Subject',
        type: 'text',
        
},    
{ 
   label: 'Date Opened', 
   fieldName: 'CreatedDate',
   type: 'date', 
   typeAttributes: {
     day: 'numeric',
     month: 'numeric',
     year: 'numeric',
     hour: '2-digit',
     minute: '2-digit',
     hour12: true
   },
   sortable: false
   
},    
{ 
   label: 'Status', 
   fieldName: 'Status',
   type: 'text',
   
}
    
    ];
export default class CpGetCaseList extends LightningElement {
    columns = columns;
    @track isModalOpen = false;
    @track bShowModal = false;
    @track deleteShowModal = false;
    @track CaseObj;
    refreshTable;
    @track loaded;
    caseValidationCreation = {};// field used for validation
    @track errorMsg;
    @track error;
    subjectValue = '';
    descriptionValue = '';
    createdCaseId ;
    createdCaseNumber;
    accountId;



    
    closeModal(event) {
  
        // to close modal set isModalOpen tarck value as false
        this.handleResetForm();
        this.bShowModal = false;
        this.isModalOpen = false;
        this.deleteShowModal = false;   
     
    }

   
 
    @wire(getAllMyCases)
    cons(result) {
        this.refreshTable = result;
        if(result.data){
            this.CaseObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            console.log('this is the audit data'+JSON.stringify(result));
         
            resp.forEach(item => item['caseUrl'] = '/case/' +item['Id']);
            this.CaseObj = resp;
           }
        if (result.error) {
            this.CaseObj = undefined;
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
       // var accName = data[0].Name;
      //  this.AccountName = accName;
        var accId = data[0].Id;
      this.accountId= accId;

        this.error = undefined;
    } else if (error) {
        this.error = error;
      //  this.contacts = undefined;
    }

};
    
handleResetForm(){
      
  
    this.template.querySelectorAll('.validate').forEach((input) => { input.value = ''; });
    
  
   }
 
 
   handleNewButton(event){
     this.subjectValue = '';
     this.descriptionValue = '';
     this.isModalOpen = true;
     console.log('new button clicked');
 }
 
 
 
 CaseHandleChange(event){
 
   if(event.target.name == 'Subject'){
    this.subjectValue  = event.target.value;  
   }
 
   if(event.target.name == 'Description'){
    this.descriptionValue  = event.target.value;  
   }
 
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
         this.caseValidationCreation[inputField.name] = inputField.value;
     });
     return isValid;
 }
 
 
 
       //handling save button in popup modal 

   handleSave(){
   
    //section to create location from apex method
    if(this.isInputValid()) {
       
       console.log('good to go buddy');
       this.loaded=true;
       
       createCase({theAccountId : this.accountId ,theDescription:this.descriptionValue ,theSubject : this.subjectValue })
      .then(result=>{
        this.createdCaseId = result.Id;
        this.createdCaseNumber = result.CaseNumber;
        this.loaded =false;
        console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.createdCaseNumber );
        this.isModalOpen = false;
        const toastEvent = new ShowToastEvent({
            title:'CASE  "'  +  this.createdCaseNumber + '" was created.',
            message: '',
            variant:'success'
          });
          this.dispatchEvent(toastEvent);
   
         return refreshApex(this.refreshTable);
   
    })
    .catch(error =>{
       this.errorMsg=error.message;
       window.console.log(this.error);
       console.log('this is ERROR '+JSON.stringify(this.error));

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
     
     createCase({theAccountId : this.accountId, theDescription:this.descriptionValue ,theSubject : this.subjectValue })
     .then(result=>{
       this.createdCaseId = result.Id;
       this.createdCaseNumber = result.CaseNumber;
      this.loaded =false;
      console.log('the created result id and CapaTitle__c  ==>'+result.Id + ' this name ==>'+ result.createdCaseNumber  );
      const toastEvent = new ShowToastEvent({
          title:'CASE  "'  +  this.createdCaseNumber + '" was created.',
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