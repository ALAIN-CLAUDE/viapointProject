import { LightningElement,wire,track } from 'lwc';
import getOrgAudits from '@salesforce/apex/cpGetAuditList.getOrgAudits';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getUserDetails from '@salesforce/apex/cpGetAuditList.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const columns = [
 
    {
        label: 'Audit Number', fieldName: 'auditUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }
        }
    },
    {
        label: 'Title',
        fieldName: 'AuditTitle__c',
        type: 'text',
        editable: true,
    }, {
        label: 'Lead Auditor ',
        fieldName: 'LeadAuditorInternalName__c',
        type: 'text',
        editable: true,
    }, {
        label: 'Status',
        fieldName: 'AuditWorkflowStatus__c',
        type: 'text',
        editable: true,
    }
    
];

export default class CpGetAuditList extends LightningElement {

    
    columns = columns;
    @track audObj;
    fldsItemValues = [];
    isEdit = false;
    editRecordId='';
    wiredAudittResult;
    LeadAuditorId;
    UserProfilePicsUrl;
    Userdata;


    
    @wire(getUserDetails)
    constUser(Userdata) {

        this.Userdata = Userdata;

        const { data, error } = Userdata;

        console.log('the wiredUser: '+  JSON.stringify(Userdata));

        if (data) {
         this.user = data;
         this.UserProfilePicsUrl = data[0]["SmallPhotoUrl"];
         console.log('the wiredUser url: '+ this.UserProfilePicsUrl);

        } else if (error) {

            this.UserError = error;

        }
    }

   

    @wire(getOrgAudits)
    cons(result) {
        this.wiredAudittResult = result;
        if(result.data){
        this.audObj = result.data;
        this.LeadAuditorId = result.data.LeadAuditorInternal__c;
        let resp  = JSON.parse(JSON.stringify(result.data))
        console.log('this is the audit data'+JSON.stringify(result));
     
        resp= resp.map(e => {
            
            e.auditUrl =  '/auditresource/' +e.Id;
            if(e.AuditWorkflowStatus__c =='Open')
            e.styleColor = "border-top:5px solid #00af66";
            else if(e.AuditWorkflowStatus__c =='Execution')
            e.styleColor = "border-top:5px solid #00af66";
            else if(e.AuditWorkflowStatus__c =='Planning')
            e.styleColor = "border-top:5px solid #00af66";
            else if(e.AuditWorkflowStatus__c =='Review')
            e.styleColor = "border-top:5px solid #00af66";
            else if(e.AuditWorkflowStatus__c =='Report')
            e.styleColor = "border-top:5px solid #00af66";
            else if(e.AuditWorkflowStatus__c =='Approval')
            e.styleColor = "border-top:5px solid #00af66";
            else if(e.AuditWorkflowStatus__c =='Closed')
            e.styleColor = "border-top:5px solid #0078d4";
            return e;
       });
       this.audObj = resp;
    }
   
        if (result.error) {
            this.audObj = undefined;
        }
    };

    handleMenuSelect(event) {
        // retrieve the selected item's value
        this.editRecordId = event.currentTarget.name;
        const selectedItemValue = event.detail.value;
        if(selectedItemValue=='Edit'){
            this.isEdit =true;
           
        }
        else
       {
       this.delete(event);
       }
       
    }
    delete(event) {
        deleteRecord(this.editRecordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredAudittResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    closeModal(){
        this.isEdit =false;
    }

}