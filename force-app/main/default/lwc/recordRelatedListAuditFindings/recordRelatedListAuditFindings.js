import { LightningElement, wire, api, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getRelatedAuditFindings from '@salesforce/apex/cpAuditRelatedProducts.getRelatedAuditFindings';
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import basePath from "@salesforce/community/basePath";

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Audit Finding Name', fieldName: 'linkToFindings',type: 'url', sortable: "true",
        typeAttributes:{label:{fieldName: 'Name'}},
    },   
    { label: 'Audit Finding Type', fieldName: 'AuditFindingType__c', type: 'text', sortable: "true" },
    { label: 'CAPA Required', fieldName: 'CapaRequired__c', type: 'text', sortable: "true" },  
    { label: 'Audit Finding Workflow Status', fieldName: 'AuditFindingWorkflowStatus__c', type: 'text', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class RecordRelatedListAuditFindings extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track objectInfo;
    error;
    records;    
    columns = columns;    
    countRecords;
    @track sortBy;
    @track sortDirection;
    labelAuditFindings;


    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;
            console.log('this.objectInfo =', this.objectInfo);
        }
    }

    @wire(getRelatedAuditFindings, {recordId : '$recordId'})
    wiredAuditFindings({ error, data }) {
        if (data) {
            this.records = data;
            this.countRecords = data.length;
            this.labelAuditFindings = 'Audit Findings (' + data.length +')';
            let resp = JSON.parse(JSON.stringify(data));
            resp.forEach( item => {               
                item['linkToFindings'] = basePath +'/auditfinding/'+ item['Id'];
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

}