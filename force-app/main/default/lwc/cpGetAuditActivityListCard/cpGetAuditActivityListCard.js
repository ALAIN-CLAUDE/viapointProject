import { LightningElement,wire,track } from 'lwc';
import getAllAuditActivities from '@salesforce/apex/cpGetAuditActivityList.getAllAuditActivities';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getUserDetails from '@salesforce/apex/cpGetAuditActivityList.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const columns = [
 
    {
        label: 'Audit Activity Number', fieldName: 'auditUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }
        }
    },
    {
        label: 'Title',
        fieldName: 'AuditActivityTitle__c',
        type: 'text',
        editable: true,
    }, {
        label: 'Assigned To',
        fieldName: 'AssignedTo__c',
        type: 'text',
        editable: true,
    }, {
        label: 'Status',
        fieldName: 'AuditActivityWorkflowStatus__c',
        type: 'text',
        editable: true,
    }
    , {
      label: 'Start',
      fieldName: 'PlannedStart__c',
      type: "Date",
      typeAttributes:{
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
          hour12:"true",
      }
  }, {
      label: 'Finish',
      fieldName: 'PlannedFinish__c',
      type: "Date",
      typeAttributes:{
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
          hour12:"true",
      }
  }
    
];

export default class CpGetAuditActivityListCard extends LightningElement {

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
  wiredUser(Userdata) {

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

 

  @wire(getAllAuditActivities)
  cons(result) {
      this.wiredAudittResult = result;
      if(result.data){
      this.audObj = result.data;
   //   this.LeadAuditorId = result.data.LeadAuditorInternal__c;
      let resp  = JSON.parse(JSON.stringify(result.data))
      console.log('this is the audit data'+JSON.stringify(result));
        
      let audActList = [];
      this.audObj.forEach(record => {
        //copy the details in record object to contactObj object
        let audActObj1 = {...record};
                        /* Prepare the Org Host */
         audActObj1.auditUrl =  '/auditresource/' +audActObj1.Id;
       console.log('UserTimeZone ====>' + audActObj1.UserTimeZone__c);
       console.log('UserTZLocale ====>' + audActObj1.UserLocale__c); 

       
       if(audActObj1.AuditActivityWorkflowStatus__c =='Draft')
       audActObj1.styleColor = "border-top:5px solid #00af66";
       else if(audActObj1.AuditActivityWorkflowStatus__c =='Baselined')
       audActObj1.styleColor = "border-top:5px solid #00af66";
       else if(audActObj1.AuditActivityWorkflowStatus__c =='Not Started')
       audActObj1.styleColor = "border-top:5px solid #00af66";
       else if(audActObj1.AuditActivityWorkflowStatus__c =='In Progress')
       audActObj1.styleColor = "border-top:5px solid #00af66";
       else if(audActObj1.AuditActivityWorkflowStatus__c =='Completed')
       audActObj1.styleColor = "border-top:5px solid #0078d4";
       else if(audActObj1.AuditActivityWorkflowStatus__c =='Cancelled')
       audActObj1.styleColor = "border-top:5px solid #f22613";

             
       
       console.log('Activity_Planned_Start__c = '+audActObj1.PlannedStart__c);
       if(audActObj1.PlannedStart__c) {

         // adjustments made
         var ulocale = audActObj1.UserLocale__c.replaceAll("_","-");
         var tz_datetime_str = new Date(audActObj1.PlannedStart__c).toLocaleString(ulocale, { timeZone: audActObj1.UserTimeZone__c , day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit', minute:'2-digit'});
        audActObj1.PlannedStart__c = tz_datetime_str.toUpperCase();
         console.log('Activity_Planned_Start__c with TZ: '+tz_datetime_str);

      }
        
      if(audActObj1.PlannedFinish__c) {

         // adjustments made 
         var ulocale = audActObj1.UserLocale__c.replaceAll("_","-");
         var tz_datetime_str = new Date(audActObj1.PlannedFinish__c).toLocaleString(ulocale, { timeZone: audActObj1.UserTimeZone__c , day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit', minute:'2-digit'});
         audActObj1.PlannedFinish__c = tz_datetime_str.toUpperCase();
         console.log('Activity_Planned_Finish__c with TZ: '+tz_datetime_str);
         
      }
       
        audActList.push(audActObj1);
    });
    this.audObj  = audActList;

      if (result.error) {
          this.audObj = undefined;
      }
  }};

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