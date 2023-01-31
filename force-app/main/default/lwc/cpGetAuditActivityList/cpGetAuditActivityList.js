import { LightningElement,wire,track } from 'lwc';

import getAllAuditActivities from '@salesforce/apex/cpGetAuditActivityList.getAllAuditActivities';


const columns = [
    {
        label: 'Audit Activity Number', fieldName: 'auditactUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }
        }
    }, {
        label: 'Title',
        fieldName: 'AuditActivityTitle__c',
        type: 'text',
      //  editable: true,
    }, {
        label: 'Start',
        fieldName: 'PlannedStart__c',
        type: 'date', 
        typeAttributes: {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        },
        sortable: false
    }, {
        label: 'Finish',
        fieldName: 'PlannedFinish__c',
        type: 'date', 
        typeAttributes: {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        },
        sortable: false
    }, {
        label: 'Status',
        fieldName: 'AuditActivityWorkflowStatus__c',
        type: 'text',
     //   editable: true,
    }
    
];

export default class CpGetAuditActivityList extends LightningElement {

    columns = columns;
    @track audActObj;
    fldsItemValues = [];
 
    
    @wire(getAllAuditActivities)
    cons(result) {
        if(result.data){
            this.audActObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            console.log('this is the audit actiiiii  data'+JSON.stringify(result.data));
            resp.forEach(item => item['auditactUrl'] = '/auditactivity/' +item['Id']);
            this.audActObj = resp;
            console.log('this is the audit act  data'+JSON.stringify(resp));
        }
        
       
        if (result.error) {
            this.audActObj = undefined;
        }
    };

}