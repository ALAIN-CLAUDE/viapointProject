import { LightningElement, api, wire, track } from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import basePath from "@salesforce/community/basePath";

import AUDIT_FINDING_ID_FIELD from '@salesforce/schema/Capa__c.AuditFindingNumber__c';
import AUDIT_FINDING_NUMBER_FIELD from '@salesforce/schema/Capa__c.AuditFindingNumber__r.Name';
import AUDIT_FINDING_TITLE_FIELD from '@salesforce/schema/Capa__c.AuditFindingTitle__c';
import AUDIT_CAPA_NUMBER_FIELD from '@salesforce/schema/Capa__c.Name';
import AUDIT_CAPA_TITLE_FIELD from '@salesforce/schema/Capa__c.CapaTitle__c';
import AUDIT_ASSIGN_TO_FIELD from '@salesforce/schema/Capa__c.AssignedTo__r.Name';
import AUDIT_CAPA_TYPE_FIELD from '@salesforce/schema/Capa__c.CapaType__c';
import AUDIT_PRIORITY_FIELD from '@salesforce/schema/Capa__c.Priority__c';
import AUDIT_CAPA_FIELD from '@salesforce/schema/Capa__c.Capa__c';
import AUDIT_CAPA_DESCR_FIELD from '@salesforce/schema/Capa__c.CapaDescription__c';
import AUDIT_START_DATE_FIELD from '@salesforce/schema/Capa__c.StartDate__c';
import AUDIT_DUE_DATE_FIELD from '@salesforce/schema/Capa__c.DueDate__c';
import AUDIT_CAPA_STATUS_FIELD from '@salesforce/schema/Capa__c.CapaWorkflowStatus__c';

import AUDIT_CREATEDBY_NAME_FIELD from '@salesforce/schema/Capa__c.CreatedBy.Name';
import AUDIT_CREATED_DATE_FIELD from '@salesforce/schema/Capa__c.CreatedDate';
import AUDIT_LAST_MODIFIED_FIELD from '@salesforce/schema/Capa__c.LastModifiedBy.Name';
import AUDIT_LAST_MODIFIED_DATE_FIELD from '@salesforce/schema/Capa__c.LastModifiedDate';


const fields = [
    AUDIT_FINDING_ID_FIELD,
    AUDIT_FINDING_NUMBER_FIELD, 
    AUDIT_FINDING_TITLE_FIELD, 
    AUDIT_CAPA_NUMBER_FIELD,
    AUDIT_CAPA_TITLE_FIELD,
    AUDIT_ASSIGN_TO_FIELD,
    AUDIT_CAPA_TYPE_FIELD,
    AUDIT_PRIORITY_FIELD,
    AUDIT_CAPA_FIELD,
    AUDIT_CAPA_DESCR_FIELD,
    AUDIT_START_DATE_FIELD,
    AUDIT_DUE_DATE_FIELD,
    AUDIT_CAPA_STATUS_FIELD,
    AUDIT_CREATEDBY_NAME_FIELD,
    AUDIT_CREATED_DATE_FIELD,
    AUDIT_LAST_MODIFIED_FIELD,
    AUDIT_LAST_MODIFIED_DATE_FIELD
];


export default class AccordionCapa extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @track capa;
    //activeSections = ['A'];

    @wire(getRecord, { recordId: '$recordId', fields })
    capa;
   

    get auditFindingNumberURL() {
        let auditFindingId = String(getFieldValue(this.capa.data, AUDIT_FINDING_ID_FIELD));
        let linkToAuditFinding = basePath + '/auditfinding/'+ auditFindingId;
        return linkToAuditFinding;
    }

    get auditFindingNumber() {
        let auditFindingNumber = String(getFieldValue(this.capa.data, AUDIT_FINDING_NUMBER_FIELD));  
        auditFindingNumber = auditFindingNumber.replace(/<.*?>/ig, '');
        return this.htmlDecode(auditFindingNumber);
    }

    get auditFindingTitle() {
        let auditFindingTitle = String(getFieldValue(this.capa.data, AUDIT_FINDING_TITLE_FIELD));  
        auditFindingTitle = auditFindingTitle.replace(/<.*?>/ig, '');
        return this.htmlDecode(auditFindingTitle);
    }

    get capaNumber() {  
        return getFieldValue(this.capa.data, AUDIT_CAPA_NUMBER_FIELD);
    }

    get capaTitle() {  
        return getFieldValue(this.capa.data, AUDIT_CAPA_TITLE_FIELD);
    }

    get capaAssignedTo() {  
        return getFieldValue(this.capa.data, AUDIT_ASSIGN_TO_FIELD);
    }

    get capaType() {  
        return getFieldValue(this.capa.data, AUDIT_CAPA_TYPE_FIELD);
    }

    get capaPriority() {  
        return getFieldValue(this.capa.data, AUDIT_PRIORITY_FIELD);
    }

    get capaValue() {  
        return getFieldValue(this.capa.data, AUDIT_CAPA_FIELD);
    }

    get capaDescription() { 
        let description= String(getFieldValue(this.capa.data, AUDIT_CAPA_DESCR_FIELD));
        description = description.replace(/<.*?>/ig, '');
        return this.htmlDecode(description);
    }

    get capaStartDate() {  
        return getFieldValue(this.capa.data, AUDIT_START_DATE_FIELD);
    }

    get capaDueDate() {  
        return getFieldValue(this.capa.data, AUDIT_DUE_DATE_FIELD);
    }

    get capaStatus() {  
        return getFieldValue(this.capa.data, AUDIT_CAPA_STATUS_FIELD);
    }

    get auditCreatedByName() {
        let name = getFieldValue(this.capa.data, AUDIT_CREATEDBY_NAME_FIELD);
        return name +', ';
    }

    get auditCreatedDate() {
        return getFieldValue(this.capa.data, AUDIT_CREATED_DATE_FIELD);
    }

    get auditModifiedByName() {
        let name = getFieldValue(this.capa.data, AUDIT_LAST_MODIFIED_FIELD);
        return name +', ';
    }

    get auditModifiedDate() {  
        return getFieldValue(this.capa.data, AUDIT_LAST_MODIFIED_DATE_FIELD);
    }

    htmlDecode(value) {
        var elem = document.createElement('textarea');
        elem.innerHTML = value;
        var decoded = elem.value;
        return decoded;
    }
}