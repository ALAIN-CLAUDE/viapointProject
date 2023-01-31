import { LightningElement,api,track,wire } from 'lwc';

//apex class import
import getAuditActivityResources from '@salesforce/apex/AuditActivityResourceAuditController.getAuditActivityResources';
import getAuditResources from '@salesforce/apex/AuditActivityResourceAuditController.getAuditResources';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getAuditActivity from '@salesforce/apex/AuditActivityResourceAuditController.getAuditActivity';
import getUserDetails from '@salesforce/apex/AuditActivityResourceAuditController.getUserDetails';
import Id from '@salesforce/user/Id';
import delSelectedAudAct from '@salesforce/apex/AuditActivityResourceAuditController.delSelectedAudAct';
import createAuditActivResource from '@salesforce/apex/AuditActivityResourceAuditController.createAuditActivResource';
import Audit_Number_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditNumber__c';


const actions = [
    { label: 'Edit', name: 'edit'}, 
    { label: 'Delete', name: 'delete'}
];



const columns = [
{ label: 'Audit Activity Resource Number', fieldName: 'audActResLink', type: 'url',
            typeAttributes:{label:{fieldName: 'Name'},target:'_blank'} },
{ 
                label: 'Audit Title', 
                fieldName: 'AuditUrl',
                type: 'url',
                typeAttributes: {label: { fieldName: 'AuditTitle__c' }, target : '_blank'
                } 
 },     

{ label: 'Audit Activity Number', fieldName: 'audActNumbLink', type: 'url',
            typeAttributes:{label:{fieldName: 'AuditActivity__c'},target:'_blank'} },   
{
                label: 'Activity Planned Start',
                fieldName: 'ActivityPlannedStart__c',
                type: 'Date',
                typeAttributes:{
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                    hour12:"true"
                }
             
              
}, 
{
    label: 'Activity Planned Finish',
    fieldName: 'ActivityPlannedFinish__c',
    type: "Date",
        typeAttributes:{
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
            hour12:"true",
        }
   
   
}, 

{ 
    label: 'Resource Title', 
    fieldName: 'ResourceUrl',
    type: 'url',
    typeAttributes: {label: { fieldName: 'ResourceTitle__c' }, target : '_blank'
    } 
},
{
    label: 'Resource Type',
    fieldName: 'ResourceType__c',
    type: 'Text',
   
},
{
    label: 'Request Allocation Method',
    fieldName: 'RequestAllocationMethod__c',
    type: 'Text',
   
},
{
    label: 'Request Allocation Units',
    fieldName: 'RequestAllocationUnits__c',
    type: 'Number',
   
},
{
    label: 'Audit Activity Resource Workflow Status',
    fieldName: 'ActivityResourceWorkflowStatus__c',
    type: 'Picklist',
    
},
{
    type: 'action',
    typeAttributes: { rowActions: actions },
},

];
export default class RelatedListView extends LightningElement {
    @api recordId;
    AuditNumberFIELD= Audit_Number_FIELD;
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
    //value = '';
    AuditActivityResources;
    @track showLoading = false;
    // non-reactive variables
    selectedRecords = [];
    refreshTable;
    error;
    //AuditActivityName='';
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
    @track currentAuditActivityLink;
    @track PlanStart ;
    @track UserError;
    @track user;
    userId = Id;
    @track UserProfilePics;
    @track UserTimeZone;
    @track UserTZLocale;
    

    navitageToLWCWithoutAura(event) {
        event.preventDefault();
        let componentDef = {
            componentDef: "c:relatedListView",
            attributes: {
                recordId: this.recordId
            }
        };
        // Encode the componentDefinition JS object to Base64 format to make it url addressable
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedComponentDef
            }
        });
    }
////get User Details

