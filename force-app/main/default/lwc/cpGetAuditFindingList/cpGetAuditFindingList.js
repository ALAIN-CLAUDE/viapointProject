import { LightningElement,wire,track } from 'lwc';

import  getOrgAuditFindings from '@salesforce/apex/CpGetAuditFindingList.getOrgAuditFindings';


const columns = [	
   
    {
        label: 'Audit Finding Number', fieldName: 'auditfindingUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }
        }
    }, 
    {
        label: 'Title',
        fieldName: 'AuditFindingTitle__c',
        type: 'text',
    }, {
        label: 'Type',
        fieldName: 'AuditFindingType__c',
        type: 'text',
      //  editable: true,
    }, {
        label: 'CAPA Required',
        fieldName: 'CapaRequired__c',
        type: 'text',
      //  editable: true,
    }, {
        label: 'Status',
        fieldName: 'AuditFindingWorkflowStatus__c',
        type: 'text',
     //   editable: true,
    }
    
];

export default class CpGetAuditFindingList extends LightningElement {

    columns = columns;
    @track audFindObj;
    fldsItemValues = [];
 
    @wire(getOrgAuditFindings)
    cons(result) {
        if(result.data){
            this.audFindObj  = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
           // console.log('this is the audit actiiiii  data'+JSON.stringify(result.data));
            resp.forEach(item => item['auditfindingUrl'] = '/auditfinding/' +item['Id']);
            this.audFindObj  = resp;
           
        }
        
        if (result.error) {
            this.audFindObj = undefined;
        }
    };
  
}