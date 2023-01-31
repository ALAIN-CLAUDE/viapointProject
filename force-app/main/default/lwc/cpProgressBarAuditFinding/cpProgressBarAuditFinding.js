import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import AUDIT_FINDING_TITLE_TITLE from '@salesforce/schema/AuditFinding__c.AuditFindingTitle__c';
import AUDIT_FINDING_NAME from '@salesforce/schema/AuditFinding__c.Name';
import AUDIT_FINDING_STATUS from '@salesforce/schema/AuditFinding__c.AuditFindingWorkflowStatus__c';
const fields = [
    AUDIT_FINDING_TITLE_TITLE,
    AUDIT_FINDING_NAME,
    AUDIT_FINDING_STATUS
];


export default class CpProgressBarAuditFinding extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api recordNumber;
    recordTypeIdInfo;
    @track objectInfo;
    @track auditFinding;
    @track auditWorkflowStatus;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error.body || error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: fields })
    auditFinding;

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: AUDIT_FINDING_STATUS })
    wiredValues({ error, data }) {
        if (data) {
            this.auditWorkflowStatus = data.values;
            this.error = undefined;
        } else {
            this.error = error;
            this.auditWorkflowStatus = undefined;
        }
    }

    get auditTitle() {
        return getFieldValue(this.auditFinding.data, AUDIT_FINDING_TITLE_TITLE);
    }

    get auditName() {
        return getFieldValue(this.auditFinding.data, AUDIT_FINDING_NAME);
    }
    
    get auditKeyStatus() {
        return getFieldValue(this.auditFinding.data, AUDIT_FINDING_STATUS);
    }
}