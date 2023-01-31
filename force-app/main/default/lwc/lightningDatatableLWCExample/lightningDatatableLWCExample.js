import { LightningElement,api,track,wire } from 'lwc';

//apex class import
import getAuditActivityResources from '@salesforce/apex/AuditActivityResourceAuditController.getAuditActivityResourcesTest';
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
                typeAttributes: {label: { fieldName: 'Audit_Title__c' }, target : '_blank'
                } 
 },     

{ label: 'Audit Activity Number', fieldName: 'audActNumbLink', type: 'url',
            typeAttributes:{label:{fieldName: 'Audit_Activity__c'},target:'_blank'} },   
{
                label: 'Activity Planned Start',
                fieldName: 'Activity_Planned_Start__c',
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
    fieldName: 'Activity_Planned_Finish__c',
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
    typeAttributes: {label: { fieldName: 'Resource_Title__c' }, target : '_blank'
    } 
},
{
    label: 'Resource Type',
    fieldName: 'Resource_Type__c',
    type: 'Text',
   
},
{
    label: 'Request Allocation Method',
    fieldName: 'Request_Allocation_Method__c',
    type: 'Text',
   
},
{
    label: 'Request Allocation Units',
    fieldName: 'Request_Allocation_Units__c',
    type: 'Number',
   
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
export default class LightningDatatableLWCExample extends LightningElement {
  
    

   
    @track data;
    @track selectedRow ;
    @track selectedRowName;
    
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
    @track currentAuditActivityLink;
    @track PlanStart ;
    @track UserError;
   
    @track UserProfilePics;
    @track UserTimeZone;
    @track UserTZLocale;

 
 
    @wire(getAuditActivityResources)
 wiredAudActRes(refreshTable) {
     
          this.refreshTable = refreshTable;
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
              
             
              this.UserTimeZone = audActResObj.UserTimeZone__c;
              this.UserTZLocale = audActResObj.User_Locale__c;

   
              
              console.log('this userId ====>' + audActResObj.CreatedById); 
              console.log('UserTimeZone ====>' + audActResObj.UserTimeZone__c);
              console.log('UserTZLocale ====>' + audActResObj.User_Locale__c); 


              function setTimezone(date, ianatz,localless) {
               var touchlocal = localless.replaceAll("_","-");
                var invdate = new Date(date.toLocaleString(touchlocal, {
                  timeZone: ianatz
                }));
                var diff = date.getTime() - invdate.getTime();  
                return new Date(date.getTime() - diff);
              }
              
              function addZero(i) {
                if (i < 10) {i = "0" + i}
                return i;
              }
/*
              function applyDateFormat(d) {
                var today = new Date(d);
                var dd = today.getDate();
                var mm = today.getMonth()+1;
                var yyyy = today.getFullYear();
                var hh = addZero(today.getHours());
                var min = addZero(today.getMinutes());
                var convHrs = "";
                var ampmSwitch = "";    
                ampmSwitch = (hh > 12)? "PM":"AM"; 
                convHrs = (hh >12)? hh-12:hh;
               
                var nDate = dd + '/' + mm + '/' + yyyy + ', ' + convHrs + ':' + min;
        
                return nDate + " " + ampmSwitch ;
              }

              
     */
              
             
              
              function applyDateFormat(d,userLocal) {

                console.log('d: '+d+', userLocal: '+userLocal);

                var touchlocal = userLocal.replaceAll("_","-");
                var dated = new Date(d);
                
               var  formattedDate = new Intl.DateTimeFormat(touchlocal).format(dated);
               var getTime = dated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

               var dreturn = formattedDate + ', '+ getTime.replace(/^0+/, '');
               console.log('dreturn: '+dreturn);
               
               return  dreturn;
              }
           
              console.log('Activity_Planned_Start__c = '+audActResObj.Activity_Planned_Start__c);

              if(audActResObj.Activity_Planned_Start__c) {

                var here = new Date(audActResObj.Activity_Planned_Start__c);
                var there = setTimezone(here, audActResObj.UserTimeZone__c,audActResObj.User_Locale__c); // set timezone here
                
                //audActResObj.Activity_Planned_Start__c = there.toString();

                //var nDate = applyDateFormat(there.toString(),audActResObj.User_Locale__c);

                //audActResObj.Activity_Planned_Start__c = nDate;

                //console.log('Here: '+here.toString()+' There: '+there.toString());    
                //console.log('USER TIMEZONE: '+audActResObj.UserTimeZone__c);
                //console.log(' User Time Zone ID = '+UserInfo.getTimeZone().getID());

                // added by wcs@fiverr
                var ulocale = audActResObj.User_Locale__c.replaceAll("_","-");
              //  var removeSeconds = new Date(audActResObj.Activity_Planned_Start__c).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                var tz_datetime_str = new Date(audActResObj.Activity_Planned_Start__c).toLocaleString(ulocale, { timeZone: audActResObj.UserTimeZone__c , day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit', minute:'2-digit'});
             //  var tz_datetime_str = removeSeconds.toLocaleString(ulocale, { timeZone: audActResObj.UserTimeZone__c }); 
               audActResObj.Activity_Planned_Start__c = tz_datetime_str;
                console.log('Activity_Planned_Start__c with TZ: '+tz_datetime_str);

             }
               
             if(audActResObj.Activity_Planned_Finish__c) {

                var here = new Date(audActResObj.Activity_Planned_Finish__c);
                var there = setTimezone(here, audActResObj.UserTimeZone__c,audActResObj.User_Locale__c); // set timezone here
                
                //audActResObj.Activity_Planned_Finish__c = there.toString();

                //var nDate = applyDateFormat(there.toString(),audActResObj.User_Locale__c);//there.toString();

                //audActResObj.Activity_Planned_Finish__c =  nDate ;

                //console.log('Here: '+here.toString()+' There: '+there.toString());    
                //console.log('USER TIMEZONE: '+audActResObj.UserTimeZone__c);
                //console.log(' User Time Zone ID = '+UserInfo.getTimeZone().getID());

                // adjustments made 
                var ulocale = audActResObj.User_Locale__c.replaceAll("_","-");
                var tz_datetime_str = new Date(audActResObj.Activity_Planned_Finish__c).toLocaleString(ulocale, { timeZone: audActResObj.UserTimeZone__c , day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit', minute:'2-digit'});
                audActResObj.Activity_Planned_Finish__c = tz_datetime_str;
                console.log('Activity_Planned_Finish__c with TZ: '+tz_datetime_str);
                
             }
   
             
            
               if(audActResObj.Audit_Resource__c){
                   audActResObj.Resource_Title__c =  audActResObj.Audit_Resource__r.Audit_Resource_Name__c ;
                     /* Prepare Audit Resource Detail Page Url */
                    audActResObj.ResourceUrl = baseUrl+audActResObj.Audit_Resource__r.Resource__c;

                    audActResObj.Audit_Title__c =  audActResObj.Audit_Title_Linkless__c ;

                    audActResObj.AuditUrl = baseUrl+audActResObj.Audit_Resource__r.Audit__c ;
                   
                     
               }
               if(audActResObj.Audit_Activity__r.Audit_Activity_Resource_Count__c > 6){
                this.AuditActivityResourceCount = '6+'
                console.log('total record=='+  this.AuditActivityResourceCount)
            }else if(audActResObj.Audit_Activity__r.Audit_Activity_Resource_Count__c <=6 || audActResObj.Audit_Activity__r.Audit_Activity_Resource_Count__c >=1 ){
             this.AuditActivityResourceCount = audActResObj.Audit_Activity__r.Audit_Activity_Resource_Count__c;
            }
             else if(audActResObj.Audit_Activity__r.Audit_Activity_Resource_Count__c < 1){
                this.AuditActivityResourceCount = '0';
            }

               audActResObj['audActResLink'] = '/lightning/r/Audit_Activity__c/' + record.Id +'/view';
               audActResObj.Audit_Activity__c = audActResObj.Audit_Activity__r.Name;
               audActResObj['audActNumbLink'] = '/lightning/r/Audit_Activity__c/' + this.recordId +'/view';
               audActResList.push(audActResObj);
           });
           this.data = audActResList;
          
          console.log('thius is the process data ====>' + JSON.stringify(audActResList)); 
     }
   }



      

  
 }