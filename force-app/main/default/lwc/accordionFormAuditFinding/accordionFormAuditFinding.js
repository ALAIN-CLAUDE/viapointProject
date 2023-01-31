import { LightningElement, api, wire, track } from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import basePath from "@salesforce/community/basePath";

import AUDIT_ID_FIELD from '@salesforce/schema/AuditFinding__c.Audit__c';
import AUDIT_NUMBER_FIELD from '@salesforce/schema/AuditFinding__c.AuditNumber__c';
import AUDIT_TITLE_FIELD from '@salesforce/schema/AuditFinding__c.AuditTitle__c';
import AUDIT_FINDING_NUMBER_FIELD from '@salesforce/schema/AuditFinding__c.Name';
import AUDIT_FINDING_TITLE_FIELD from '@salesforce/schema/AuditFinding__c.AuditFindingTitle__c';
import AUDIT_ASSIGNTO_FIELD from '@salesforce/schema/AuditFinding__c.AssignedTo__r.Name';
import AUDIT_FINDING_TYPE_FIELD from '@salesforce/schema/AuditFinding__c.AuditFindingType__c';
import AUDIT_PRIORITY_FIELD from '@salesforce/schema/AuditFinding__c.Priority__c';
import AUDIT_FINDING_FIELD from '@salesforce/schema/AuditFinding__c.Finding__c';
import AUDIT_FINDING_DESCR_FIELD from '@salesforce/schema/AuditFinding__c.AuditFindingDescription__c';
import AUDIT_OBSERVATION_CODE_FIELD from '@salesforce/schema/AuditFinding__c.AuditObservationCode__c';
import AUDIT_OBSERVATION_TYPE_FIELD from '@salesforce/schema/AuditFinding__c.ObservationType__c';
import AUDIT_OBSERVATION_TECNOLOGY_FIELD from '@salesforce/schema/AuditFinding__c.ObservationTechnology__c';
import AUDIT_QUALITY_SYSTEM_REQ_FIELD from '@salesforce/schema/AuditFinding__c.QualitySystemRequirement__c';
import AUDIT_QUALITY_SUB_SYSTEM_REQ_FIELD from '@salesforce/schema/AuditFinding__c.QualitySub_StystemRequirement__c';
import AUDIT_STATUS_FIELD from '@salesforce/schema/AuditFinding__c.AuditFindingWorkflowStatus__c';

import AUDIT_CAPA_REQUIRED_FIELD from '@salesforce/schema/AuditFinding__c.CapaRequired__c';

import AUDIT_CREATEDBY_NAME_FIELD from '@salesforce/schema/AuditFinding__c.CreatedBy.Name';
import AUDIT_CREATED_DATE_FIELD from '@salesforce/schema/AuditFinding__c.CreatedDate';
import AUDIT_LAST_MODIFIED_FIELD from '@salesforce/schema/AuditFinding__c.LastModifiedBy.Name';
import AUDIT_LAST_MODIFIED_DATE_FIELD from '@salesforce/schema/AuditFinding__c.LastModifiedDate';

const fields = [
    AUDIT_ID_FIELD,
    AUDIT_NUMBER_FIELD,
    AUDIT_TITLE_FIELD,
    AUDIT_FINDING_NUMBER_FIELD,
    AUDIT_FINDING_TITLE_FIELD,
    AUDIT_ASSIGNTO_FIELD,
    AUDIT_FINDING_TYPE_FIELD,
    AUDIT_PRIORITY_FIELD,
    AUDIT_FINDING_FIELD,
    AUDIT_FINDING_DESCR_FIELD,
    AUDIT_OBSERVATION_CODE_FIELD,
    AUDIT_OBSERVATION_TYPE_FIELD,
    AUDIT_OBSERVATION_TECNOLOGY_FIELD,
    AUDIT_QUALITY_SYSTEM_REQ_FIELD,
    AUDIT_QUALITY_SUB_SYSTEM_REQ_FIELD,
    AUDIT_STATUS_FIELD,
    AUDIT_CAPA_REQUIRED_FIELD,
    AUDIT_CREATEDBY_NAME_FIELD,
    AUDIT_CREATED_DATE_FIELD,
    AUDIT_LAST_MODIFIED_FIELD,
    AUDIT_LAST_MODIFIED_DATE_FIELD

];

