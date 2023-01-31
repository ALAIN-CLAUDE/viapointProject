import {
    LightningElement,
    api,
    wire,
    track
} from 'lwc';


import getAuditActivityResources from '@salesforce/apex/AuditActivityResourceAuditController.getAuditActivityResources2';
import {
    deleteRecord
} from 'lightning/uiRecordApi';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import getAuditResources from '@salesforce/apex/AuditActivityResourceAuditController.getAuditResources';
import getAuditActivity from '@salesforce/apex/AuditActivityResourceAuditController.getAuditActivity';
import createAuditActivResource from '@salesforce/apex/AuditActivityResourceAuditController.createAuditActivResource';
import {
    NavigationMixin
} from 'lightning/navigation';
import {
    refreshApex
} from '@salesforce/apex';
import getUserDetails from '@salesforce/apex/AuditActivityResourceAuditController.getUserDetails';
import Id from '@salesforce/user/Id';
import {
    publish,
    subscribe,
    MessageContext
} from "lightning/messageService";
import AUDIT_UPDATE from "@salesforce/messageChannel/DataUpdate__c";

let i = 0;
export default class SideBarAuditActivityResource extends NavigationMixin(LightningElement) {



    @api recordId;
    @track Processeddata;
    refreshTable;


    //track all input fields values
    @track chosenValue = '';
    @track reqAlloMethValue = '';
    @track audActResWorkStatValue = '';
    @track RequestAllocationUnitsvalue;
    @track RequestDescripValue;
    @track AudActResRecoreId;
    @track auditResourceId;
    @track errorMsg;


    @track selectedRecordName;
    @track deleteShowModal = false;
    @track bShowModal = false;
    @track currentRecordId;
    @track isEditForm = false;
    @track showLoadingSpinner = false;
    @track error;
    @api AuditId;
    @track currentAudActId;
    @track AuditResources;
    @track items = []; //this will hold key, value pair
    @track value = ''; //initialize combo box value
    resetpage = false;
    redirect = true;
    @track isModalOpen = false;
    //value = '';
    AuditActivityResources;
    @track showLoading = false;
    // non-reactive variables
    selectedRecords = [];
    refreshTable;
    error;
    //AuditActivityName='';
    @track AuditActivityName;
    @track AuditActivityResourceCount = '0';
    @track createdauditActResName;
    AuditActResCreation = {}; // field used for validation
    @track currentRecordName;
    @track SmallPhotoUrl;
    @track loaded;
    @track userName
    @track createdbyUserId;
    @track createdbyUserName;
    @track modifiedbyName;
    @track CreatedDate;
    @track LastModifiedDate;
    @track LastModifiedById;
    auditActivityRes; //this is the auditAct resourse
    @track ViewAllUrlRelatedList;
    @track eventGrabbed;
    @track UserError;
    @track user;
    userId = Id;
    @track UserProfilePics;
    @track UserTimeZone;

    connectedCallback() {
        this.handleSubscribe()
    }

    publishAuditUpdate() {
        const messaage = {
            recordId: this.recordId,
            name: "test"
        };

        //4. Publishing the message
        publish(this.messageContext, AUDIT_UPDATE, messaage);
    }

    @wire(MessageContext)
    messageContext;

