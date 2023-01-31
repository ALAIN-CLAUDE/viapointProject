import { LightningElement, wire, api, track } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { getRelatedListRecordsBatch } from 'lightning/uiRelatedListApi';
import { getRelatedListsInfo } from 'lightning/uiRelatedListApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getRelatedCapas from '@salesforce/apex/cpAuditRelatedProducts.getRelatedCapas';
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import basePath from "@salesforce/community/basePath";

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'CAPA Number', fieldName: 'linkToCapa',type: 'url',sortable: "true",  
    typeAttributes:{label:{fieldName: 'Name'}},
    },
    { label: 'CAPA Title', fieldName: 'CapaTitle__c', type: 'text', sortable: "true" },
    { label: 'CAPA Type', fieldName: 'CapaType__c', type: 'text', sortable: "true" },   
    { label: 'CAPA Workflow Status', fieldName: 'CapaWorkflowStatus__c', type: 'text', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class RecordRelatedCapa extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track objectInfo;
    @api linkOutputValue = window.location.href;
    error;
    records;    
    columns = columns;    
    countRecords;
    @track sortBy;
    @track sortDirection;
    colorIcon;
    iconLink;
    @track linkPr;

    labelCapas;

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
 
    @wire(getRelatedCapas, {recordId : '$recordId'})
    wiredAuditProducts({ error, data }) {
        if (data) {
            this.records = data;
            this.refreshApex = data;
            this.countRecords = data.length;
            this.labelCapas = 'CAPA (' + data.length + ')';          
            let resp = JSON.parse(JSON.stringify(data));           
            resp.forEach( item => {              
                item['linkToCapa'] = basePath + '/capa/'+ item['Id'];
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


    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }
}