export default class AccordionFormAuditFinding extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @track auditActivity;
    //activeSections = ['A'];

    @wire(getRecord, { recordId: '$recordId', fields })
    auditFinding;
   

    get auditNumberURL() {
        let auditIdValue = String(getFieldValue(this.auditFinding.data, AUDIT_ID_FIELD));
        let linkToAudit = basePath + '/audit/'+ auditIdValue;
        return linkToAudit;
    }

    get auditNumber() {
        let auditNumberValue = String(getFieldValue(this.auditFinding.data, AUDIT_NUMBER_FIELD));  
        auditNumberValue = auditNumberValue.replace(/<.*?>/ig, '');
        return this.htmlDecode(auditNumberValue);
    }

    get auditTitle() {
        let titleName =  String(getFieldValue(this.auditFinding.data, AUDIT_TITLE_FIELD));   
        titleName = titleName.replace(/<.*?>/ig, '');
        return this.htmlDecode(titleName);
    }

    get auditFindingNumber() {
        return getFieldValue(this.auditFinding.data, AUDIT_FINDING_NUMBER_FIELD);
    }

    get auditFindingTitle() {
        return getFieldValue(this.auditFinding.data, AUDIT_FINDING_TITLE_FIELD);
    }

    get assignedTo() {
        return getFieldValue(this.auditFinding.data, AUDIT_ASSIGNTO_FIELD);
    }

    get auditFIndingType() {
        return getFieldValue(this.auditFinding.data, AUDIT_FINDING_TYPE_FIELD);
    }

    get priority() {
        return getFieldValue(this.auditFinding.data, AUDIT_PRIORITY_FIELD);
    }
    get finding() {
        return getFieldValue(this.auditFinding.data, AUDIT_FINDING_FIELD);
    }
    get auditFindingDescription() {
        let description = String(getFieldValue(this.auditFinding.data, AUDIT_FINDING_DESCR_FIELD));
        const replaced = description?.replace(/<\s*[^>]*>/gi, '');
        return !replaced || replaced=== 'null' ? '' : replaced;
    }

    get auditObservationCode() {
        return getFieldValue(this.auditFinding.data, AUDIT_OBSERVATION_CODE_FIELD);
    }

    get observationType() {
        return getFieldValue(this.auditFinding.data, AUDIT_OBSERVATION_TYPE_FIELD);
    }
    get observationTechnology() {
        return getFieldValue(this.auditFinding.data, AUDIT_OBSERVATION_TECNOLOGY_FIELD);
    }
    get qualitySystemRequirement() {
        return getFieldValue(this.auditFinding.data, AUDIT_QUALITY_SYSTEM_REQ_FIELD);
    }
    get qualitySubStystemRequirement() {
        return getFieldValue(this.auditFinding.data, AUDIT_QUALITY_SUB_SYSTEM_REQ_FIELD);
    }
    get auditActivityStatus() {
        return getFieldValue(this.auditFinding.data, AUDIT_STATUS_FIELD);
    }

    get capaRequired() {
        return getFieldValue(this.auditFinding.data, AUDIT_CAPA_REQUIRED_FIELD);
    }

    get auditCreatedByName() {
        let name = getFieldValue(this.auditFinding.data, AUDIT_CREATEDBY_NAME_FIELD);
        return name +', ';
    }
    get auditCreatedDate() {
        return getFieldValue(this.auditFinding.data, AUDIT_CREATED_DATE_FIELD);
    }
    get auditModifiedByName() {
        let name = getFieldValue(this.auditFinding.data, AUDIT_LAST_MODIFIED_FIELD);
        return name +', ';
    }
    get auditModifiedDate() {  
        return getFieldValue(this.auditFinding.data, AUDIT_LAST_MODIFIED_DATE_FIELD);
    }

    checkUnderfined(value) {
        return (value === undefined || value == null || value.length <= 0) ? false : true;
    }

    htmlDecode(value) {
        var elem = document.createElement('textarea');
        elem.innerHTML = value;
        var decoded = elem.value;
        return decoded;
    }
}