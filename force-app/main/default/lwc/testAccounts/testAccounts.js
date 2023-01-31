/* eslint-disable no-console */
import { LightningElement , wire, track} from 'lwc';

//import method which should be used from Controller
import getAccountRelDetails from '@salesforce/apex/testApexClass.getAccountRelDetails';

let i=0;

export default class TestAccounts extends LightningElement {
    

    @track items = []; //this will hold key, value pair
    @track value = ''; //initialize combo box value

    @track chosenValue = '';
/*
    @wire(getAccountRelDetails)
    wiredUserRoles({ error, data }) {
        if (data) {

            console.log('all data ==> '+ JSON.Stringify(data));
            //create array with elements which has been retrieved controller
            //here value will be Id and label of combobox will be Name
            for(i=0; i<data.length; i++)  {
                this.items = [...this.items ,{value: data[i].Id , label: data[i].Name} ];   
                                               
            }                
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }
*/
    //gettter to return items which is mapped with options attribute
/*
    get roleOptions() {
        return this.items;
    }

    handleChange(event) {
        // Get the string of the "value" attribute on the selected option
        const selectedOption = event.detail.value;
        console.log('selected value=' + selectedOption);
        this.chosenValue = selectedOption;
    }
*/
    //this value will be shown as selected value of combobox item
  
 

    @wire(getAccountRelDetails)
    cons(result) {
        this.data = result;
        console.log('all data ==> '+ JSON.Stringify(data));
        if (result.error) {
            this.data = undefined;
        }
    };
}