@wire(getUserDetails, {recId: '$userId'})
wiredUser(Userdata) {

    this.Userdata = Userdata;

    const { data, error } = Userdata;

    console.log('wiredUser: '+  JSON.stringify(Userdata));

    if (data) {
     this.user = data;

    } else if (error) {

        this.UserError = error;

    }
}

 // retrieving the data using wire service
 @wire(getAuditActivityResources, {auditActivityId: '$recordId' , isViewAll: true})
 wiredAudActRes(refreshTable) {
     
          this.refreshTable = refreshTable;
          this.data  = null;
          this.AuditActivityResourceCount = 0;
          const { data, error } = refreshTable; // destructure it for convenience
          if (data) { 
             console.log('thius is the data ====>' + data);
           this.AuditActivityResources = data;
          
           let audActResList = [];

           let baseUrl = 'https://'+location.host+'/';
           //loop through the list of contacts and assign an icon based on the rating
           this.AuditActivityResources.forEach(record => {
               //copy the details in record object to contactObj object
               let audActResObj = {...record};
                               /* Prepare the Org Host */
              this.createdbyUserId = audActResObj.CreatedById;
              this.createdbyUserName = audActResObj.OwnerName__c;
              this.modifiedbyName = audActResObj.modifiedbyName__c;
              this.modifiedbyName = audActResObj.modifiedbyName__c;
              this.CreatedDate = audActResObj.CreatedDate;
              this.LastModifiedDate = audActResObj.LastModifiedDate;
        
              this.UserTimeZone = audActResObj.UserTimeZone__c;
              this.UserTZLocale = audActResObj.UserLocale__c;

              this.UserProfilePics = this.user[0]["SmallPhotoUrl"];
              
              console.log('this userId ====>' + audActResObj.CreatedById); 
              console.log('UserTimeZone ====>' + audActResObj.UserTimeZone__c);
              console.log('UserTZLocale ====>' + audActResObj.UserLocale__c); 
                    
              
              console.log('Activity_Planned_Start__c = '+audActResObj.ActivityPlannedStart__c);
              if(audActResObj.ActivityPlannedStart__c) {

                // adjustments made
                var ulocale = audActResObj.UserLocale__c.replaceAll("_","-");
                var tz_datetime_str = new Date(audActResObj.ActivityPlannedStart__c).toLocaleString(ulocale, { timeZone: audActResObj.UserTimeZone__c , day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit', minute:'2-digit'});
               audActResObj.ActivityPlannedStart__c = tz_datetime_str.toUpperCase();
                console.log('Activity_Planned_Start__c with TZ: '+tz_datetime_str);

             }
               
             if(audActResObj.ActivityPlannedFinish__c) {

                // adjustments made 
                var ulocale = audActResObj.UserLocale__c.replaceAll("_","-");
                var tz_datetime_str = new Date(audActResObj.ActivityPlannedFinish__c).toLocaleString(ulocale, { timeZone: audActResObj.UserTimeZone__c , day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit', minute:'2-digit'});
                audActResObj.ActivityPlannedFinish__c = tz_datetime_str.toUpperCase();
                console.log('Activity_Planned_Finish__c with TZ: '+tz_datetime_str);
                
             }
   
             
            
               if(audActResObj.AuditResource__c){
                   audActResObj.ResourceTitle__c =  audActResObj.AuditResource__r.AuditResourceTitle__c ;
                     /* Prepare Audit Resource Detail Page Url */
                    audActResObj.ResourceUrl = baseUrl+audActResObj.AuditResource__r.Resource__c;

                    audActResObj.AuditTitle__c =  audActResObj.AuditTitleLinkless__c ;

                    audActResObj.AuditUrl = baseUrl+audActResObj.AuditResource__r.Audit__c ;
                   
                     
               }
               if(audActResObj.AuditActivity__r.AuditActivityResourceCount__c > 6){
                this.AuditActivityResourceCount = '6+'
                console.log('total record=='+  this.AuditActivityResourceCount)
            }else if(audActResObj.AuditActivity__r.AuditActivityResourceCount__c <=6 || audActResObj.AuditActivity__r.AuditActivityResourceCount__c >=1 ){
             this.AuditActivityResourceCount = audActResObj.AuditActivity__r.AuditActivityResourceCount__c;
            }
             else if(audActResObj.AuditActivity__r.AuditActivityResourceCount__c < 1){
                this.AuditActivityResourceCount = '0';
            }

               audActResObj['audActResLink'] = '/lightning/r/AuditActivity__c/' + record.Id +'/view';
               audActResObj.AuditActivity__c = audActResObj.AuditActivity__r.Name;
               audActResObj['audActNumbLink'] = '/lightning/r/AuditActivity__c/' + this.recordId +'/view';
               audActResList.push(audActResObj);
           });
           this.data = audActResList;
          
          console.log('thius is the process data ====>' + JSON.stringify(audActResList)); 
     }
   }



      

      @wire(getAuditActivity, {auditActivityId: '$recordId'})
  wiredAudAct(result) {
          if (result.data) {
            let AudActName= result.data[0].Name;
            console.log('audit activity name == > '+ AudActName);
            this.AuditActivityName = AudActName;
           
            console.log('total record=='+  this.AuditActivityResourceCount)
           if(result.data[0].Audit__c){
            let audId = result.data[0].Audit__c;
            this.AuditId = audId;
            let audactivId = result.data[0].Id;
            this.currentAudActId = audactivId;
            
         
           this.ViewAllUrlRelatedList ='/lightning/r/AuditActivity__c/'+audactivId+'/related/AuditActivityResources__r/view';
           this.currentAuditActivityLink = '/lightning/r/AuditActivity__c/' + audactivId +'/view';
              // this.AudActdata = result.data;
               this.error = undefined;
               console.log(result.data);
               console.log(audId);
             console.log( 'this is secod id '+ this.AuditId);
           }else{
               console.log('No valid ids');
           }
  
          }else if (result.error) {
              this.error = result.error;
              this.data = undefined;
          }
      }
  
    
  

handleRowActions(event) {
    let actionName = event.detail.action.name;

    window.console.log('actionName ====> ' + actionName);

    let row = event.detail.row;

    window.console.log('row ====> ' + row);
    // eslint-disable-next-line default-case
    switch (actionName) {
        case 'record_details':
            this.viewCurrentRecord(row);
            break;
        case 'edit':
            this.editCurrentRecord(row);
            break;
        case 'delete':
            this.delAudActRes(row);
            break;
    }
}


   // view the current record details
   viewCurrentRecord(currentRow) {
    this.bShowModal = true;
    this.isEditForm = false;
    this.record = currentRow;
}


editCurrentRecord(currentRow) {
    // open modal box
    this.bShowModal = true;
    this.isEditForm = true;

    // assign record id to the record edit form
    this.currentRecordId = currentRow.Id;
    this.currentRecordName = currentRow.Name;
}

delAudActRes(currentRow) {
    this.deleteShowModal = true;
 
    let currentRecord = [];
    currentRecord.push(currentRow.Id);
    this.selectedRow = currentRecord;
    let currentRecordName = [];
    currentRecordName.push(currentRow.Name);
    this.selectedRowName = currentRecordName;


}

DeleteRecord(event){
    console.log('delete button was clicked from modale');
    console.log('this is selected row id ==> '+this.selectedRow);
  
    let currentRecord = this.selectedRow;
  
    // calling apex class method to delete the selected Audit Activity Resource
    delSelectedAudAct({lstAudActResIds: currentRecord})
    .then(result => {
        window.console.log('result ====> ' + result);
        this.showLoadingSpinner = false;
  
        // showing success message
        this.dispatchEvent(new ShowToastEvent({
            title:'Audit Activity Resource "'  +  this.selectedRowName  + '" was deleted.',
            message:'',
            variant: 'success'
        }),);
        this.deleteShowModal = false;
        eval("$A.get('e.force:refreshView').fire();");
        // refreshing table data using refresh apex
        return refreshApex(this.refreshTable);
       
        
    })
    .catch(error => {
        window.console.log('Error ====> '+error);
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error!!', 
            message: error.message, 
            variant: 'error'
        }),);
    });
  
    
    }
  
  

// handleing record edit form submit
handleSubmitButtonClick(event){      
    this.loaded=true;
    event.preventDefault(); 
    this.template.querySelector('lightning-record-edit-form').submit();

 
  // closing modal
  this.bShowModal = false;
 
  // showing success message
  this.dispatchEvent(new ShowToastEvent({
      title:'Audit Activity Resource "'  +  this.currentRecordName  + '" was saved.',
      message: '',
      variant: 'success'
  })
  ,);
  this.loaded=false;
  return refreshApex(this.refreshTable);
  

 }

 get dataLength(){
     return (this.data)?this.data.length : 0;
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
      title:'Audit Activity Resource "'  +  this.currentRecordName  + '" was saved.',
      message: '',
      variant: 'success'
  }),);
  this.handleNewButton(event);
 }

 
 

  // refreshing the datatable after record edit form success
    handleSuccess() {
      return refreshApex(this.refreshTable);
  }


  closeModal(event) {
  
    // to close modal set isModalOpen tarck value as false
    this.handleResetForm();
    this.bShowModal = false;
    this.isModalOpen = false;
    this.deleteShowModal = false;
   
      // refreshing table data using refresh apex
     eval("$A.get('e.force:refreshView').fire();");
 

 
}


