import { LightningElement, api, wire, track } from 'lwc';


    //apex class import and methods
    import getAuditActivityResources from '@salesforce/apex/AuditActivityResourceAuditController.getAuditActivityResources';
    import getAuditResources from '@salesforce/apex/AuditActivityResourceAuditController.getAuditResources';
    import {refreshApex} from '@salesforce/apex';
    import {ShowToastEvent} from 'lightning/platformShowToastEvent';
    import getAuditActivity from '@salesforce/apex/AuditActivityResourceAuditController.getAuditActivity';
    import delSelectedAudAct from '@salesforce/apex/AuditActivityResourceAuditController.delSelectedAudAct';
    import createAuditActivResource from '@salesforce/apex/AuditActivityResourceAuditController.createAuditActivResource';
    import datatablelwc from '@salesforce/resourceUrl/datatablelwc'
    import { loadStyle } from 'lightning/platformResourceLoader';
    import Audit_Number_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditNumber__c';
    //import fetchUserDetail from '@salesforce/apex/AuditActivityResourceAuditController.fetchUserDetail';
    import { NavigationMixin } from 'lightning/navigation';
    import { publish,subscribe, MessageContext } from "lightning/messageService";
    import AUDIT_UPDATE from "@salesforce/messageChannel/DataUpdate__c";
    
    // Actions for datatable action buttons
    const actions = [
        { label: 'Edit', name: 'edit'}, 
        { label: 'Delete', name: 'delete'}
    ];
    
    
    // Columns for datatable
    const columns = [
       
    
    { label: 'Audit Activity Resource Number', fieldName: 'audActResLink', type: 'url',
                typeAttributes:{label:{fieldName: 'Name'},target:'_blank'} },
    
    { 
        label: 'Resource Title', 
        fieldName: 'ResourceUrl',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Resource_Title__c' }, target : '_blank'
        } 
    },
    {
        label: 'Resource Type',
        fieldName: 'Resource_Type__c',
        type: 'Text',
       
    },
    {
        label: 'Audit Activity Resource Workflow Status',
        fieldName: 'Workflow_Status__c',
        type: 'Picklist',
        
    },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
    
    ];
    
    let i=0;
    export default class OverrideNewActivityResourceLwc extends NavigationMixin(LightningElement) {
        AuditNumberFIELD= Audit_Number_FIELD;
        @api recordId;
    
        //track all input fields values
        @track chosenValue = '';
        @track reqAlloMethValue='';
        @track audActResWorkStatValue='';
        @track RequestAllocationUnitsvalue;
        @track RequestDescripValue;
        @track AudActResRecoreId;
        @track auditResourceId;
        @track errorMsg;
        
    
        
    
       
        @track data;
        @track selectedRow ;
        @track selectedRowName;
        @track deleteShowModal = false;
        @track bShowModal = false;
        @track currentRecordId;
        @track isEditForm = false;
        @track showLoadingSpinner = false;
        @track columns = columns;
        @track error;
        @api AuditId;
        @track currentAudActId;
        @track AuditResources;
        @track items = []; //this will hold key, value pair
        @track value = ''; //initialize combo box value
        resetpage = false;
        redirect = true;
        @track isModalOpen = false;
        AuditActivityResources;
        @track showLoading = false;
        selectedRecords = [];
        refreshTable; // used to refresh datatable
        error;
        @track AuditActivityName ;
        @track AuditActivityResourceCount ='0';
        @track  createdauditActResName;
        AuditActResCreation = {};// field used for validation
        @track currentRecordName;
        @track SmallPhotoUrl;
        @track loaded;
        @track userName
        @track createdbyUserId;
        @track createdbyUserName;
        @track modifiedbyName;
        @track CreatedDate;
        @track LastModifiedDate;
        @track ViewAllUrlRelatedList;
    @api actionName= 'new';


        connectedCallback() {
            if( this.actionName== 'new')
            this.handleNewButton();
            else
            this.editCurrentRecord()
         
        }
    
    //this is supposed to be used to display current user img or avatar on page but doesnt quite work yet
        get imgSrc(){
            
            return "https://images.unsplash.com/photo-1632153575104-202cce0e662e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
           // return "https://www.gravatar.com/avatar/"+this.emailHash+"?s="+this.size;
           //return this.SmallPhotoUrl
        }
    
       
    
    
          @wire(getAuditActivity, {auditActivityId: '$recordId'})
      wiredAudAct(result) {
              if (result.data) {
                let AudActName= result.data[0].Name;
                this.AuditActivityName = AudActName;
    
               if(result.data[0].Audit__c){
                let audId = result.data[0].Audit__c;
                this.AuditId = audId;
                let audactivId = result.data[0].Id;
                this.currentAudActId = audactivId;
               this.ViewAllUrlRelatedList ='/lightning/r/Audit_Activity__c/'+audactivId+'/related/AuditActivityResources__r/view';
        
                   this.error = undefined;
               }
      
              }else if (result.error) {
                  this.error = result.error;
              }
          }
      

    editCurrentRecord() {
        // open modal box
        this.bShowModal = true;
        this.isEditForm = true;
    
        // assign record id to the record edit form
        this.currentRecordId = this.recordId;
        this.currentRecordName = 'Test';
    }
    
    
    
    // handling record edit form submit
    handleSubmitButtonClick(event){      
        this.loaded=true;
        event.preventDefault(); 
        this.template.querySelector('lightning-record-edit-form').submit();
        
        // closing modal
        this.bShowModal = false;
        
        // showing success message
        this.dispatchEvent(new ShowToastEvent({
          title: 'Audit Activity Resource "'  +  this.currentRecordName  + '" was saved.',
          message: '',
          variant: 'success'
      })
      ,);
       this.loaded=false;
       this.publishAuditUpdate();
       return refreshApex(this.refreshTable);
      
    
     }
    
    
     // handleing record edit form submit
     handleSubmitAndNew(event){      
        this.showLoading = true;
        event.preventDefault(); 
        this.template.querySelector('lightning-record-edit-form').submit();
        
        // closing modal
        this.bShowModal = false;
        
        // showing success message
        this.dispatchEvent(new ShowToastEvent({
          title: 'Audit Activity Resource "'  +  this.currentRecordName  + '" was saved.',
          message: '',
          variant: 'success'
      }),);
      this.handleNewButton(event);
     }
    
     // refreshing the datatable after record edit form success
        handleSuccess() {
            this.publishAuditUpdate();
          return refreshApex(this.refreshTable);
      }
    
      handleResourceSelection(event){
        console.log("the selected record id is"+event.detail);
    }
    closeModal(event) {
      
        // to close modal set isModalOpen tarck value as false
        /*this.handleResetForm();
        this.bShowModal = false;
        this.isModalOpen = false;
        this.deleteShowModal = false;*/
        const value = this.recordId;
        const valueChangeEvent = new CustomEvent("closemodal", {
          detail: { value }
        });
        this.dispatchEvent(valueChangeEvent);
    }
    
    
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.handleClose();
    }
    
    //options for request allocation method picklist
    get ReqAllMethodoptions() {
        return [
            { label: 'FTE %', value: 'FTE %' },
            { label: 'Hours', value: 'Hours' },
        ];
    }
    
    //onchange for request allocation method picklist
    ReqAlloMethandleChange(event){
        this.reqAlloMethValue = event.detail.value;
    }
    
    
    //options for Audit Activity Resource Workflow Status picklist
    get audActResWorkStatoptions() {
        return [
            { label: '--None--', value: 'None' },
            { label: 'Draft', value: 'Draft' },
            { label: 'Proposed', value: 'Proposed' },
            { label: 'Allocated', value: 'Allocated' },  
            { label: 'Rejected', value: 'Rejected' },
            { label: 'Cancelled', value: 'Cancelled' },
        ];
    }
    
    
    
    //onchange for  Audit Activity Resource Workflow Status picklist
    audActResWorkStathandleChange(event){
        this.audActResWorkStatValue = event.detail.value;
    }
    
    
    handleResetForm(){
          
       this.template.querySelectorAll('.validate').forEach((input) => { input.value = ''; });
      }
    
    handleNewButton(){
    
        this.handleResetForm();
        this.value='';
        this.reqAlloMethValue='';
        this.RequestAllocationUnitsvalue='';
        this.RequestDescripValue='';
        this.audActResWorkStatValue='';
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
        console.log('should reset form now');
       
       if(this.AuditId){
           getAuditResources({auditId:this.AuditId} )
           .then(result => {
               if(result){
                   var audResData = JSON.stringify(result);                    
                   let Dataforloop = JSON.parse(audResData);
                   
                   this.items = [];
                   
                   for(i=0; i<Dataforloop.length; i++)  {
                       
                    const option = {
                    label : Dataforloop[i].Resource__r.Name,
                    value: Dataforloop[i].Id
                };
    
                    this.items = [...this.items ,option ];                                
            }     
            
               }else{
                   console.log('no result.data found');
               }
           })
           .catch(error => {
               this.error = error;
           });
       }else{
           console.log('maybe no Resources objects');
       }
     }

    get Resoptions() {
        return this.items;
    }

    newAudActReshandleChange(event){
        const selectedOption = event.detail.value;
        console.log('selected value=' + selectedOption);
        this.chosenValue = selectedOption;
        if(event.target.name == 'Resource'){
        this.auditResourceId = selectedOption;
        }
      if(event.target.name == 'Request Allocation Method'){
        this.reqAlloMethValue = event.target.value;  
      }
    
      if(event.target.name == 'Audit Activity Resource Workflow Status'){
        this.audActResWorkStatValue = event.target.value;  
      }
      if(event.target.name == 'Request Allocation Units'){
        this.RequestAllocationUnitsvalue = event.target.value;  
      }
      if(event.target.name == 'Request Description'){
        this.RequestDescripValue = event.target.value;  
    
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
                this.AuditActResCreation[inputField.name] = inputField.value;
            });
            return isValid;
        }
    
    
    handleSave(){
    this.loaded=true;
     /////////////////section to create audit resource from apex method
     if(this.isInputValid()) {
     createAuditActivResource({theAuditId: this.AuditId,theAuditActivityId :this.currentAudActId ,theAuditResourceId:this.auditResourceId ,RequestAllocationMethod :  this.reqAlloMethValue, RequestAllocationUnits: this.RequestAllocationUnitsvalue, RequestDescription:this.RequestDescripValue,WorkflowStatus:this.audActResWorkStatValue})
     .then(result=>{
         this.AudActResRecoreId = result.Id;
         this.createdauditActResName= result.Name;
         this.loaded =false;
         console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.name );
         this.isModalOpen = false;
         const toastEvent = new ShowToastEvent({
             title: 'Audit Activity Resource "'  +  this.createdauditActResName + '" was created.',
             message: '',
             variant:'success'
           });
           this.dispatchEvent(toastEvent);
           this.publishAuditUpdate();
          return refreshApex(this.refreshTable);
    
     })
     .catch(error =>{
        this.errorMsg=error.message;
        window.console.log(this.error);
     });
    
     
     
     }else{
    
     }
    }
     handleSaveForSaveAndNew(){
        this.loaded=true;
     createAuditActivResource({theAuditId: this.AuditId,theAuditActivityId :this.currentAudActId ,theAuditResourceId:this.auditResourceId ,RequestAllocationMethod :  this.reqAlloMethValue, RequestAllocationUnits: this.RequestAllocationUnitsvalue, RequestDescription:this.RequestDescripValue,WorkflowStatus:this.audActResWorkStatValue})
     .then(result=>{
         this.AudActResRecoreId = result.Id;
         this.createdauditActResName = result.Name;
         this.loaded=false;
         //this.isModalOpen = false;
         const toastEvent = new ShowToastEvent({
             title:'Audit Activity Resource "'  +  this.createdauditActResName + '" was created.',
             message: '',
             variant:'success'
           });
           this.dispatchEvent(toastEvent);
    
           this.publishAuditUpdate();
           // refreshing table data using refresh apex
           return refreshApex(this.refreshTable);
    
    
     })
     .catch(error =>{
        this.errorMsg=error.message;
        window.console.log(this.error);
     });
    
     
     }
     handleSaveAndNew(){
       console.log('save and new was clicked ');
       this.handleSaveForSaveAndNew();
        this.handleResetForm();
     }
    

}