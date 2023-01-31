import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRelatedListsInfo } from 'lightning/uiRelatedListApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import AUDIT_OBJECT from '@salesforce/schema/Audit__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Audit__c.Id';
import NAME_FIELD from '@salesforce/schema/Audit__c.AuditeeExternalPrimaryContact__c';
import LOCATION_FIELD from '@salesforce/schema/Audit__c.Location__r.Name';
import ORGANIZATION_FIELD from '@salesforce/schema/Audit__c.Organization__r.Name';
import AUDIT_TYPE_FIELD from '@salesforce/schema/Audit__c.AuditType__c';
import AUDIT_TITLE_FIELD from '@salesforce/schema/Audit__c.AuditTitle__c';
import DEPARTMENT_FIELD from '@salesforce/schema/Audit__c.AuditDepartment__r.Name';
import REASON_FIELD from '@salesforce/schema/Audit__c.AuditReason__c';
import SCOPE_FIELD from '@salesforce/schema/Audit__c.AuditScope__c';
import AUDIT_EXTERNAL_FIELD from '@salesforce/schema/Audit__c.LeadAuditorExternal__r.Name';
import AUDIT_INTERNAL_FIELD from '@salesforce/schema/Audit__c.LeadAuditorInternal__r.Name';
import AUDIT_INTERNAL_PRIMARY_FIELD from '@salesforce/schema/Audit__c.AuditeeInternalPrimaryContact__r.Name';
import STATUS_FIELD from '@salesforce/schema/Audit__c.AuditWorkflowStatus__c';

import AUDIT_DAYS_REQUIRED_FIELD from '@salesforce/schema/Audit__c.AuditDaysRequired__c';
import AUDIT_HOURS_REQUIRED_FIELD from '@salesforce/schema/Audit__c.AuditHoursRequired__c';

import AUDIT_EARLIEST_START_FIELD from '@salesforce/schema/Audit__c.EarliestStart__c';
import AUDIT_LATEST_START_FIELD from '@salesforce/schema/Audit__c.LatestStart__c';
import AUDIT_EARLIEST_FINISH_FIELD from '@salesforce/schema/Audit__c.EarliestFinish__c';
import AUDIT_LATEST_FINISH_FIELD from '@salesforce/schema/Audit__c.LatestFinish__c';
import AUDIT_PLANNED_START_FIELD from '@salesforce/schema/Audit__c.PlannedStart__c';
import AUDIT_PLANNED_FINISH_FIELD from '@salesforce/schema/Audit__c.PlannedFinish__c';

import AUDIT_ACTUAL_START_FIELD from '@salesforce/schema/Audit__c.ActualStart__c';
import AUDIT_ACTUAL_FINISH_FIELD from '@salesforce/schema/Audit__c.ActualFinish__c';
import AUDIT_CLOSING_MEETING_FIELD from '@salesforce/schema/Audit__c.ClosingMeeting__c';
import AUDIT_DOCUMENT_REVIEWD_FIELD from '@salesforce/schema/Audit__c.DocumentsReviewed__c';
import AUDIT_STAKEH_INTERVIEWED_FIELD from '@salesforce/schema/Audit__c.StakeholdersInterviewed__c';
import AUDIT_ITEMS_OBSERVED_FIELD from '@salesforce/schema/Audit__c.ItemsObserved__c';

import AUDIT_REPORT_DUE_DATE_FIELD from '@salesforce/schema/Audit__c.AuditReportDueDate__c';
import AUDIT_REPORT_APPROVED_DATE_FIELD from '@salesforce/schema/Audit__c.AuditReportApprovedDate__c';
import AUDIT_REPORT_DISTRIB_DATE_FIELD from '@salesforce/schema/Audit__c.AuditReportDistributedDate__c';
import AUDIT_CAPA_REPORT_DUE_DATE_FIELD from '@salesforce/schema/Audit__c.CapaReportDueDate__c';
import AUDIT_CAPA_REPORT_RECEIVED_DATE_FIELD from '@salesforce/schema/Audit__c.CapaReportReceivedDate__c';
import AUDIT_CAPA_REPORT_APPROVED_DATE_FIELD from '@salesforce/schema/Audit__c.CapaReportApprovedDate__c';