submitDetails() {
    // to close modal set isModalOpen tarck value as false
    //Add your code to call apex method or do some processing
    this.isModalOpen = false;
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

async handleNewButton(event){

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
      await getAuditResources({auditId:this.AuditId} )
       .then(result => {
           if(result){
            console.log('This is new result '+ result);
               var audResData = JSON.stringify(result);
               console.log('this is na stringaayyy'  + audResData );



        let Dataforloop = JSON.parse(audResData);

        this.items = [];

        for(let i=0; i<Dataforloop.length; i++)  {

            const option = {
                label : Dataforloop[i].Resource__r.Name,
                value: Dataforloop[i].Id
            };
         
                this.items = [...this.items ,option ]; 
            
            console.log(this.items);                                  
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


 //handling save button in popup modal 

 handleSave(){
this.loaded=true;
 //section to create audit resource from apex method
 if(this.isInputValid()) {
    
 
 createAuditActivResource({theAuditId: this.AuditId,theAuditActivityId :this.currentAudActId ,theAuditResourceId:this.auditResourceId ,RequestAllocationMethod :  this.reqAlloMethValue, RequestAllocationUnits: this.RequestAllocationUnitsvalue, RequestDescription:this.RequestDescripValue,WorkflowStatus:this.audActResWorkStatValue})
 .then(result=>{
     this.AudActResRecoreId = result.Id;
     this.createdauditActResName= result.Name;
     this.loaded =false;
     console.log('the created result id and name ==>'+result.Id + ' this name ==>'+ result.name );
     this.isModalOpen = false;
     const toastEvent = new ShowToastEvent({
         title:'Audit Activity Resource "'  +  this.createdauditActResName + '" was created.',
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