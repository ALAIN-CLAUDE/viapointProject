import { LightningElement, api} from 'lwc';

export default class RecordDetailLocation extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @api recordNumber;
   
}