import { LightningElement, api } from 'lwc';

export default class RecordDetailAuditFinding extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @api recordNumber;
}