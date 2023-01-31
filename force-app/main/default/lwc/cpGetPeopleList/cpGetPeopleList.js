import { LightningElement,wire,track } from 'lwc';
import getOrgsPeople from '@salesforce/apex/cpGetPeopleList.getOrgsPeople';
import getLocationAccounts from '@salesforce/apex/cpGetDefaultInfo.getLocationAccounts';
import createPeople from '@salesforce/apex/cpGetPeopleList.createPeople';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [
    {
        label: 'First Name', fieldName: 'contactUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'FirstName'
            }
        }
    },
    {
        label: 'Last Name', fieldName: 'contactUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'LastName'
            }
        }
    },
   {
        label: 'Title',
        fieldName: 'Title',
        type: 'text',
      //  editable: true,
    }, {
        label: 'Email',
        fieldName: 'Email',
        type: 'text',
      //  editable: true,
    }
    
];
export default class CpGetPeopleList extends LightningElement {
    
    columns = columns;
    @track peopObj;
    @track isModalOpen = false;
    @track bShowModal = false;
    @track deleteShowModal = false;
    @track FirstNameValue = '';
    @track LastNameValue = '';
    @track TitleValue = '';
    @track PhoneValue = '';
    @track MobileValue  = '';
    @track EmailValue = '';
    AccountName;
    accountId;
    refreshTable;
    @track loaded;
    @track errorMsg;
    @track error;
    createdPeopleId ;
    createdPeopleName ;
    peopleValidationCreation = {};// field used for validation




    closeModal(event) {
  
        // to close modal set isModalOpen tarck value as false
        this.handleResetForm();
        this.bShowModal = false;
        this.isModalOpen = false;
        this.deleteShowModal = false;   
     
    }
 
    @wire(getOrgsPeople)
    cons(result) {
        this.refreshTable = result;
        if(result.data){
            this.peopObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            console.log('this is the contact data'+JSON.stringify(result));
         
            resp.forEach(item => item['contactUrl'] = '/contact/' +item['Id']);
            this.peopObj = resp;
           }
        if (result.error) {
            this.peopObj = undefined;
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
       
        this.FirstNameValue = '';
        this.LastNameValue = '';
        this.TitleValue = '';
        this.PhoneValue = '';
        this.MobileValue  = '';
        this.EmailValue = '';
        this.isModalOpen = true;
        console.log('new button clicked');
    }

    
locationhandleChange(event){

    if(event.target.name == 'First Name'){
      this.FirstNameValue = event.target.value;  
    }
  
    if(event.target.name == 'Last Name'){
      this.LastNameValue = event.target.value;  
    }
    if(event.target.name == 'Title'){
      this.TitleValue = event.target.value;  
    }

    if(event.target.name == 'Phone'){
        this.PhoneValue = event.target.value;  
      }
    if(event.target.name == 'Mobile'){
        this.MobileValue = event.target.value;  
      }
     
    if(event.target.name == 'Email'){
        this.EmailValue = event.target.value;  
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
        this.peopleValidationCreation[inputField.name] = inputField.value;
    });
    return isValid;
}


    //handling save button in popup modal 

handleSave(){
   
    //section to create location from apex method
    if(this.isInputValid()) {
       
       console.log('good to go buddy');
       this.loaded=true;
       
       createPeople({theAccountId: this.accountId, theLastName :this.LastNameValue, thefirstName:this.FirstNameValue ,thePhone :  this.PhoneValue,theEmail : this.EmailValue, theMobile :this.MobileValue})
    .then(result=>{
        this.createdPeopleId = result.Id;
        this.createdPeopleName = result.Name;
        this.loaded =false;
        console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.name );
        this.isModalOpen = false;
        const toastEvent = new ShowToastEvent({
            title:'Person "'  +  this.createdPeopleName + '" was created.',
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
     
     createPeople({theAccountId: this.accountId, theLastName :this.LastNameValue, thefirstName:this.FirstNameValue ,thePhone :  this.PhoneValue,theEmail : this.EmailValue})
  .then(result=>{
      this.createdPeopleId = result.Id;
      this.createdPeopleName = result.Name;
      this.loaded =false;
      console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.name );
      const toastEvent = new ShowToastEvent({
          title:'Person "'  +  this.createdPeopleName + '" was created.',
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