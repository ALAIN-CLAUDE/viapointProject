import { LightningElement,wire,track } from 'lwc';


import getOrgAudActivityResource from '@salesforce/apex/cpGetAuditActivityResourceList.getOrgAudActivityResource';



const columns = [
    {
        label: 'Audit Activity Resource Number', fieldName: 'auditactresUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }
        }
    },
    { 
          label: 'Audit', 
        fieldName: 'AuditTitle__c',
       type: 'text',
                    
   }, 
      
     { 
        label: 'Activity', 
        fieldName: 'AuditActivity__c',
        type: 'text',
        
},      
    
    { 
        label: 'Resource', 
        fieldName: 'ResourceTitle__c',
        type: 'text',
       
    },
    {
        label: 'Status',
        fieldName: 'ActivityResourceWorkflowStatus__c',
        type: 'Picklist',
        
    }
    
    ];

    
export default class CpGetAuditActivityResourceList extends LightningElement {
    
    columns = columns;
    @track data;
    AuditActivityResources;
    fldsItemValues = [];
 
    @wire(getOrgAudActivityResource)
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
             //copy the details in record object 
             let audActResObj = {...record};
                             /* Prepare the Org Host */
       
            audActResObj.AuditTitle__c= audActResObj.Audit__r.AuditTitle__c;
            audActResObj.ResourceTitle__c =  audActResObj.AuditResource__r.AuditResourceTitle__c ;

             audActResObj['audActResLink'] = '/lightning/r/AuditActivity__c/' + record.Id +'/view';
             audActResObj.AuditActivity__c = audActResObj.AuditActivity__r.AuditActivityTitle__c;
             audActResObj['audActNumbLink'] = '/lightning/r/AuditActivity__c/' + this.recordId +'/view';
             audActResObj['auditactresUrl'] = '/auditactivityresource/' +audActResObj['Id'];
           
             audActResList.push(audActResObj);
         });
        
         this.data = audActResList;
    
        console.log('thius is the process data ====>' + JSON.stringify(audActResList)); 
        
   }
 }
 


 
}