import AUDIT_RESULT_FIELD from '@salesforce/schema/Audit__c.AuditResult__c';
import AUDIT_SUMMARY_FIELD from '@salesforce/schema/Audit__c.AuditSummary__c';
import AUDIT_RISK_SCORE_FIELD from '@salesforce/schema/Audit__c.RiskScore__c';
import AUDIT_RECOMMENDATION_FIELD from '@salesforce/schema/Audit__c.Recommendations__c';

import AUDIT_CREATEDBY_NAME_FIELD from '@salesforce/schema/Audit__c.CreatedBy.Name';
import AUDIT_CREATED_DATE_FIELD from '@salesforce/schema/Audit__c.CreatedDate';
import AUDIT_LAST_MODIFIED_FIELD from '@salesforce/schema/Audit__c.LastModifiedBy.Name';
import AUDIT_LAST_MODIFIED_DATE_FIELD from '@salesforce/schema/Audit__c.LastModifiedDate';
//import AUDIT_HOURS_REQUIRED_FIELD from '@salesforce/schema/Audit__c.LatestFinish__c';
import {refreshApex} from '@salesforce/apex';
import getRelatedContacts from '@salesforce/apex/GlobalSearchController.searchContacts';
import { updateRecord } from 'lightning/uiRecordApi';
import LightningAlert from 'lightning/alert';
import LightningConfirm from 'lightning/confirm';
import LightningPrompt from 'lightning/prompt';

const fields = [
    AUDIT_CREATEDBY_NAME_FIELD, AUDIT_CREATED_DATE_FIELD,AUDIT_LAST_MODIFIED_FIELD, AUDIT_LAST_MODIFIED_DATE_FIELD,
    AUDIT_RESULT_FIELD, AUDIT_SUMMARY_FIELD, AUDIT_RISK_SCORE_FIELD, AUDIT_RECOMMENDATION_FIELD,
    AUDIT_REPORT_DUE_DATE_FIELD,AUDIT_REPORT_APPROVED_DATE_FIELD,AUDIT_REPORT_DISTRIB_DATE_FIELD,
    AUDIT_CAPA_REPORT_DUE_DATE_FIELD, AUDIT_CAPA_REPORT_RECEIVED_DATE_FIELD, AUDIT_CAPA_REPORT_APPROVED_DATE_FIELD,
    AUDIT_ACTUAL_START_FIELD, AUDIT_ACTUAL_FINISH_FIELD, AUDIT_CLOSING_MEETING_FIELD,
    AUDIT_DOCUMENT_REVIEWD_FIELD, AUDIT_STAKEH_INTERVIEWED_FIELD, AUDIT_ITEMS_OBSERVED_FIELD,
    NAME_FIELD, AUDIT_EARLIEST_START_FIELD,AUDIT_LATEST_START_FIELD,AUDIT_EARLIEST_FINISH_FIELD,
    AUDIT_LATEST_FINISH_FIELD,AUDIT_PLANNED_START_FIELD, AUDIT_PLANNED_FINISH_FIELD,
    LOCATION_FIELD, 
    ORGANIZATION_FIELD, 
    DEPARTMENT_FIELD, 
    AUDIT_TITLE_FIELD, 
    AUDIT_TYPE_FIELD,
    REASON_FIELD,
    SCOPE_FIELD,
    AUDIT_INTERNAL_FIELD,
    AUDIT_EXTERNAL_FIELD,
    AUDIT_INTERNAL_PRIMARY_FIELD,
    STATUS_FIELD,
    AUDIT_DAYS_REQUIRED_FIELD,
    AUDIT_HOURS_REQUIRED_FIELD

];

export default class RecordDetail extends NavigationMixin(LightningElement) {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @api recordNumber;
    lookupId;
    @track audit;
    //activeSections = ['A'];
    error;
    contactOptions = [];
    relatedLists;
    relatedAuditActivitiesLists;
    bShowModal;
    loaded;
    selectedValue;
    selectedLabel;
    confirmStatus;
    promptValue;


    /*async handleSubmit() {
        await LightningAlert.open({
            message: 'This is an alert message',
            theme: 'success',
            label: 'Alert!'
        });
    }*/

