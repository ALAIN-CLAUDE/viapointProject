import { LightningElement, api } from 'lwc';

export default class RecordDetailAAResource extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @api recordNumber;
   
}