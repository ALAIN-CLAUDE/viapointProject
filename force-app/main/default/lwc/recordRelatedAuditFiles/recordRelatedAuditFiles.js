import { LightningElement, wire, api, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getRelatedAuditFiles from '@salesforce/apex/cpAuditRelatedProducts.getRelatedAuditFiles';
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Title', fieldName: 'Title',type: 'url',sortable: "true", 
    typeAttributes:{label:{fieldName: 'Title'}},
    },
    { label: 'Type', fieldName: 'FileType', type: 'text', sortable: "true" },
    { label: 'Size', fieldName: 'ContentSize', type: 'text', sortable: "true" },   
    { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class RecordRelatedAuditFiles extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track objectInfo;
    error;
    records;    
    columns = columns;    
    countRecords;
    @track sortBy;
    @track sortDirection;
    colorIcon;
    iconLink;

    labelFiles;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;
            //this.colorIcon = 
            this.iconLink = JSON.stringify(this.objectInfo.themeInfo.iconUrl);
        }
    }

    @wire(getRelatedAuditFiles, {recordId : '$recordId'})
    wiredAuditFiles({ error, data }) {
        this.labelFiles = 'Files ( 0 )'; 
        if (data) {
            this.records = data;
            this.countRecords = data.length;
            this.labelFiles = 'Files (' + data.length + ')';            
            let resp = JSON.parse(JSON.stringify(data));
            this.records =  resp;    
        } else if (error) {
           this.error = error;
        }
    }
    handleNew(event) {
        console.log('new ',  event.detail);
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