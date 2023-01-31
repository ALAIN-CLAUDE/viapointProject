import { LightningElement, wire, api, track } from 'lwc';
import basePath from "@salesforce/community/basePath";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getAuditRelatedPreAudit from '@salesforce/apex/cpAuditRelatedProducts.getAuditRelatedPreAudit';
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Name', fieldName: 'linkToPreAudit',type: 'url', sortable: "true",
    typeAttributes:{label:{fieldName: 'Name'}},
    },
    { label: 'Location', fieldName: 'nameLocation', type: 'text', sortable: "true" },
    { label: 'Assigned To', fieldName: 'assignTo', type: 'text', sortable: "true" },
    { label: 'Effective Start', fieldName: 'EffectiveStart__c', type: 'date-local', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];


export default class RecordRelatedListPreAudit extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track objectInfo;
    error;
    records;    
    columns = columns;    
    countRecords;
    @track sortBy;
    @track sortDirection;
    labelPreAuditQuestionnaires;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    @wire(getAuditRelatedPreAudit, {recordId : '$recordId'})
    wiredPreAudit({ error, data }) {
        if (data) {
            this.records = data;
            this.labelPreAuditQuestionnaires = 'Pre Audit Questionnaires (' + data.length +')';
            let resp = JSON.parse(JSON.stringify(data));            
            resp.forEach( item => {               
                item['nameLocation'] = (item['Location__c'] != null ) ? item.Location__r.Name : ' ';
                item['assignTo'] = (item['AssignedTo__c'] != null ) ? item.AssignedTo__r.Name : ' ';
                item['linkToPreAudit'] = basePath + '/preauditquestionnaire/' + item['Id'];
            }
            ); 
            this.records =  resp;   
        } else if (error) {
           this.error = error;
        }
    }
    handleSortData(event) {       
        this.sortBy = event.detail.fieldName;       
        this.sortDirection = event.detail.sortDirection;       
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }
    sortData(fieldname, direction) {
        
        let parseData = JSON.parse(JSON.stringify( this.records));
       
        let keyValue = (a) => {
            return a[fieldname];
        };


       let isReverse = direction === 'asc' ? 1: -1;
           parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
           
            return isReverse * ((x > y) - (y > x));
        });
        this.records = parseData;
    }
/*
    @wire(getRelatedListRecordsBatch, {
        parentRecordId: "a0076000000ieXoAAI",
        relatedListParameters: [
            {
                relatedListId: 'Pre_Audit_Questionnaires__r',
                fields: [
                    'PreAuditQuestionnaire__c.Name', 
                    'PreAuditQuestionnaire__c.Location__c',
                    'PreAuditQuestionnaire__c.AssignedTo__c',
                    'PreAuditQuestionnaire__c.EffectiveStart__c'],
                sortBy: ['PreAuditQuestionnaire__c.Name']
            }
        ]
    })listInfo({ error, data }) {
        if (data) {
            this.results = data.results;
            console.log('PreAuditQuestionnaire results', JSON.stringify(data.results));           
           
            let resp  = JSON.parse(JSON.stringify(data.results));         
            
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.results = undefined;
        }
    }*/
}