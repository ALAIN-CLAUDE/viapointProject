import { LightningElement, api } from 'lwc';

export default class RowInput extends LightningElement {
    @api itemValue;
    inputValue;
}