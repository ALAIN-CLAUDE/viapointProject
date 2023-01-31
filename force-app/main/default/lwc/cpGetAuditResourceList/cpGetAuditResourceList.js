import { LightningElement,wire,track } from 'lwc';

import getOrgAudResources from '@salesforce/apex/cpGetAuditResourceList.getOrgAudResources';


const columns = [
    {
        label: 'Audit Resource Number', fieldName: 'audResUrl', type: 'url',
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
    }, {
        label: 'Resource',
        fieldName: 'ResourceTitleLinkless__c',
        type: 'text',
     //   editable: true,
    }, {
        label: 'Resource Type',
        fieldName: 'ResourceType__c',
        type: 'text',
     //   editable: true,
    }, {
        label: 'Status',
        fieldName: 'ResourceWorkflowStatus__c',
        type: 'text',
      //  editable: true,
    }
    
];

export default class CpGetAuditResourceList extends LightningElement {

    
    columns = columns;
    @track audResObj;
    fldsItemValues = [];
 
    @wire(getOrgAudResources)
    cons(result) {
        if(result.data){
            this.audResObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            console.log('this is the audit res  data'+JSON.stringify(result.data));
            resp.forEach(item => item['audResUrl'] = '/auditresource/' +item['Id']);
            this.audResObj  = resp;
           
        }
        if (result.error) {
            this.audResObj = undefined;
        }
    };
  
}