    async handleConfirmClick() {
        const result = await LightningConfirm.open({
            message: 'this is the prompt message',
            variant: 'headerless',
            label: 'this is the aria-label value'
        });

        if (result) {
            this.confirmStatus = 'Ok was clicked';
        } else {
            this.confirmStatus = 'Cancel was clicked';
        }
    }

    handlePromptClick() {
        LightningPrompt.open({
            message: 'Please enter a value',
            label: 'Please Respond',
            defaultValue: 'initial value',
            theme: 'shade'
        }).then((result) => {
            //result is input text if OK clicked and null if cancel was clicked
            this.promptValue = result;
        });
    }


    @wire(getRecord, { recordId: '$recordId', fields })
    audit;

    get contactAudit() {
        return getFieldValue(this.audit.data, NAME_FIELD);
    }
    get auditLocation() {
        return getFieldValue(this.audit.data, LOCATION_FIELD);
    }
    get auditOrganization() {
        return getFieldValue(this.audit.data, ORGANIZATION_FIELD);
    }
    get auditTitle() {
        return getFieldValue(this.audit.data, AUDIT_TITLE_FIELD);
    }
    get auditDepartment() {
        return getFieldValue(this.audit.data, DEPARTMENT_FIELD);
    }
    get auditType() {
        return getFieldValue(this.audit.data, AUDIT_TYPE_FIELD);
    }
    get auditReason() {
        return getFieldValue(this.audit.data, REASON_FIELD);
    }
    get auditScope() {
        return getFieldValue(this.audit.data, SCOPE_FIELD);
    }
    get auditInternal() {
        return getFieldValue(this.audit.data, AUDIT_INTERNAL_FIELD);
    }
    get auditExternal() {
        return getFieldValue(this.audit.data, AUDIT_EXTERNAL_FIELD);
    }
    get auditInternalPrimary() {
        return getFieldValue(this.audit.data, AUDIT_INTERNAL_PRIMARY_FIELD);
    }
    get auditStatus() {
        return getFieldValue(this.audit.data, STATUS_FIELD);
    }
    get auditDaysRequired() {
        return getFieldValue(this.audit.data, AUDIT_DAYS_REQUIRED_FIELD);
    }
    get auditHoursRequired() {
        return getFieldValue(this.audit.data, AUDIT_HOURS_REQUIRED_FIELD);
    }

    get auditEarliesStart() {
        return getFieldValue(this.audit.data, AUDIT_EARLIEST_START_FIELD);
    }
    get auditLatestStart() {
        return getFieldValue(this.audit.data, AUDIT_LATEST_START_FIELD);
    }
    get auditEarliesFinish() {
        return getFieldValue(this.audit.data, AUDIT_EARLIEST_FINISH_FIELD);
    }
    get auditLatestFinish() {
        return getFieldValue(this.audit.data, AUDIT_LATEST_FINISH_FIELD);
    }
    get auditPlannedStart() {
        return getFieldValue(this.audit.data, AUDIT_PLANNED_START_FIELD);
    }
    get auditPlannedFinish() {
        return getFieldValue(this.audit.data, AUDIT_PLANNED_FINISH_FIELD);
    }
    get auditActualStart() {
        return getFieldValue(this.audit.data, AUDIT_ACTUAL_START_FIELD);
    }
    get auditActualFinish() {
        return getFieldValue(this.audit.data, AUDIT_ACTUAL_FINISH_FIELD);
    }
    get auditClosingMeeting() {
        return getFieldValue(this.audit.data, AUDIT_CLOSING_MEETING_FIELD);
    }
    get auditDocumentReviewed() {
        return getFieldValue(this.audit.data, AUDIT_DOCUMENT_REVIEWD_FIELD);
    }
    get auditStakehInterview() {
        return getFieldValue(this.audit.data, AUDIT_STAKEH_INTERVIEWED_FIELD);
    }
    get auditItemsObserved() {       
        return getFieldValue(this.audit.data, AUDIT_ITEMS_OBSERVED_FIELD);
    }   
    get auditReportDueDate() {
        return getFieldValue(this.audit.data, AUDIT_REPORT_DUE_DATE_FIELD);
    }
    get auditReportApprovedDate() {
        return getFieldValue(this.audit.data, AUDIT_REPORT_APPROVED_DATE_FIELD);
    }
    get auditReportDistributDate() {        
        return getFieldValue(this.audit.data, AUDIT_REPORT_DISTRIB_DATE_FIELD);
    }   
    get auditCAPAReportDueDate() {
        return getFieldValue(this.audit.data, AUDIT_CAPA_REPORT_DUE_DATE_FIELD);
    }
    get auditCAPAReportReceivedDate() {
        return getFieldValue(this.audit.data, AUDIT_CAPA_REPORT_RECEIVED_DATE_FIELD);
    }
    get auditCAPAReportApprovedDate() {        
        return getFieldValue(this.audit.data, AUDIT_CAPA_REPORT_APPROVED_DATE_FIELD);
    }    
    get auditResult() {
        return getFieldValue(this.audit.data, AUDIT_RESULT_FIELD);
    }
    get auditSummary() {
        return getFieldValue(this.audit.data, AUDIT_SUMMARY_FIELD);
    }
    get auditRiscScope() {        
        return getFieldValue(this.audit.data, AUDIT_RISK_SCORE_FIELD);
    }
    get auditRecommendation() {
        return getFieldValue(this.audit.data, AUDIT_RECOMMENDATION_FIELD);
    }

