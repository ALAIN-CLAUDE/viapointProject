import { LightningElement,wire,track  } from 'lwc';

import getOrgLocations from '@salesforce/apex/cpGetAllLocations.getOrgLocations';
export default class CpGetLocationSLDS extends LightningElement {

  records;
  sortedColumn;
 


  @wire(getOrgLocations )  
  wiredLocation( { error, data } ) {
      if (data) {

          this.records = data;
       
          this.error = undefined;

      } else if ( error ) {

          this.error = error;
          this.records = undefined;

      }
  }  



 


}