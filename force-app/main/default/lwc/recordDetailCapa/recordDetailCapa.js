import { LightningElement, api } from 'lwc';

export default class RecordDetailCapa extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @api recordNumber;
   
}