    get auditCreatedByName() {
        let name = getFieldValue(this.audit.data, AUDIT_CREATEDBY_NAME_FIELD);
        return name +', ';
    }
    get auditCreatedDate() {
        return getFieldValue(this.audit.data, AUDIT_CREATED_DATE_FIELD);
    }
    get auditModifiedByName() {
        let name = getFieldValue(this.audit.data, AUDIT_LAST_MODIFIED_FIELD);
        return name +', ';
    }
    get auditModifiedDate() {  
        return getFieldValue(this.audit.data, AUDIT_LAST_MODIFIED_DATE_FIELD);
    }

    @wire(getRelatedContacts)
    wiredContacts({ error, data }) {
        if (data) {
            this.contactOptions = data.map((record) => ({                
                value: record.ContactId,
                label: record.Contact.Name
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contactOptions = undefined;
        }
    }

    handleRecordSelected(event) {
        this.selectedValue = event.target.value;
        this.selectedLabel= event.target.label;
        console.log('event.target.value; ', event.target.label);
        this.dispatchEvent(
            new CustomEvent('select', {
                detail: { recordId: event.target.value }
            })
        );
    }

    handleSuccess(event) {
        console.log('onsuccess event recordEditForm',event.detail);
       
        this.showToast();
        return refreshApex(this.audit);
    }
   
    handleSubmit(event) {
        console.log('onsuccess event recordEditForm',event.detail);
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[NAME_FIELD.fieldApiName] =  this.template.querySelector("[data-field='AuditeeExternalPrimaryContact']").value;
        const recordInput = { fields };
        event.preventDefault(); 
        this.template.querySelector('lightning-record-edit-form').submit();
        updateRecord(recordInput)
        .then(() => {
            /*this.showToast();    */        
            return refreshApex(this.audit);
        })
        .catch((error) => {
            this.errorToast(reduceErrors(error).join(', '));
        });
    }

    showToast() {
        this.template.querySelector('c-show-toast-message').showToast(
            'success',
            'Auditee External Primary Contact was successfully updated.');
    }

    errorToast(errorMessage) {
        this.template.querySelector('c-show-toast-message').showToast('error', errorMessage);
    }
 
    showWarningToast() {
        this.template.querySelector('c-custom-toast').showToast('warning', 'This is a Warning Message.');
    }
  
    navigateToRecordList() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectApiName,
                actionName: 'audits'
            }
        });
    }
   
    @wire(getRelatedListsInfo, {
        parentObjectApiName: AUDIT_OBJECT.objectApiName,
        recordTypeId: '012000000000000AAA' //optional
    })listInfo({ error, data }) {
        if (data) {
            //console.log('getRelatedListsInfo', JSON.stringify(data));
            this.relatedLists = data.relatedLists;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.relatedLists = undefined;
        }
    }

}