    receivedMessage;
    subscription = null;
    //3. Handling the user input
    handleSubscribe() {
        console.log("in handle subscribe");
        if (this.subscription) {
            return;
        }

        //4. Subscribing to the message channel
        this.subscription = subscribe(
            this.messageContext,
            AUDIT_UPDATE,
            (message) => {
                refreshApex(this.refreshTable);
            }
        );
    }
    navitageToLWCWithoutAura(event) {
        event.preventDefault();
        let componentDef = {
            componentDef: "c:relatedListView",
            attributes: {
                recordId: this.recordId
            }
        };
        // Encode the componentDefinition JS object to Base64 format to make it url addressable
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedComponentDef
            }
        });
    }


    @wire(getUserDetails, {
        recId: '$userId'
    })
    wiredUser(Userdata) {

        this.Userdata = Userdata;

        const {
            data,
            error
        } = Userdata;

        console.log('wiredUser: ' + JSON.stringify(Userdata));

        if (data) {
            this.user = data;

        } else if (error) {

            this.UserError = error;

        }
    }

    // retrieving the data using wire service
    @wire(getAuditActivityResources, {
        auditActivityId: '$recordId'
    })
    wiredAudActRes(refreshTable) {

        this.refreshTable = refreshTable;
        this.Processeddata = null;
        this.AuditActivityResourceCount = 0;
        const {
            data,
            error
        } = refreshTable; // destructure it for convenience
        if (data) {
            console.log('thius is the data ====>' + data);
            this.AuditActivityResources = data;

            let audActResList = [];

            let baseUrl = 'https://' + location.host + '/';
            //loop through the list of contacts and assign an icon based on the rating
            this.AuditActivityResources.forEach(record => {
                //copy the details in record object to contactObj object
                let audActResObj = {
                    ...record
                };
                /* Prepare the Org Host */
                this.createdbyUserId = audActResObj.CreatedById;
                this.createdbyUserName = audActResObj.OwnerName__c;
                this.modifiedbyName = audActResObj.modifiedbyName__c;
                this.CreatedDate = audActResObj.CreatedDate;
                this.LastModifiedDate = audActResObj.LastModifiedDate;
                this.auditActivityRes = audActResObj;
                this.LastModifiedById = audActResObj.LastModifiedById;
                this.UserTimeZone = audActResObj.UserTimeZone__c;

                this.UserProfilePics = this.user[0]["SmallPhotoUrl"];

                console.log('this userId ====>' + audActResObj.CreatedById);



                if (audActResObj.AuditResource__c) {
                    audActResObj.ResourceTitle__c = audActResObj.AuditResource__r.AuditResourceTitle__c;
                    /* Prepare Audit Resource Detail Page Url */
                    audActResObj.ResourceUrl = baseUrl + audActResObj.AuditResource__r.Resource__c;

                    audActResObj.NameUrl = '/lightning/r/AuditActivityResource__c/' + audActResObj.Id + '/view';




                }

                if (audActResObj.AuditActivity__r.AuditActivityResourceCount__c > 3) {
                    this.AuditActivityResourceCount = '3+'
                    console.log('total record==' + this.AuditActivityResourceCount)
                } else if (audActResObj.AuditActivity__r.AuditActivityResourceCount__c <= 3 || audActResObj.AuditActivity__r.AuditActivityResourceCount__c >= 1) {
                    this.AuditActivityResourceCount = audActResObj.AuditActivity__r.AuditActivityResourceCount__c;
                } else if (audActResObj.AuditActivity__r.AuditActivityResourceCount__c < 1) {
                    this.AuditActivityResourceCount = '0';
                }


                audActResObj['audActResLink'] = '/lightning/r/AuditActivity__c/' + record.Id + '/view';

                audActResList.push(audActResObj);
            });

            this.Processeddata = audActResList;

            console.log('thius is the process data ====>' + audActResList);
        }
    }


    handleMenuItem(event) {
        console.log("selected menu => " + event.detail.value);
        switch (event.currentTarget.dataset.recid) {
            case "Edit":
                //do logic
                this.editCurrentRecord(row);
                break;
            case "Delete":
                //do logic
                this.deleteAuditActRes(event);
                break;
        }
    }



    deleteAuditActRes(event) {
        this.deleteShowModal = true;

        this.eventGrabbed = event.currentTarget.dataset.recid;
        console.log('this is selected id ' + this.eventGrabbed);

    }

    DeleteRecord(event) {
        console.log('delete button was clicked from modale');
        console.log('this is selected row id ==> ' + this.eventGrabbed);

        let currentRecord = this.eventGrabbed;

        this.AuditActivityResources.forEach(record => {
            //copy the details in record object to contactObj object

            if (record.Id === currentRecord) {
                console.log('record name from grabbed ==' + record.Name);
                this.selectedRecordName = record.Name;
            }
        });



        deleteRecord(currentRecord)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Audit Activity Resource "' + this.selectedRecordName + '" was deleted.',
                        message: '',
                        variant: 'success',
                    }),
                );
                this.deleteShowModal = false;
                this.publishAuditUpdate();
                return refreshApex(this.refreshTable);

            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.message,
                        variant: 'error',
                    }),
                );

            });


    }










    @wire(getAuditActivity, {
        auditActivityId: '$recordId'
    })
    wiredAudAct(result) {
        if (result.data) {
            let AudActName = result.data[0].Name;

            console.log('audit activity name == > ' + AudActName);
            this.AuditActivityName = AudActName;

            console.log('total record==' + this.AuditActivityResourceCount)
            if (result.data[0].Audit__c) {
                let audId = result.data[0].Audit__c;
                this.AuditId = audId;
                let audactivId = result.data[0].Id;
                this.currentAudActId = audactivId;
                this.ViewAllUrlRelatedList = '/lightning/r/AuditActivity__c/' + audactivId + '/related/AuditActivityResources__r/view';

                this.error = undefined;
                console.log(result.data);
                console.log(audId);
                console.log('this is secod id ' + this.AuditId);
            } else {
                console.log('No valid ids');
            }

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }







    editCurrentRecord(event) {
        // open modal box
        this.bShowModal = true;
        this.isEditForm = true;

        // assign record id to the record edit form
        let theRecordId = event.currentTarget.dataset.recid;
        this.currentRecordId = event.currentTarget.dataset.recid;
        console.log('this is current record Id===>' + this.currentRecordId);

        this.AuditActivityResources.forEach(record => {
            let audActResObj = {
                ...record
            };
            let name = audActResObj.Name;
            let idss = audActResObj.Id;
            console.log(name);
            console.log(idss);
            if (audActResObj.Id === theRecordId) {
                this.currentRecordName = audActResObj.Name;

            }

        });

    }






    // handleing record edit form submit
    handleSubmitButtonClick(event) {
        this.loaded = true;
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit();


        // closing modal
        this.bShowModal = false;

        // showing success message
        this.dispatchEvent(new ShowToastEvent({
            title: 'Audit Activity Resource "' + this.currentRecordName + '" was saved.',
            message: '',
            variant: 'success'
        }), );
        this.loaded = false;
        this.publishAuditUpdate();
        return refreshApex(this.refreshTable);


    }


    // handleing record edit form submit
    handleSubmitAndNew(event) {
        this.showLoading = true;
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit();


        // closing modal
        this.bShowModal = false;

        // showing success message
        this.dispatchEvent(new ShowToastEvent({
            title: 'Audit Activity Resource "' + this.currentRecordName + '" was saved.',
            message: '',
            variant: 'success'
        }), );
        this.handleNewButton(event);
    }




    // refreshing the datatable after record edit form success
    handleSuccess() {
        this.publishAuditUpdate();
        return refreshApex(this.refreshTable);
    }




    closeModal(event) {

        // to close modal set isModalOpen tarck value as false
        this.handleResetForm();
        this.bShowModal = false;
        this.isModalOpen = false;
        this.deleteShowModal = false;

        // refreshing table data using refresh apex
        eval("$A.get('e.force:refreshView').fire();");
        //  window.location.reload();


    }


    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

    //options for request allocation method picklist
    get ReqAllMethodoptions() {
        return [{
                label: 'FTE %',
                value: 'FTE %'
            },
            {
                label: 'Hours',
                value: 'Hours'
            },
        ];
    }

    //onchange for request allocation method picklist
    ReqAlloMethandleChange(event) {
        this.reqAlloMethValue = event.detail.value;
    }


    //options for Audit Activity Resource Workflow Status picklist
    get audActResWorkStatoptions() {
        return [{
                label: '--None--',
                value: 'None'
            },
            {
                label: 'Draft',
                value: 'Draft'
            },
            {
                label: 'Proposed',
                value: 'Proposed'
            },
            {
                label: 'Allocated',
                value: 'Allocated'
            },
            {
                label: 'Rejected',
                value: 'Rejected'
            },
            {
                label: 'Cancelled',
                value: 'Cancelled'
            },
        ];
    }



    //onchange for  Audit Activity Resource Workflow Status picklist
    audActResWorkStathandleChange(event) {
        this.audActResWorkStatValue = event.detail.value;
    }


    handleResetForm() {

        this.template.querySelectorAll('.validate').forEach((input) => {
            input.value = '';
        });


    }

    handleNewButton(event) {

        this.handleResetForm();
        this.value = '';
        this.reqAlloMethValue = '';
        this.RequestAllocationUnitsvalue = '';
        this.RequestDescripValue = '';
        this.audActResWorkStatValue = '';
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
        console.log('should reset form now');

        if (this.AuditId) {
            getAuditResources({
                    auditId: this.AuditId
                })
                .then(result => {
                    if (result) {
                        console.log('This is new result ' + result);
                        var audResData = JSON.stringify(result);


                        console.log('this is na stringaayyy' + audResData);



                        let Dataforloop = JSON.parse(audResData);

                        this.items = [];

                        for (i = 0; i < Dataforloop.length; i++) {

                            const option = {
                                label: Dataforloop[i].Resource__r.Name,
                                value: Dataforloop[i].Id
                            };

                            this.items = [...this.items, option];

                            console.log(this.items);
                        }




                    } else {
                        console.log('no result.data found');
                    }


                })
                .catch(error => {
                    this.error = error;
                });
        } else {
            console.log('maybe no Resources objects');
        }



    }



    get Resoptions() {
        return this.items;
    }


    newAudActReshandleChange(event) {


        const selectedOption = event.detail.value;
        console.log('selected value=' + selectedOption);
        this.chosenValue = selectedOption;


        if (event.target.name == 'Resource') {

            this.auditResourceId = selectedOption;


        }
        if (event.target.name == 'Request Allocation Method') {
            this.reqAlloMethValue = event.target.value;
        }

        if (event.target.name == 'Audit Activity Resource Workflow Status') {
            this.audActResWorkStatValue = event.target.value;
        }
        if (event.target.name == 'Request Allocation Units') {
            this.RequestAllocationUnitsvalue = event.target.value;
        }
        if (event.target.name == 'Request Description') {
            this.RequestDescripValue = event.target.value;

        }



    }


    get selectedValue() {
        return this.chosenValue;
    }

    ///validation 
    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
            this.AuditActResCreation[inputField.name] = inputField.value;
        });
        return isValid;
    }


    //handling save button in popup modal 

    handleSave() {
        this.loaded = true;
        /////////////////section to create audit resource from apex method
        if (this.isInputValid()) {


            createAuditActivResource({
                    theAuditId: this.AuditId,
                    theAuditActivityId: this.currentAudActId,
                    theAuditResourceId: this.auditResourceId,
                    RequestAllocationMethod: this.reqAlloMethValue,
                    RequestAllocationUnits: this.RequestAllocationUnitsvalue,
                    RequestDescription: this.RequestDescripValue,
                    WorkflowStatus: this.audActResWorkStatValue
                })
                .then(result => {
                    this.AudActResRecoreId = result.Id;
                    this.createdauditActResName = result.Name;
                    this.loaded = false;
                    console.log('the created result id and name ==>' + result.Id + ' this name ==>' + result.name);
                    this.isModalOpen = false;
                    const toastEvent = new ShowToastEvent({
                        title: 'Audit Activity Resource "' + this.createdauditActResName + '" was created.',
                        message: '',
                        variant: 'success'
                    });
                    this.dispatchEvent(toastEvent);
                    eval("$A.get('e.force:refreshView').fire();");
                    this.publishAuditUpdate();
                    return refreshApex(this.refreshTable);

                })
                .catch(error => {
                    this.errorMsg = error.message;
                    window.console.log(this.error);
                });



        } else {

        }
    }



    handleSaveForSaveAndNew() {
        this.loaded = true;
        createAuditActivResource({
                theAuditId: this.AuditId,
                theAuditActivityId: this.currentAudActId,
                theAuditResourceId: this.auditResourceId,
                RequestAllocationMethod: this.reqAlloMethValue,
                RequestAllocationUnits: this.RequestAllocationUnitsvalue,
                RequestDescription: this.RequestDescripValue,
                WorkflowStatus: this.audActResWorkStatValue
            })
            .then(result => {
                this.AudActResRecoreId = result.Id;
                this.createdauditActResName = result.Name;
                this.loaded = false;
                //this.isModalOpen = false;
                const toastEvent = new ShowToastEvent({
                    title: 'Audit Activity Resource "' + this.createdauditActResName + '" was created.',
                    message: '',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);

                eval("$A.get('e.force:refreshView').fire();");
                // refreshing table data using refresh apex
                this.publishAuditUpdate();
                return refreshApex(this.refreshTable);


            })
            .catch(error => {
                this.errorMsg = error.message;
                window.console.log(this.error);
            });



    }




    handleSaveAndNew() {
        console.log('save and new was clicked ');
        this.handleSaveForSaveAndNew();
        this.handleResetForm();

    }




}