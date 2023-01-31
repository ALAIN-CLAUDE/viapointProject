import { LightningElement,wire,track } from 'lwc';

import getOrgProducts from '@salesforce/apex/cpGetProductList.getOrgProducts';



const columns = [
    {
        label: 'Product', fieldName: 'prodUrl', type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            }
        }
    },   
     { 
        label: 'Family', 
        fieldName: 'Family',
        type: 'text',
        
}
    
    ];
export default class CpGetProductList extends LightningElement {
    columns = columns;
    @track ProdObj;
   
 
    @wire(getOrgProducts)
    cons(result) {
        if(result.data){
            this.ProdObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            console.log('this is the audit data'+JSON.stringify(result));
         
            resp.forEach(item => item['prodUrl'] = '/product/' +item['Id']);
            this.ProdObj = resp;
           }
        if (result.error) {
            this.ProdObj = undefined;
        }
    };
}