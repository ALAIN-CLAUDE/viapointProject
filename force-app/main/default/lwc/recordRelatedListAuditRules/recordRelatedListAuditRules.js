import { LightningElement, wire, api, track } from 'lwc';
import { getRelatedListRecordsBatch } from 'lightning/uiRelatedListApi';
import getAuditRelatedRules from '@salesforce/apex/cpAuditRelatedProducts.getAuditRelatedRules';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import basePath from "@salesforce/community/basePath";
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';


const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Rule Name', fieldName: 'linkToRule',type: 'url', sortable: "true",
    typeAttributes:{label:{fieldName: 'ruleNameTitle'}},
    },
    { label: 'Rule Title', fieldName: 'RuleTitle__c', type: 'text',  sortable: "true"},
    { label: 'Rule Set', fieldName: 'RuleSet__c', type: 'text',  sortable: "true" },
    { label: 'Rule Workflow Status', fieldName: 'RuleWorkflowStatus__c', type: 'text',  sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];
export default class RecordRelatedListAuditRules extends  NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @track objectInfo;
    error;
    records;
    countRecords;    
    records;    
    columns = columns;    
    countRecords;
    @track sortBy;
    @track sortDirection;
    labelAuditRules;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;            
        }
    }
    @wire(getAuditRelatedRules, {recordId : '$recordId'})
    wiredAuditRules({ error, data }) {
        if (data) {
            this.records = data;
            this.labelAuditRules ='Audit Rules (' + data.length +')';
            let resp = JSON.parse(JSON.stringify(data));           
            resp.forEach( item => {
                let ruleName = item['RuleNumber__c'];              
                ruleName = ruleName.replace(/<\s*[^>]*>/gi, '');
                console.log('ruleName', ruleName);
            //this.linkName = productName.replace('&gt;', '>');
                item['ruleNameTitle'] = ruleName.replace('&gt;', '>');
                item['linkToRule'] = basePath+ '/rule/' + item['Rule__c'];
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
                relatedListId: 'Audit_Rules__r',
                fields: ['AuditRule__c.Name', 'AuditRule__c.RuleTitle__c','AuditRule__c.RuleSet__c','AuditRule__c.RuleWorkflowStatus__c'],
                sortBy: ['AuditRule__c.Name']
            }
        ]
    })listInfo({ error, data }) {
        if (data) {
            this.results = data.results;
            console.log('data.data.results', JSON.stringify(data.results));           
           
            let resp  = JSON.parse(JSON.stringify(data.results));         
            resp.forEach(item => {
            console.log('item +>', JSON.stringify(item));
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.results = undefined;
        }
    }
    */
}