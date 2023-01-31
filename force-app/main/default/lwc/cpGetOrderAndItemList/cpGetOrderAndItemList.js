import { LightningElement,wire,track } from 'lwc';

import getAllOrdersAndItems from '@salesforce/apex/cpGetOrderAndItemList.getAllOrdersAndItems';


const columns = [
    {
        label: 'Order Number', fieldName: 'orderlineUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Order_Number__c'
            }
        }
    },
    { 
        label: 'Product', 
        fieldName: 'Product_Name__c',
        type: 'text',
        
},    
{ 
   label: 'Start Date', 
   fieldName: 'Order_Start_Date__c',
   type: 'date',
   
},    
{ 
   label: 'Status', 
   fieldName: 'Order_Status__c',
   type: 'text',
 //  editable: true
   
},
/*
{
    label: 'New Status',
    fieldName: 'Order_Status__c',
    type: 'picklist',
    typeAttributes: {
        placeholder: 'Choose Status',
        options: [
            { label: 'Draft', value: 'Draft' },
            { label: 'Activated', value: 'Activated' }
            
        ],
        value: { fieldName: 'Order_Status__c' },
        context: { fieldName: 'Id' },
        variant: 'label-hidden',
        name: 'Order_Status__c',
        label: 'Status'
    }
    
},*/
    
    ];

export default class CpGetOrderAndItemList extends LightningElement {
    columns = columns;  
    @track OrdObj;
   
    records;
    lastSavedData;
    error;
    accountId;
    wiredRecords;
    showSpinner = false;
    draftValues = [];
    privateChildren = {};

    @wire(getAllOrdersAndItems)
    cons(result) {
        if(result.data){
            this.OrdObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            console.log('this is the orderlineItems data'+JSON.stringify(result));
         
            resp.forEach(item => item['orderlineUrl'] = '/order/' +item['OrderId']);
            this.OrdObj = resp;
           }
        if (result.error) {
            this.OrdObj = undefined;
        }
    };
    //===========================================c/customDatatableDemo
    
    renderedCallback() {
        if (!this.isComponentLoaded) {
            /* Add Click event listener to listen to window click to reset the picklist selection 
            to text view if context is out of sync*/
            window.addEventListener('click', (evt) => {
                this.handleWindowOnclick(evt);
            });
            this.isComponentLoaded = true;
        }
    }

    disconnectedCallback() {
        window.removeEventListener('click', () => { });
    }

    handleWindowOnclick(context) {
        this.resetPopups('c-datatable-picklist', context);
    }

    //create object value of datatable picklist markup to allow to call callback function with window click event listener
    resetPopups(markup, context) {
        let elementMarkup = this.privateChildren[markup];
        if (elementMarkup) {
            Object.values(elementMarkup).forEach((element) => {
                element.callbacks.reset(context);
            });
        }
    }

    //wire function to get the related opportunity records of account selected
  /*  @wire(getRelatedRecords, { accountId: '$accountId' })
    wiredRelatedRecords(result) {
        this.wiredRecords = result;
        const { data, error } = result;
        if (data) {
            this.records = JSON.parse(JSON.stringify(data));
            this.records.forEach(record => {
                record.linkName = '/' + record.Id;
                if (record.AccountId) {
                    record.linkAccount = '/' + record.AccountId;
                    record.accountName = record.Account.Name;
                }
                record.stageClass = 'slds-cell-edit';
            });
            this.error = undefined;
        } else if (error) {
            this.records = undefined;
            this.error = error;
        } else {
            this.error = undefined;
            this.records = undefined;
        }
        this.lastSavedData = this.records;
        this.showSpinner = false;
    }
*/
    // Event to register the datatable picklist mark up.
    handleItemRegister(event) {
        event.stopPropagation(); //stops the window click to propagate to allow to register of markup.
        const item = event.detail;
        if (!this.privateChildren.hasOwnProperty(item.name))
            this.privateChildren[item.name] = {};
        this.privateChildren[item.name][item.guid] = item;
    }

    handleChange(event) {
        event.preventDefault();
        this.accountId = event.target.value;
        this.showSpinner = true;
    }

    handleCancel(event) {
        event.preventDefault();
        this.records = JSON.parse(JSON.stringify(this.lastSavedData));
        this.handleWindowOnclick('reset');
        this.draftValues = [];
    }
	
	handleCellChange(event) {
        event.preventDefault();
        this.updateDraftValues(event.detail.draftValues[0]);
    }

    //Captures the changed picklist value and updates the records list variable.
    handleValueChange(event) {
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        let updatedItem;
        switch (dataRecieved.label) {
            case 'Status':
                updatedItem = {
                    Id: dataRecieved.context,
                    StageName: dataRecieved.value
                };
                // Set the cell edit class to edited to mark it as value changed.
                this.setClassesOnData(
                    dataRecieved.context,
                    'stageClass',
                    'slds-cell-edit slds-is-edited'
                );
                break;
            default:
                this.setClassesOnData(dataRecieved.context, '', '');
                break;
        }
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
    }

    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.records));
        copyData.forEach((item) => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
        this.records = [...copyData];
    }

    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = JSON.parse(JSON.stringify(this.draftValues));
        copyDraftValues.forEach((item) => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }

    handleEdit(event) {
        event.preventDefault();
        let dataRecieved = event.detail.data;
        this.handleWindowOnclick(dataRecieved.context);
        switch (dataRecieved.label) {
            case 'Status':
                this.setClassesOnData(
                    dataRecieved.context,
                    'stageClass',
                    'slds-cell-edit'
                );
                break;
            default:
                this.setClassesOnData(dataRecieved.context, '', '');
                break;
        };
    }

    setClassesOnData(id, fieldName, fieldValue) {
        this.records = JSON.parse(JSON.stringify(this.records));
        this.records.forEach((detail) => {
            if (detail.Id === id) {
                detail[fieldName] = fieldValue;
            }
        });
    }

    handleSave(event) {
        event.preventDefault();
        this.showSpinner = true;
        // Update the draftvalues
        console.log(JSON.stringify(this.draftValues));
      /*  saveDraftValues({ data: this.draftValues })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Opportunities updated successfully',
                        variant: 'success'
                    })
                );
                //Get the updated list with refreshApex.
                refreshApex(this.wiredRecords).then(() => {
                    this.records.forEach(record => {
                        record.accountNameClass = 'slds-cell-edit';
                        record.stageClass = 'slds-cell-edit';
                    });
                    this.draftValues = [];
                });
            })
            .catch(error => {
                console.log('error : ' + JSON.stringify(error));
                this.showSpinner = false;
            });*/
    }
}