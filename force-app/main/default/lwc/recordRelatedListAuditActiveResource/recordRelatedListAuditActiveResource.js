import { LightningElement, wire, api, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getRelatedAAResources from '@salesforce/apex/cpAuditRelatedProducts.getRelatedAAResources';
import {refreshApex} from '@salesforce/apex';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import basePath from "@salesforce/community/basePath";

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Resource Name', fieldName: 'linkToAAResource',type: 'url',sortable: "true",
        typeAttributes:{label:{fieldName: 'Name'}},
    },
    { label: 'Resource Title', fieldName: 'resourceTitle',type: 'url', sortable: "true",
        typeAttributes:{label:{fieldName: 'resourceTitle'}}, 
    },
    { label: 'Resource Type', fieldName: 'ResourceType__c', type: 'text', sortable: "true" },   
    { label: 'Audit Activity Resource Workflow Status', fieldName: 'ActivityResourceWorkflowStatus__c', type: 'text', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class RecordRelatedListAuditActiveResource extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api relatedObjectName;
    @track objectInfo;
    error;
    records;    
    columns = columns;
    @track sortBy;
    @track sortDirection;
    labelAuditActivityResources;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    @wire(getRelatedAAResources, {recordId : '$recordId'})
    getRelatedAAResources({ error, data }) {
        this.labelAuditActivityResources = 'Audit Activity Resources (0)';
        if (data) {
           console.log('getRelatedAAResources ', data);
            this.records = data;
            this.countAARecords = data.length;
            this.labelAuditActivityResources = 'Audit Activity Resources (' + data.length +')';
            let resp = JSON.parse(JSON.stringify(data));
            resp.forEach( item => {
                let resource = item['ResourceTitle__c'];
                resource = resource.replace(/<.*?>/ig, '');
                resource = this.htmlDecode(resource);
                item['resourceTitle'] = resource;
                item['linkToAAResource'] = basePath +'/auditactivityresource/' + item['Id'];
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

    htmlDecode(value) {
        var elem = document.createElement('textarea');
        elem.innerHTML = value;
        var decoded = elem.value;
        return decoded;
    }
}