import { LightningElement, wire, api, track } from 'lwc';
import { getRelatedListRecordsBatch } from 'lightning/uiRelatedListApi';
import getAuditRelatedRisks from '@salesforce/apex/cpAuditRelatedProducts.getAuditRelatedRisks';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import basePath from "@salesforce/community/basePath";
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Risk Name', fieldName: 'linkToRiskAssessmant',type: 'url', sortable: "true",
    typeAttributes:{label:{fieldName: 'Name'}},
    },
    { label: 'Risk Assessment Title', fieldName: 'RiskAssessmentTitle__c', type: 'text', sortable: "true"},
    { label: 'Risk Assessment Workflow Status', fieldName: 'RiskAssessmentWorkflowStatus__c', type: 'text', sortable: "true" },
    { label: 'Overall Risk', fieldName: 'OverallRisk__c', type: 'text', sortable: "true" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];
export default class RecordRelatedListRiskAssessments extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track objectInfo;
    error;
    records;
    countRecords;
    columns = columns;
    labelRiskAssessments;
    
    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;            
        }
    }
    @wire(getAuditRelatedRisks, {recordId : '$recordId'})
    wiredAuditRules({ error, data }) {
        if (data) {
            this.records = data;
            this.labelRiskAssessments = 'Risk Assessments (' + data.length +')';
            let resp = JSON.parse(JSON.stringify(data));            
            resp.forEach( item => {            
                item['linkToRiskAssessmant'] = basePath + '/riskassessment/' + item['Id'];
            }
            ); 
            this.records =  resp;
        } else if (error) {
           this.error = error;
        }
    }
    handleResize(event) {
        const sizes = event.detail.columnWidths;
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
                relatedListId: 'Risk_Assessments__r',
                fields: [
                    'RiskAssessment__c.Name', 
                    'RiskAssessment__c.RiskAssessmentTitle__c',
                    'RiskAssessment__c.RiskAssessmentWorkflowStatus__c',
                    'RiskAssessment__c.OverallRisk__c'
                ],
                sortBy: ['RiskAssessment__c.Name']
            }
        ]
    })listInfo({ error, data }) {
        if (data) {
            this.results = data.results;
            console.log('data.RiskAssessment__c', JSON.stringify(data.results));           
           
            let resp  = JSON.parse(JSON.stringify(data.results));         
            resp.forEach(item => {
            console.log('item +>', JSON.stringify(item));
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.results = undefined;
        }
    }*/
}