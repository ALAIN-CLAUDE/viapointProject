import { LightningElement, api } from 'lwc';

export default class RecordDetailContact extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
}