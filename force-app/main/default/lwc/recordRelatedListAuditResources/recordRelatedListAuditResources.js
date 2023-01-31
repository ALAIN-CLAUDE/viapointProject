import { LightningElement, wire, api, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getRelatedAuditResources from '@salesforce/apex/cpAuditRelatedProducts.getRelatedAuditResources';
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import basePath from "@salesforce/community/basePath";

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Resource Name', fieldName: 'linkToAuditResource',type: 'url', sortable: "true",
    typeAttributes:{label:{fieldName: 'ResourceTitleLinkless__c'}},
    },
    { label: 'Resource Type', fieldName: 'ResourceType__c', type: 'text', sortable: "true" },
    { label: 'Resource Workflow Status', fieldName: 'ResourceWorkflowStatus__c', type: 'text', sortable: "true" },   
    { label: 'Generic', fieldName: 'Generic__c', type: 'text', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class RecordRelatedListAuditResources extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track objectInfo;
    error;
    records;    
    columns = columns;    
    countRecords;
    @track sortBy;
    @track sortDirection;
    labelAuditResources;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    @wire(getRelatedAuditResources, {recordId : '$recordId'})
    wiredAuditResources({ error, data }) {
        if (data) {
            this.records = data;
            this.countRecords = data.length;
            this.labelAuditResources = 'Audit Resources (' + data.length +')';
            let resp = JSON.parse(JSON.stringify(data));            
            resp.forEach( item => {
                item['linkToAuditResource'] = basePath + '/resource/' + item['Resource__c'];
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