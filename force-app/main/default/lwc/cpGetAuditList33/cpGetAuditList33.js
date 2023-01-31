import { LightningElement,wire,track  } from 'lwc';
import getOrgAudits from '@salesforce/apex/cpGetAuditList.getOrgAudits';


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
    //    editable: true,
    }, {
        label: 'Lead Auditor ',
        fieldName: 'LeadAuditorInternalName__c',
        type: 'text',
     //   editable: true,
    }, {
        label: 'Status',
        fieldName: 'AuditWorkflowStatus__c',
        type: 'text',
     //   editable: true,
    }
    
];

export default class CpGetAuditList33 extends LightningElement {
      
  columns = columns;
  @track audObj;
  fldsItemValues = [];

  @wire(getOrgAudits)
  cons(result) {
      if(result.data){
      this.audObj = result.data;
      let resp  = JSON.parse(JSON.stringify(result.data))
      console.log('this is the audit data'+JSON.stringify(result));
   
      resp.forEach(item => item['auditUrl'] = '/audit/' +item['Id']);
      this.audObj = resp;
     }
    
      if (result.error) {
          this.audObj = undefined;
      }
  };
}