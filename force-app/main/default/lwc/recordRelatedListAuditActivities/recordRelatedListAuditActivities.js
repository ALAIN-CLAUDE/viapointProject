import { LightningElement, wire, api, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getRelatedAuditActivities from '@salesforce/apex/cpAuditRelatedProducts.getRelatedAuditActivities';
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import basePath from "@salesforce/community/basePath";

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Audit Activity Name', fieldName: 'auditActUrl',type: 'url',sortable: "true",
    typeAttributes:{label:{fieldName: 'Name'}},
    },
    { label: 'Audit Activity Type', fieldName: 'AuditActivityType__c', type: 'text', sortable: "true" },
    { label: 'Assigned To', fieldName: 'assignTo', type: 'text', sortable: "true" },   
    { label: 'Planned Start', fieldName: 'PlannedStart__c', type: 'date-local', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class RecordRelatedListAuditActivities extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @track objectInfo;
    error;
    records;    
    columns = columns;    
    countRecords;
    @track sortBy;
    @track sortDirection;
    labelAuditActivities;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    @wire(getRelatedAuditActivities, {recordId : '$recordId'})
    wiredAuditProducts({ error, data }) {
        if (data) {
            this.records = data;
            this.countRecords = data.length;
            this.labelAuditActivities = 'Audit Activities (' + data.length +')';
            let resp = JSON.parse(JSON.stringify(data));
            resp.forEach( item => {       
                item['auditActUrl'] = basePath + '/auditactivity/' + item['Id'];
                item['assignTo'] = (item.AssignedTo__c != null) ? item.AssignedTo__r.Name : null;
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