import { LightningElement, wire, api, track } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { getRelatedListRecordsBatch } from 'lightning/uiRelatedListApi';
import { getRelatedListsInfo } from 'lightning/uiRelatedListApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getAuditRelatedProducts from '@salesforce/apex/cpAuditRelatedProducts.getAuditRelatedProducts';
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import basePath from "@salesforce/community/basePath";

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Product Name', fieldName: 'linkToProduct',type: 'url',sortable: "true",  
    typeAttributes:{label:{fieldName: 'ProductNameTitle'}},
    },
    { label: 'Product Family', fieldName: 'ProductFamily__c', type: 'text', sortable: "true" },
    { label: 'Product Code', fieldName: 'ProductCode__c', type: 'text', sortable: "true" },   
    { label: 'Product Description', fieldName: 'ProductDescription__c', type: 'text', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class RecordRelatedList extends NavigationMixin(LightningElement) {
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

    labelProducts = 'Products (' + this.countRecords + ')';

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;
            //this.colorIcon = 
            this.iconLink = JSON.stringify(this.objectInfo.themeInfo.iconUrl);
            console.log('Products this.objectInfo =',  JSON.stringify(this.objectInfo));
            console.log('Products this.objectInfo colorIcon =',  JSON.stringify(this.objectInfo.themeInfo.color));
            console.log('Products this.objectInfo iconLink =',  JSON.stringify(this.objectInfo.themeInfo.iconUrl));
        }
    }

    @wire(getAuditRelatedProducts, {recordId : '$recordId'})
    wiredAuditProducts({ error, data }) {
        if (data) {
            this.records = data;
            this.refreshApex = data;
            this.countRecords = data.length;
            this.labelProducts = 'Product (' + data.length + ')';
            let baseUrl = basePath;
            let resp = JSON.parse(JSON.stringify(data));           
            resp.forEach( item => {
                let productName = item['ProductName__c'];
                console.log('item', item['ProductName__c']);
                productName = productName.replace(/<\s*[^>]*>/gi, '');
                console.log('productName', productName);
            //this.linkName = productName.replace('&gt;', '>');
                item['ProductNameTitle'] = productName.replace('&gt;', '>');
                item['linkToProduct'] = basePath + '/product/'+ item['Product__c'];
            }
            ); 
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